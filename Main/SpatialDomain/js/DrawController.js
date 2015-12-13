var animationStatus = "stopped";
var linearSpeedX = 100;
var linearSpeedY = 100;
var horizontalDisplacement = 0;
var verticalDisplacement = 0;


function drawKernel(kernel){
    contextCanvasImageFiltredArea.beginPath();
    contextCanvasImageFiltredArea.fillStyle = "blue";
    contextCanvasImageFiltredArea.globalAlpha = 0.1;
    contextCanvasImageFiltredArea.rect(kernel.topLeftCornerCol,kernel.topLeftCornerRow , kernel.numberColumns, kernel.numberRows );
    contextCanvasImageFiltredArea.fill();
    contextCanvasImageFiltredArea.closePath();

    contextCanvasImageFiltredArea.beginPath();
    contextCanvasImageFiltredArea.fillStyle = "red";
    contextCanvasImageFiltredArea.globalAlpha = 1;
    contextCanvasImageFiltredArea.rect(kernel.currentColumn,kernel.currentRow , 1, 1 );
    contextCanvasImageFiltredArea.fill();
    contextCanvasImageFiltredArea.closePath();

}

function drawImageFiltered(){

    var imageData = contextCanvasImageFiltredArea.getImageData(0,0,imageWidth,imageHeight);
    var data = imageData.data;

    for(var row=0; row < imageHeight; row++){
        for(var col=0; col < imageWidth; col++){
            index = ((row*imageWidth)+col);
            data[(index*4)] = modifiedImageData[(index*4)] ;
            data[(index*4)+1] = modifiedImageData[(index*4)+1];
            data[(index*4)+2] = modifiedImageData[(index*4)+2];
            data[(index*4)+3] = modifiedImageData[(index*4)+3];
        }
    }

    contextCanvasImageFiltredArea.putImageData(imageData,0,0);
}

function animate(kernel) {

    if(animationStatus == "running") {


        convolve(myKernel, originalImageData,modifiedImageData,animationSpeed,0);
        drawAnimation(kernel);
        updatePositionField();
        window.requestAnimationFrame(function () {
            animate(kernel);
        });
    }

};

function drawAnimation(kernel){
    drawImageFiltered();
    drawKernel(kernel);
}

// add click listener to canvas
document.getElementById('imageFiltred').addEventListener('click', function() {

    if(animationStatus == "running"){
        animationStatus = "stopped";
    }else if(animationStatus == "stopped") {
        animationStatus = "running";
        //convolve(myKernel, originalImageData,modifiedImageData,0,0);
        animate(myKernel);
    }


});



/*window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();*/