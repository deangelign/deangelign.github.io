////////////////////////////////Image class
var MyImage = function () {
    this.matrix = [[]];
}


var MyImage = function (height,width) {
    this.matrix = [];
    for(var i=0; i<height; i++){
        this.matrix[i] = [];
        for(var j=0; j<width; j++){
            this.matrix[i][j] = 0;
        }
    }
}
//////////////////////////////////////////

/////////////////////////////////////////////complex class
var MyComplex = function () {
    this.realComponent = 0;
    this.imagineyComponent = 0;
}
//
var MyComplex = function (realComponent,imagineyComponent) {
    this.realComponent = realComponent;
    this.imagineyComponent = imagineyComponent;
}

MyComplex.prototype.multiply = function(complexNnumber)
{
    this.realComponent = (this.realComponent*complexNnumber.realComponent) - (this.imagineyComponent*complexNnumber.imagineyComponent) ;
    this.imagineyComponent = (this.realComponent*complexNnumber.imagineyComponent) - (this.imagineyComponent*complexNnumber.realComponent);
};

MyComplex.prototype.add = function(complexNnumber)
{
    this.realComponent = this.realComponent + complexNnumber.realComponent ;
    this.imagineyComponent = this.imagineyComponent + complexNnumber.imagineyComponent;
}

/////////////////////////////////////////////


var imageHeightFFT;
var imageWidthtFFT;

var verticalShiftTerm = 0;
var horizontalShiftTerm = 0;
var imageDataSpectrum = [];


var frames =[new MyImage(), new MyImage(), new MyImage(), new MyImage()];



function splitFrames(imageData, width, height){
    imageHeightFFT = height;
    imageWidthtFFT = width;

    for(var i = 0; i < imageHeightFFT  ; i++){
        frames[0].matrix[i] = [];
        frames[1].matrix[i] = [];
        frames[2].matrix[i] = [];
        frames[3].matrix[i] = [];
        for(var j=0; j < imageWidthtFFT ; j++){

            frames[0].matrix[i][j] =  new MyComplex(imageData[((i*imageWidthtFFT)+j)*4]/255.0,0);//red pixel intensity
            frames[1].matrix[i][j] =  new MyComplex(imageData[((i*imageWidthtFFT)+j)*4 + 1]/255.0,0);//green pixel intensity
            frames[2].matrix[i][j] =  new MyComplex(imageData[((i*imageWidthtFFT)+j)*4 + 2]/255.0,0);//blue pixel intensity
            frames[3].matrix[i][j] =  new MyComplex(imageData[((i*imageWidthtFFT)+j)*4 + 3]/255.0,0);//alpha pixel intensity
        }
    }
}

function mergeFrames(data){
    //var totalofSamples = imageHeightFFT*imageWidthtFFT;
    var totalofSamples = 1;

    for(var i = 0; i < imageHeightFFT  ; i++){
        for(var j=0; j< imageWidthtFFT ; j++){
            data[((i*imageWidthtFFT)+j)*4] = Math.round(calculateSpectrumMagnitude(getElementFromFrame(0,i,j))/(totalofSamples));
            data[((i*imageWidthtFFT)+j)*4+1] =  Math.round(calculateSpectrumMagnitude(getElementFromFrame(1,i,j))/(totalofSamples));
            data[((i*imageWidthtFFT)+j)*4+2] = Math.round(calculateSpectrumMagnitude(getElementFromFrame(2,i,j))/(totalofSamples));
            data[((i*imageWidthtFFT)+j)*4+3] = 255;
        }
    }
}

function performFFT_InVectorHorizontal(samples){

    //http://web.eecs.umich.edu/~fessler/course/451/l/pdf/c6.pdf
    var index;
    var Wn;
    var numberOfSamples = imageWidthtFFT;
    var evenPart = [];
    var oddPart = [];
    var G2 = [];

    //even samples
    for(var k=0;k<=(numberOfSamples/2)-1;k++){
        evenPart[k] = new MyComplex(0,0);
        for(var i=0; i<=(numberOfSamples/2)-1;i++){
            index = 2*i;
            Wn =  new MyComplex( Math.cos(4*Math.PI*k*i/numberOfSamples), -Math.sin(4*Math.PI*k*i/numberOfSamples) );
            evenPart[k].realComponent =  evenPart[k].realComponent + (samples[index].realComponent*Wn.realComponent) - (samples[index].imagineyComponent*Wn.imagineyComponent);
            evenPart[k].imagineyComponent =  evenPart[k].imagineyComponent + (samples[index].realComponent*Wn.imagineyComponent) + (samples[index].imagineyComponent*Wn.realComponent);
        }
    }

    //odd samples
    for(var k=0;k<=(numberOfSamples/2)-1;k++){
        oddPart[k] = new MyComplex(0,0);
        for(var i=0; i<=(numberOfSamples/2)-1;i++){
            index = (2*i)+1;
            Wn =  new MyComplex( Math.cos(4*Math.PI*k*i/numberOfSamples), -Math.sin(4*Math.PI*k*i/numberOfSamples) );
            oddPart[k].realComponent =  oddPart[k].realComponent + (samples[index].realComponent*Wn.realComponent) - (samples[index].imagineyComponent*Wn.imagineyComponent);
            oddPart[k].imagineyComponent =  oddPart[k].imagineyComponent + (samples[index].realComponent*Wn.imagineyComponent) + (samples[index].imagineyComponent*Wn.realComponent);

        }
    }

    //G2
    for(var k=0;k<=(numberOfSamples/2)-1;k++){
        G2[k] = new MyComplex(0,0);
        Wn =  new MyComplex( Math.cos(2*Math.PI*k/numberOfSamples), -Math.sin(2*Math.PI*k/numberOfSamples) );
        G2[k].realComponent = (oddPart[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPart[k].imagineyComponent*Wn.imagineyComponent);
        G2[k].imagineyComponent = (oddPart[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPart[k].imagineyComponent*Wn.realComponent);
    }


    //Add the two parts
    for(var k=0;k<=(numberOfSamples/2)-1;k++){
        samples[k].realComponent = evenPart[k].realComponent + G2[k].realComponent;
        samples[k].imagineyComponent = evenPart[k].imagineyComponent + G2[k].imagineyComponent;

        samples[(numberOfSamples/2)+k].realComponent = evenPart[k].realComponent - G2[k].realComponent;
        samples[(numberOfSamples/2)+k].imagineyComponent = evenPart[k].imagineyComponent - G2[k].imagineyComponent;
    }

}

function performFFT2d(){

    var numberOfSamples = imageWidthtFFT;
    var index;
    var Wn;

    var evenPartFrame1 = [];
    var evenPartFrame2 = [];
    var evenPartFrame3 = [];
    var evenPartFrame4 = [];

    var oddPartFrame1 = [];
    var oddPartFrame2 = [];
    var oddPartFrame3 = [];
    var oddPartFrame4 = [];

    var G2Frame1 = [];
    var G2Frame2 = [];
    var G2Frame3 = [];
    var G2Frame4 = [];

    //horizontal fft
    for(var row=0; row<imageHeightFFT; row++){



        //even samples
        for(var k=0;k<=(numberOfSamples/2)-1;k++){
            evenPartFrame1[k] = new MyComplex(0,0);
            evenPartFrame2[k] = new MyComplex(0,0);
            evenPartFrame3[k] = new MyComplex(0,0);
            evenPartFrame4[k] = new MyComplex(0,0);
            for(var i=0; i<=(numberOfSamples/2)-1;i++){
                index = 2*i;
                Wn =  new MyComplex( Math.cos(4*Math.PI*k*i/numberOfSamples), -Math.sin(4*Math.PI*k*i/numberOfSamples) );

                evenPartFrame1[k].realComponent =  evenPartFrame1[k].realComponent + (frames[0].matrix[row][index].realComponent*Wn.realComponent) - (frames[0].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame1[k].imagineyComponent =  evenPartFrame1[k].imagineyComponent + (frames[0].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[0].matrix[row][index].imagineyComponent*Wn.realComponent);

                evenPartFrame2[k].realComponent =  evenPartFrame2[k].realComponent + (frames[1].matrix[row][index].realComponent*Wn.realComponent) - (frames[1].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame2[k].imagineyComponent =  evenPartFrame2[k].imagineyComponent + (frames[1].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[1].matrix[row][index].imagineyComponent*Wn.realComponent);

                evenPartFrame3[k].realComponent =  evenPartFrame3[k].realComponent + (frames[2].matrix[row][index].realComponent*Wn.realComponent) - (frames[2].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame3[k].imagineyComponent =  evenPartFrame3[k].imagineyComponent + (frames[2].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[2].matrix[row][index].imagineyComponent*Wn.realComponent);

                evenPartFrame4[k].realComponent =  evenPartFrame4[k].realComponent + (frames[3].matrix[row][index].realComponent*Wn.realComponent) - (frames[3].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame4[k].imagineyComponent =  evenPartFrame4[k].imagineyComponent + (frames[3].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[3].matrix[row][index].imagineyComponent*Wn.realComponent);

            }
        }


        //odd samples
        for(var k=0;k<=(numberOfSamples/2)-1;k++){
            oddPartFrame1[k] = new MyComplex(0,0);
            oddPartFrame2[k] = new MyComplex(0,0);
            oddPartFrame3[k] = new MyComplex(0,0);
            oddPartFrame4[k] = new MyComplex(0,0);
            for(var i=0; i<=(numberOfSamples/2)-1;i++){
                index = (2*i)+1;
                Wn =  new MyComplex( Math.cos(4*Math.PI*k*i/numberOfSamples), -Math.sin(4*Math.PI*k*i/numberOfSamples) );

                oddPartFrame1[k].realComponent =  oddPartFrame1[k].realComponent + (frames[0].matrix[row][index].realComponent*Wn.realComponent) - (frames[0].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame1[k].imagineyComponent =  oddPartFrame1[k].imagineyComponent + (frames[0].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[0].matrix[row][index].imagineyComponent*Wn.realComponent);

                oddPartFrame2[k].realComponent =  oddPartFrame2[k].realComponent + (frames[1].matrix[row][index].realComponent*Wn.realComponent) - (frames[1].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame2[k].imagineyComponent =  oddPartFrame2[k].imagineyComponent + (frames[1].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[1].matrix[row][index].imagineyComponent*Wn.realComponent);

                oddPartFrame3[k].realComponent =  oddPartFrame3[k].realComponent + (frames[2].matrix[row][index].realComponent*Wn.realComponent) - (frames[2].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame3[k].imagineyComponent =  oddPartFrame3[k].imagineyComponent + (frames[2].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[2].matrix[row][index].imagineyComponent*Wn.realComponent);

                oddPartFrame4[k].realComponent =  oddPartFrame4[k].realComponent + (frames[3].matrix[row][index].realComponent*Wn.realComponent) - (frames[3].matrix[row][index].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame4[k].imagineyComponent =  oddPartFrame4[k].imagineyComponent + (frames[3].matrix[row][index].realComponent*Wn.imagineyComponent) + (frames[3].matrix[row][index].imagineyComponent*Wn.realComponent);
            }
        }

        //G2
        for(var k=0;k<=(numberOfSamples/2)-1;k++){
            G2Frame1[k] = new MyComplex(0,0);
            G2Frame2[k] = new MyComplex(0,0);
            G2Frame3[k] = new MyComplex(0,0);
            G2Frame4[k] = new MyComplex(0,0);

            Wn =  new MyComplex( Math.cos(2*Math.PI*k/numberOfSamples), -Math.sin(2*Math.PI*k/numberOfSamples) );

            G2Frame1[k].realComponent = (oddPartFrame1[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame1[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame1[k].imagineyComponent = (oddPartFrame1[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame1[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

            G2Frame2[k].realComponent = (oddPartFrame2[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame2[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame2[k].imagineyComponent = (oddPartFrame2[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame2[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

            G2Frame3[k].realComponent = (oddPartFrame3[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame3[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame3[k].imagineyComponent = (oddPartFrame3[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame3[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

            G2Frame4[k].realComponent = (oddPartFrame4[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame4[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame4[k].imagineyComponent = (oddPartFrame4[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame4[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

        }

        //Add the two parts
        for(var k=0;k<=(numberOfSamples/2)-1;k++){

            frames[0].matrix[row][k].realComponent = evenPartFrame1[k].realComponent + G2Frame1[k].realComponent;
            frames[0].matrix[row][k].imagineyComponent = evenPartFrame1[k].imagineyComponent + G2Frame1[k].imagineyComponent;

            frames[0].matrix[row][(numberOfSamples/2)+k].realComponent = evenPartFrame1[k].realComponent - G2Frame1[k].realComponent;
            frames[0].matrix[row][(numberOfSamples/2)+k].imagineyComponent = evenPartFrame1[k].imagineyComponent - G2Frame1[k].imagineyComponent;
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            frames[1].matrix[row][k].realComponent = evenPartFrame2[k].realComponent + G2Frame2[k].realComponent;
            frames[1].matrix[row][k].imagineyComponent = evenPartFrame2[k].imagineyComponent + G2Frame2[k].imagineyComponent;

            frames[1].matrix[row][(numberOfSamples/2)+k].realComponent = evenPartFrame2[k].realComponent - G2Frame2[k].realComponent;
            frames[1].matrix[row][(numberOfSamples/2)+k].imagineyComponent = evenPartFrame2[k].imagineyComponent - G2Frame2[k].imagineyComponent;
            ////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            frames[2].matrix[row][k].realComponent = evenPartFrame3[k].realComponent + G2Frame3[k].realComponent;
            frames[2].matrix[row][k].imagineyComponent = evenPartFrame3[k].imagineyComponent + G2Frame3[k].imagineyComponent;

            frames[2].matrix[row][(numberOfSamples/2)+k].realComponent = evenPartFrame3[k].realComponent - G2Frame3[k].realComponent;
            frames[2].matrix[row][(numberOfSamples/2)+k].imagineyComponent = evenPartFrame3[k].imagineyComponent - G2Frame3[k].imagineyComponent;
            ////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            frames[3].matrix[row][k].realComponent = evenPartFrame4[k].realComponent + G2Frame4[k].realComponent;
            frames[3].matrix[row][k].imagineyComponent = evenPartFrame4[k].imagineyComponent + G2Frame4[k].imagineyComponent;

            frames[3].matrix[row][(numberOfSamples/2)+k].realComponent = evenPartFrame4[k].realComponent - G2Frame4[k].realComponent;
            frames[3].matrix[row][(numberOfSamples/2)+k].imagineyComponent = evenPartFrame4[k].imagineyComponent - G2Frame4[k].imagineyComponent;
            ////////////////////////////////////////////////////////////////////
        }

    }

    //////////////////////////////////////////////////////////////////////////////////
    //vertical fft
    var numberOfSamples = imageHeightFFT;
    for(var col=0; col<imageWidthtFFT; col++){


        //even samples
        for(var k=0;k<=(numberOfSamples/2)-1;k++){
            evenPartFrame1[k] = new MyComplex(0,0);
            evenPartFrame2[k] = new MyComplex(0,0);
            evenPartFrame3[k] = new MyComplex(0,0);
            evenPartFrame4[k] = new MyComplex(0,0);
            for(var i=0; i<=(numberOfSamples/2)-1;i++){
                index = 2*i;
                Wn =  new MyComplex( Math.cos(4*Math.PI*k*i/numberOfSamples), -Math.sin(4*Math.PI*k*i/numberOfSamples) );

                evenPartFrame1[k].realComponent =  evenPartFrame1[k].realComponent + (frames[0].matrix[index][col].realComponent*Wn.realComponent) - (frames[0].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame1[k].imagineyComponent =  evenPartFrame1[k].imagineyComponent + (frames[0].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[0].matrix[index][col].imagineyComponent*Wn.realComponent);

                evenPartFrame2[k].realComponent =  evenPartFrame2[k].realComponent + (frames[1].matrix[index][col].realComponent*Wn.realComponent) - (frames[1].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame2[k].imagineyComponent =  evenPartFrame2[k].imagineyComponent + (frames[1].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[1].matrix[index][col].imagineyComponent*Wn.realComponent);

                evenPartFrame3[k].realComponent =  evenPartFrame3[k].realComponent + (frames[2].matrix[index][col].realComponent*Wn.realComponent) - (frames[2].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame3[k].imagineyComponent =  evenPartFrame3[k].imagineyComponent + (frames[2].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[2].matrix[index][col].imagineyComponent*Wn.realComponent);

                evenPartFrame4[k].realComponent =  evenPartFrame4[k].realComponent + (frames[3].matrix[index][col].realComponent*Wn.realComponent) - (frames[3].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                evenPartFrame4[k].imagineyComponent =  evenPartFrame4[k].imagineyComponent + (frames[3].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[3].matrix[index][col].imagineyComponent*Wn.realComponent);

            }
        }


        //odd samples
        for(var k=0;k<=(numberOfSamples/2)-1;k++){
            oddPartFrame1[k] = new MyComplex(0,0);
            oddPartFrame2[k] = new MyComplex(0,0);
            oddPartFrame3[k] = new MyComplex(0,0);
            oddPartFrame4[k] = new MyComplex(0,0);
            for(var i=0; i<=(numberOfSamples/2)-1;i++){
                index = ((2*i)+1)
                Wn =  new MyComplex( Math.cos(4*Math.PI*k*i/numberOfSamples), -Math.sin(4*Math.PI*k*i/numberOfSamples) );

                oddPartFrame1[k].realComponent =  oddPartFrame1[k].realComponent + (frames[0].matrix[index][col].realComponent*Wn.realComponent) - (frames[0].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame1[k].imagineyComponent =  oddPartFrame1[k].imagineyComponent + (frames[0].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[0].matrix[index][col].imagineyComponent*Wn.realComponent);

                oddPartFrame2[k].realComponent =  oddPartFrame2[k].realComponent + (frames[1].matrix[index][col].realComponent*Wn.realComponent) - (frames[1].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame2[k].imagineyComponent =  oddPartFrame2[k].imagineyComponent + (frames[1].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[1].matrix[index][col].imagineyComponent*Wn.realComponent);

                oddPartFrame3[k].realComponent =  oddPartFrame3[k].realComponent + (frames[2].matrix[index][col].realComponent*Wn.realComponent) - (frames[2].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame3[k].imagineyComponent =  oddPartFrame3[k].imagineyComponent + (frames[2].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[2].matrix[index][col].imagineyComponent*Wn.realComponent);

                oddPartFrame4[k].realComponent =  oddPartFrame4[k].realComponent + (frames[3].matrix[index][col].realComponent*Wn.realComponent) - (frames[3].matrix[index][col].imagineyComponent*Wn.imagineyComponent);
                oddPartFrame4[k].imagineyComponent =  oddPartFrame4[k].imagineyComponent + (frames[3].matrix[index][col].realComponent*Wn.imagineyComponent) + (frames[3].matrix[index][col].imagineyComponent*Wn.realComponent);
            }
        }

        //G2
        for(var k=0;k<=(numberOfSamples/2)-1;k++){
            G2Frame1[k] = new MyComplex(0,0);
            G2Frame2[k] = new MyComplex(0,0);
            G2Frame3[k] = new MyComplex(0,0);
            G2Frame4[k] = new MyComplex(0,0);

            Wn =  new MyComplex( Math.cos(2*Math.PI*k/numberOfSamples), -Math.sin(2*Math.PI*k/numberOfSamples) );

            G2Frame1[k].realComponent = (oddPartFrame1[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame1[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame1[k].imagineyComponent = (oddPartFrame1[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame1[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

            G2Frame2[k].realComponent = (oddPartFrame2[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame2[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame2[k].imagineyComponent = (oddPartFrame2[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame2[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

            G2Frame3[k].realComponent = (oddPartFrame3[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame3[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame3[k].imagineyComponent = (oddPartFrame3[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame3[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

            G2Frame4[k].realComponent = (oddPartFrame4[k%(numberOfSamples/2)].realComponent*Wn.realComponent) - (oddPartFrame4[k%(numberOfSamples/2)].imagineyComponent*Wn.imagineyComponent);
            G2Frame4[k].imagineyComponent = (oddPartFrame4[k%(numberOfSamples/2)].realComponent*Wn.imagineyComponent) + (oddPartFrame4[k%(numberOfSamples/2)].imagineyComponent*Wn.realComponent);

        }

        //Add the two parts
        for(var k=0;k<=(numberOfSamples/2)-1;k++){

            frames[0].matrix[k][col].realComponent = evenPartFrame1[k].realComponent + G2Frame1[k].realComponent;
            frames[0].matrix[k][col].imagineyComponent = evenPartFrame1[k].imagineyComponent + G2Frame1[k].imagineyComponent;

            frames[0].matrix[(numberOfSamples/2)+k][col].realComponent = evenPartFrame1[k].realComponent - G2Frame1[k].realComponent;
            frames[0].matrix[(numberOfSamples/2)+k][col].imagineyComponent = evenPartFrame1[k].imagineyComponent - G2Frame1[k].imagineyComponent;
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            frames[1].matrix[k][col].realComponent = evenPartFrame2[k].realComponent + G2Frame2[k].realComponent;
            frames[1].matrix[k][col].imagineyComponent = evenPartFrame2[k].imagineyComponent + G2Frame2[k].imagineyComponent;

            frames[1].matrix[(numberOfSamples/2)+k][col].realComponent = evenPartFrame2[k].realComponent - G2Frame2[k].realComponent;
            frames[1].matrix[(numberOfSamples/2)+k][col].imagineyComponent = evenPartFrame2[k].imagineyComponent - G2Frame2[k].imagineyComponent;
            ////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            frames[2].matrix[k][col].realComponent = evenPartFrame3[k].realComponent + G2Frame3[k].realComponent;
            frames[2].matrix[k][col].imagineyComponent = evenPartFrame3[k].imagineyComponent + G2Frame3[k].imagineyComponent;

            frames[2].matrix[(numberOfSamples/2)+k][col].realComponent = evenPartFrame3[k].realComponent - G2Frame3[k].realComponent;
            frames[2].matrix[(numberOfSamples/2)+k][col].imagineyComponent = evenPartFrame3[k].imagineyComponent - G2Frame3[k].imagineyComponent;
            ////////////////////////////////////////////////////////////////////
            ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
            frames[3].matrix[k][col].realComponent = evenPartFrame4[k].realComponent + G2Frame4[k].realComponent;
            frames[3].matrix[k][col].imagineyComponent = evenPartFrame4[k].imagineyComponent + G2Frame4[k].imagineyComponent;

            frames[3].matrix[(numberOfSamples/2)+k][col].realComponent = evenPartFrame4[k].realComponent - G2Frame4[k].realComponent;
            frames[3].matrix[(numberOfSamples/2)+k][col].imagineyComponent = evenPartFrame4[k].imagineyComponent - G2Frame4[k].imagineyComponent;
            ////////////////////////////////////////////////////////////////////
        }

    }



}

function perform2d_shift(){
    verticalShiftTerm = (verticalShiftTerm+(imageHeightFFT/2))%imageHeightFFT;
    horizontalShiftTerm = (horizontalShiftTerm+(imageWidthtFFT/2))%imageWidthtFFT;
}

function getElementFromFrame(frameNumber,row,col){
    return frames[frameNumber].matrix [(row+verticalShiftTerm)%imageHeightFFT] [(col+horizontalShiftTerm)%imageWidthtFFT];
}

function setElementFromFrame(frameNumber,row,col, value){
    frames[frameNumber].matrix[(row+verticalShiftTerm)%imageHeightFFT][(col+imageWidthtFFT)%imageWidthtFFT] = value;
}

function calculateSpectrumMagnitude(complexSample){
    return Math.sqrt( (complexSample.realComponent*complexSample.realComponent) + (complexSample.imagineyComponent*complexSample.imagineyComponent) );
}




