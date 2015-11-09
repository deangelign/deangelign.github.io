
var Complex = function (coordinateX_InCanvasArea,coordinateY_InCanvasArea,width,heigh, isSelected) {
    this.coordinateX_InCanvasArea = coordinateX_InCanvasArea
    this.coordinateY_InCanvasArea = coordinateY_InCanvasArea
    this.width = width;
    this.heigh = heigh;
    this.isSelected = isSelected;
}

var imageDataBeforeFFT;
var imageWidthFFT;
var imageHeightFFT;
var dataExtrated;
var numberOfChannels = 4;

var redPixelIntensityReal;
var greenPixelIntensityReal;
var bluePixelIntensityReal;
var alphaReal;

var redPixelFrameReal = [];
var greenPixelFrameReal = [];
var bluePixelFrameReal = [];
var alphaFrameReal = [];

var redPixelFrameImaginery = [];
var greenPixelFrameImaginery =[];
var bluePixelFrameImaginery = [];
var alphaFrameImaginery = [];

//FFT variables
var realFFT_even = [];
var imagineryFFT_even = [];
var realFFT_odd = [];
var imagineryFFT_odd = [];
var G2_real = [];
var G2_imaginery = [];
var realFFT_frequency = new Array();
var imagineryFFT_frequency = [];


//var redPixelIntensityImaginery;
//var greenPixelIntensityReal;
//var bluePixelIntensityReal;
//var alphaReal;

var realImageComponents = [];
var ImagineryImageComponents = [];

function receiveImageData(imageData){
    imageDataBeforeFFT = imageData
}

function organizeDataToPerformFFT2d(){

    for(var i = 0; i < imageHeightFFT * numberOfChannels ; i++){
            for(var j=0; j<imageWidthFFT * numberOfChannels; j++){
                realImageComponents[((i*imageWidthFFT)+j)*4] = dataExtrated[((i*imageWidthFFT)+j)*4];//red pixel intensity
                realImageComponents[((i*imageWidthFFT)+j)*4+1] = dataExtrated[((i*imageWidthFFT)+j)*4+1];//green pixel intensity
                realImageComponents[((i*imageWidthFFT)+j)*4+2] = dataExtrated[((i*imageWidthFFT)+j)*4+2];//blue pixel intensity
                realImageComponents[((i*imageWidthFFT)+j)*4+3] = dataExtrated[((i*imageWidthFFT)+j)*4+3];//alpha pixel intensity

                ImagineryImageComponents[((i*imageWidthFFT)+j)*4] = 0;
                ImagineryImageComponents[((i*imageWidthFFT)+j)*4+1] = 0;
                ImagineryImageComponents[((i*imageWidthFFT)+j)*4+2] = 0;
                ImagineryImageComponents[((i*imageWidthFFT)+j)*4+3] = 0;
            }
    }

}

function extractFrames(){

    for(var i = 0; i < imageHeightFFT * numberOfChannels ; i++){
        for(var j=0; j<imageWidthFFT * numberOfChannels; j++){
            redPixelFrameReal[(i*imageWidthFFT)+j] = dataExtrated[((i*imageWidthFFT)+j)*4];//red pixel intensity
            greenPixelFrameReal[(i*imageWidthFFT)+j] = dataExtrated[((i*imageWidthFFT)+j)*4+1];//green pixel intensity
            bluePixelFrameReal[(i*imageWidthFFT)+j] = dataExtrated[((i*imageWidthFFT)+j)*4+2];//blue pixel intensity
            alphaFrameReal[(i*imageWidthFFT)+j] = dataExtrated[((i*imageWidthFFT)+j)*4+3];//alpha pixel intensity

            redPixelFrameImaginery[(i*imageWidthFFT)+j] = 0;
            greenPixelFrameImaginery[(i*imageWidthFFT)+j] = 0;
            bluePixelFrameImaginery[(i*imageWidthFFT)+j] = 0;
            alphaFrameImaginery[(i*imageWidthFFT)+j] = 0;
        }
    }

}

function performFFT_inVector(vectorRealComponents,vectorImagineryComponents,numberOfSamples, offset) {

    //http://web.eecs.umich.edu/~fessler/course/451/l/pdf/c6.pdf

    realFFT_even.length = numberOfSamples/2;
    imagineryFFT_even.length = numberOfSamples/2;
    realFFT_odd.length = numberOfSamples/2;
    imagineryFFT_odd.length = numberOfSamples/2;
    G2_real.length = numberOfSamples/2;
    G2_imaginery.length = numberOfSamples/2;


    //compute the even part
    for(var k = 0; k <= (numberOfSamples/2) - 1; k++){
        realFFT_even[k] = 0;
        imagineryFFT_even[k] = 0;
        for(var i=0; i<= (numberOfSamples/2) - 1; i++){
            var index = i*2;
            var Wn_real = Math.cos(4*Math.PI*k*i/numberOfSamples);
            var Wn_imaginrey  = -Math.sin(4*Math.PI*k*i/numberOfSamples);
            realFFT_even[k] = realFFT_even[k] + (vectorRealComponents[index]*Wn_real) - (vectorImagineryComponents[index]* Wn_imaginrey);
            imagineryFFT_even[k] = imagineryFFT_even[k] + (vectorImagineryComponents[index]*Wn_real) + (vectorRealComponents[index]*Wn_imaginrey);
        }
    }

    //compute the odd part
    for(var k = 0; k <= (numberOfSamples/2) - 1; k++){
        realFFT_odd[k] =0;
        imagineryFFT_odd[k] = 0;
        for(var i=0; i<= (numberOfSamples/2) - 1;i++){
            var index = (i*2) + 1;
            var Wn_real = Math.cos(4*Math.PI*k*i/numberOfSamples);
            var Wn_imaginrey  = -Math.sin(4*Math.PI*k*i/numberOfSamples);
            realFFT_odd[k] = realFFT_odd[k] + (vectorRealComponents[index]*Wn_real) - (vectorImagineryComponents[index]* Wn_imaginrey);
            imagineryFFT_odd[k] = imagineryFFT_odd[k] + (vectorImagineryComponents[index]*Wn_real) + (vectorRealComponents[index]*Wn_imaginrey);
        }
    }

    //compute G2
    for(var k = 0; k <= (numberOfSamples/2) - 1; k++){
        G2_real[k] = 0;
        G2_imaginery[k] = 0;
        var Wn_real_G2 = Math.cos(2*Math.PI*k/numberOfSamples);
        var Wn_imaginrey_G2  = -Math.sin(2*Math.PI*k/numberOfSamples);
        G2_real[k] = (realFFT_odd[k%(numberOfSamples/2)]*Wn_real_G2) - (imagineryFFT_odd[k%(numberOfSamples/2)]*Wn_imaginrey_G2)
        G2_imaginery[k] = (imagineryFFT_odd[k%(numberOfSamples/2)]*Wn_real_G2) + (realFFT_odd[k%(numberOfSamples/2)]*Wn_imaginrey_G2)
    }

    //combine the even and odd (G2) part
    for(var k = 0; k <= (numberOfSamples/2) - 1; k++){
        realFFT_frequency [k] = 0;
        imagineryFFT_frequency[k] = 0;
        realFFT_frequency [k+(numberOfSamples/2)] = 0;
        imagineryFFT_frequency[k+(numberOfSamples/2)] = 0;

        realFFT_frequency [k] =  realFFT_even[k] + G2_real[k];
        redPixelFrameReal[offset+k]= realFFT_frequency [k];

        imagineryFFT_frequency[k] = imagineryFFT_even[k] + G2_imaginery[k];
        redPixelFrameImaginery[offset+k] = imagineryFFT_frequency[k];

        realFFT_frequency [k+(numberOfSamples/2)] =  realFFT_even[k] - G2_real[k];
        redPixelFrameReal[offset+k+(numberOfSamples/2)]= realFFT_frequency [k+(numberOfSamples/2)];

        imagineryFFT_frequency[k+(numberOfSamples/2)] = imagineryFFT_even[k] - G2_imaginery[k];
        redPixelFrameImaginery[offset+k+(numberOfSamples/2)]= imagineryFFT_frequency [k+(numberOfSamples/2)];
    }


}

function performfft2dInSigleFrame(realImageData, ImagineryImageData, imageWidth,imageHeight) {

    redPixelFrameReal = realImageData;
    redPixelFrameImaginery = ImagineryImageData;

    for (var i = 0; i < imageHeight; i++) {
        performFFT_inVector(redPixelFrameReal.slice(i * imageWidth, (i + 1) * imageWidth), redPixelFrameImaginery.slice(i * imageWidth, (i + 1) * imageWidth), imageWidth, i * imageWidth);
        //realImageData.splice(i*imageWidth,imageWidth,realFFT_frequency);
        //ImagineryImageData.splice(i*imageWidth,imageWidth,imagineryFFT_frequency);
    }

}

function Shift2d(){

    imageHeightFFT = 4;
    imageWidthFFT = 4;
    var transientVectorReal1;
    var transientVectorReal2;
    var transientVectorReal;

    var transientVectorImaginery1;
    var transientVectorImaginery2;

    //horizontal shift
    transientVectorReal = redPixelFrameReal.slice();
   /* for(var i=0; i<imageHeightFFT; i++){
        for(var j=0; j<imageWidthFFT/2; j++){
            redPixelFrameReal[(i*imageWidthFFT)+j] =  transientVectorReal[(i*imageWidthFFT)+j+(imageWidthFFT/2)];
            redPixelFrameReal[(i*imageWidthFFT)+j+(imageWidthFFT/2)] =  transientVectorReal[(i*imageWidthFFT)+j];
        }
    }*/

    for(var j=0; j<imageWidthFFT; j++) {
        transientVectorReal = redPixelFrameReal;
        for (var i = 0; i < imageHeightFFT * imageWidthFFT / 2; i = i + imageWidthFFT) {
            redPixelFrameReal[i + j] = transientVectorReal[(imageWidthFFT * imageHeightFFT /2)+j ];
            redPixelFrameReal[(imageWidthFFT * imageHeightFFT / 2)+j] = transientVectorReal[i+j]
        }
    }

}

