var imageLoader = document.getElementById('imageLoader');
imageLoader.addEventListener('change', handleImage, false);
var isImageLoaded = false;

var canvasImageUploadedArea = document.getElementById('imageUploaded');
var contextCanvasImageUploadedArea = canvasImageUploadedArea.getContext('2d');

var canvasImageFilteredArea = document.getElementById('imageFiltred');
var contextCanvasImageFiltredArea = canvasImageFilteredArea.getContext('2d');

var imageWidth;
var imageHeight;

var originalImageData = [];
var modifiedImageData = [];

function handleImage(e){
    var reader = new FileReader();
    reader.onload = function(event){
        img = new Image();
        img.onload = function(){
            drawImageInCanvasAreas(img);
            storeOriginalData();
            drawImageFiltered();

        }
        img.src = event.target.result;
    }
    reader.readAsDataURL(e.target.files[0]);
}

function drawImageInCanvasAreas(image){

    imageWidth = image.width;
    imageHeight = image.height;
    var index;

    contextCanvasImageUploadedArea.canvas.width = imageWidth;
    contextCanvasImageUploadedArea.canvas.height = imageHeight;

    contextCanvasImageFiltredArea.canvas.width = imageWidth;
    contextCanvasImageFiltredArea.canvas.height = imageHeight;

    contextCanvasImageUploadedArea.drawImage(image,0,0, imageWidth, imageHeight);
    contextCanvasImageFiltredArea.drawImage(image,0,0, imageWidth, imageHeight);

    myKernel = new Kernel(11,11,"mean", imageWidth,imageHeight);
}

function storeOriginalData(){
    var index;

    var imageData = contextCanvasImageFiltredArea.getImageData(0,0,imageWidth,imageHeight);
    var data = imageData.data;

    for(var row=0; row < imageHeight; row++){
        for(var col=0; col < imageWidth; col++){
            index = ((row*imageWidth)+col);
            originalImageData[(index*4)] = data[(index*4)];
            originalImageData[(index*4)+1] = data[(index*4)+1];
            originalImageData[(index*4)+2] = data[(index*4)+2];
            originalImageData[(index*4)+3] = data[(index*4)+3];

            modifiedImageData[(index*4)] = data[(index*4)];
            modifiedImageData[(index*4)+1] = data[(index*4)+1];
            modifiedImageData[(index*4)+2] = data[(index*4)+2];
            modifiedImageData[(index*4)+3] = data[(index*4)+3];
        }
    }
}