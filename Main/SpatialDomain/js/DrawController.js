var myKernel;
var animationStatus = "stopped";

window.requestAnimFrame = (function(callback) {
    return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
        function(callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();

function drawKernel(){
    contextCanvasImageFiltredArea.beginPath();
    contextCanvasImageFiltredArea.fillStyle = "blue";
    contextCanvasImageFiltredArea.globalAlpha = 1;
    contextCanvasImageFiltredArea.rect(myKernel.topLeftCornerCol,myKernel.topLeftCornerRow , myKernel.numberColumns, myKernel.numberRows );
    contextCanvasImageFiltredArea.fill();
    contextCanvasImageFiltredArea.closePath();

    contextCanvasImageFiltredArea.beginPath();
    contextCanvasImageFiltredArea.fillStyle = "red";
    contextCanvasImageFiltredArea.globalAlpha = 1;
    contextCanvasImageFiltredArea.rect(myKernel.currentColumn,myKernel.currentRow , 1, 1 );
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
}

function animate(myKernel) {
    if(animationStatus == "running") {
    // update
        drawKernel();


        requestAnimFrame(function () {
            animate(myKernel);
        });
    }
}