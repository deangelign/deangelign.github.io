
///////////////////////////


///////////////////////////
var OriginalImage = contextFourierTransformArea.getImageData(0,0,canvasEditableAreaWidth, canvasEditableAreaHeight);
var imageWhileMousePresses = OriginalImage;
var imageGeneratedFromLastMousePressUp = OriginalImage;
//////////////////////////

var objetcsShape = [];

/////////////////////////////classes constructor//////////////////////////////


function storeObjectShape(){

    var obj;

    if(isButtonDrawingRectangleSelected && isButtonDrawingConjugateSelected && isButtonDrawingClearAreaSelected){
        obj = rectangleClearConjugate2Object();
    }

    else if(isButtonDrawingRectangleSelected && isButtonDrawingConjugateSelected){
        obj = rectangleConjugate2Object();
    }

    else if(isButtonDrawingClearAreaSelected && isButtonDrawingRectangleSelected){
        obj =rectangleClear2Object();
    }

    else if(isButtonDrawingRectangleSelected){
        obj = rectangle2Object();
    }


    else if(isButtonDrawingCircleSelected && isButtonDrawingConjugateSelected){
        obj = circleConjugate2Object();
    }

    else if(isButtonDrawingCircleSelected){
        obj = circle2Object();
    }

    objetcsShape.push(obj);
}

function deleteAllObjectsShape(){
    objetcsShape.splice(0,objetcsShape.length);
    drawObjectShapesInOriginalImage();
}

function drawObjectShapesInOriginalImage(){
    contextFourierTransformArea.putImageData(OriginalImage, 0,0);

    for(var index=0; index < objetcsShape.length; index++){

        if(objetcsShape[index].type == shapeTypes[0]){
            if(objetcsShape[index].shape.isSelected){
                drawFilledRectangleSelected(objetcsShape[index].shape);
            }
            else{
                drawFilledRectangle(objetcsShape[index].shape);
            }
        }

        else if(objetcsShape[index].type == shapeTypes[1]){
            if(objetcsShape[index].shape.isSelected){
                drawFilledRectangleConjugateSelected(objetcsShape[index].shape);
            }
            else{
                drawFilledRectangleConjugate(objetcsShape[index].shape);
            }
        }

        else if(objetcsShape[index].type == shapeTypes[2]){
            if(objetcsShape[index].shape.isSelected){
                drawFilledCircleSelected(objetcsShape[index].shape);
            }
            else{
                drawFilledCircle(objetcsShape[index].shape);
            }
        }

        else if(objetcsShape[index].type == shapeTypes[3]){
            if(objetcsShape[index].shape.isSelected){
                drawFilledCircleConjugateSelected(objetcsShape[index].shape);
            }
            else{
                drawFilledCircleConjugate(objetcsShape[index].shape);
            }
        }

        else if(objetcsShape[index].type == shapeTypes[4]){
            if(objetcsShape[index].shape.isSelected){
                drawFilledClearRectangleSelected(objetcsShape[index].shape);
            }
            else{
                drawFilledClearRectangle(objetcsShape[index].shape);
            }
        }

        else if(objetcsShape[index].type == shapeTypes[5]){
            if(objetcsShape[index].shape.isSelected){
                drawFilledRectangleClearConjugateSelected(objetcsShape[index].shape);
            }
            else{
                drawFilledRectangleClearConjugate(objetcsShape[index].shape);
            }
        }

    }

    imageGeneratedFromLastMousePressUp = contextFourierTransformArea.getImageData(0,0,canvasEditableAreaWidth, canvasEditableAreaHeight);
    drawInverseFFTImage();
}


////////////drawing functions//////////
function drawInverseFFTImage(){
    if(isImageLoaded){
        addObjetcsInSpectrum();
        IFFT(fftSpectrumModified,'imageFourierResult',contextCanvasImageUploadedArea.getImageData(0,0,canvasEditableAreaWidth,canvasEditableAreaHeight).data );
    }
}

///////isSelected object-shape functions/////////
function anyObjectShapeSelected(mouseX,mouseY){

    for(var index=0; index<objetcsShape.length; index++){

        if(objetcsShape[index].type == shapeTypes[0]){
            isRetangleSelected(objetcsShape[index].shape,mouseX, mouseY);
        }
        else if(objetcsShape[index].type == shapeTypes[1]){
            isRectangleConjugateSelected(objetcsShape[index].shape,mouseX, mouseY);
        }
        else if(objetcsShape[index].type == shapeTypes[2]){
            isCircleSelected(objetcsShape[index].shape,mouseX, mouseY)
        }
        else if(objetcsShape[index].type == shapeTypes[3]){
            isCircleConjugateSelected(objetcsShape[index].shape,mouseX, mouseY)
        }
        else if(objetcsShape[index].type == shapeTypes[4]){
            isClearRectangleSelected(objetcsShape[index].shape,mouseX, mouseY)
        }
        else if(objetcsShape[index].type == shapeTypes[5]){
            isRectangleClearConjugateSelected(objetcsShape[index].shape,mouseX, mouseY)
        }
    }

    drawObjectShapesInOriginalImage();
}

function receiveDataFromNewImageUpdated(imageData) {
    OriginalImage = imageData;
    imageWhileMousePresses = OriginalImage;
    imageGeneratedFromLastMousePressUp = OriginalImage;
}

function deslectAllObjectShapes(){

    for(var index=0; index<objetcsShape.length; index++){
        objetcsShape[index].shape.isSelected = false;
    }

}

/////////////////////////////////while mouse down
function whileMouseDown(CursorPositionX, CursorPositionY){
    contextFourierTransformArea.putImageData(imageGeneratedFromLastMousePressUp, 0,0);
    mouseCursorPositionInArea_X_mouseDown_While = CursorPositionX;
    mouseCursorPositionInArea_Y_mouseDown_While = CursorPositionY;
    drawShapeBorderWhileMouseDown();
}

function whileMouseDownObjectSelected(){
    var displacementX = mouseCursorPositionInArea_X - lastMouseCursorPositionX;
    var displacementY = mouseCursorPositionInArea_Y - lastMouseCursorPositionY;

    for(var index=0; index < objetcsShape.length; index++){

        if(objetcsShape[index].shape.isSelected) {
            if (objetcsShape[index].type == shapeTypes[0]){
                    rectangleDisplacement(objetcsShape[index].shape, displacementX, displacementY);
            }
            else if (objetcsShape[index].type == shapeTypes[1]) {
                rectangleConjugateDisplacement(objetcsShape[index].shape, displacementX, displacementY);
            }
            else if (objetcsShape[index].type == shapeTypes[2]) {
                circleDisplacement(objetcsShape[index].shape, displacementX, displacementY)
            }
            else if (objetcsShape[index].type == shapeTypes[3]) {
                circleConjugateDisplacement(objetcsShape[index].shape, displacementX, displacementY)
            }
            else if (objetcsShape[index].type == shapeTypes[4]) {
                clearRectangleDisplacement(objetcsShape[index].shape, displacementX, displacementY)
            }
            else if (objetcsShape[index].type == shapeTypes[5]) {
                rectangleClearConjugateDisplacement(objetcsShape[index].shape, displacementX, displacementY)
            }
        }
    }

    drawObjectShapesInOriginalImage();

    lastMouseCursorPositionX = mouseCursorPositionInArea_X;
    lastMouseCursorPositionY = mouseCursorPositionInArea_Y;
}

function drawShapeBorderWhileMouseDown(){

    if(isButtonDrawingRectangleSelected && isButtonDrawingConjugateSelected && isButtonDrawingClearAreaSelected){
        drawFilledRectangleClearConjugateWhileMouseHold(mouseCursorPositionInArea_X_mouseDown_While,mouseCursorPositionInArea_Y_mouseDown_While,mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
    }
    else if(isButtonDrawingRectangleSelected && isButtonDrawingConjugateSelected){
        drawFilledRectangleConjugateWhileMouseHold(mouseCursorPositionInArea_X_mouseDown_While,mouseCursorPositionInArea_Y_mouseDown_While,mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
    }
    else if(isButtonDrawingClearAreaSelected && isButtonDrawingRectangleSelected){
        drawFilledClearRectangleWhileMouseHold(mouseCursorPositionInArea_X_mouseDown_While,mouseCursorPositionInArea_Y_mouseDown_While,mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
    }
    else if(isButtonDrawingRectangleSelected){
        drawFilledRectangleWhileMouseHold(mouseCursorPositionInArea_X_mouseDown_While,mouseCursorPositionInArea_Y_mouseDown_While,mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
    }else if(isButtonDrawingCircleSelected && isButtonDrawingConjugateSelected){
        drawFilledCircleConjugateWhileMouseHold(mouseCursorPositionInArea_X_mouseDown_While,mouseCursorPositionInArea_Y_mouseDown_While,mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
    }
    else if(isButtonDrawingCircleSelected){
        drawFilledCircleWhileMouseHold(mouseCursorPositionInArea_X_mouseDown_While,mouseCursorPositionInArea_Y_mouseDown_While,mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
    }
}


///////////////////////////////////output image fft functions
function addObjetcsInSpectrum(){

    fftCopyData(fftSpectrumOriginal,fftSpectrumModified);

    for(var index=0; index < objetcsShape.length; index++){

        if (objetcsShape[index].type == shapeTypes[0]){
            rectangleInSpectrum(objetcsShape[index].shape);
        }
        if (objetcsShape[index].type == shapeTypes[1]){
            rectangleConjugateInSpectrum(objetcsShape[index].shape);
        }
        if (objetcsShape[index].type == shapeTypes[2]){
            circleInSpectrum(objetcsShape[index].shape);
        }
        if (objetcsShape[index].type == shapeTypes[3]){
            circleConjugateInSpectrum(objetcsShape[index].shape);
        }
        if (objetcsShape[index].type == shapeTypes[4]){
            rectangleClearInSpectrum(objetcsShape[index].shape);
        }

    }



}
