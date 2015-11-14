/**
 * Created by mypc on 12/11/2015.
 */
var CircleClear = function (centerCoordinateX_InCanvasArea,centerCoordinateY_InCanvasArea,radius, startAngle, endAngle, isSelected) {
    this.centerCoordinateX_InCanvasArea = centerCoordinateX_InCanvasArea;
    this.centerCoordinateY_InCanvasArea = centerCoordinateY_InCanvasArea;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.isSelected = isSelected;
    this.isCtrlC = false;
}

function circleClear2Object(){

    var deltaX = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
    var deltaY = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
    var radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
    var circle = new CircleClear(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  radius, 0, 2 * Math.PI,false);
    obj = new ObjectShape(shapeTypes[6],circle);
    return obj;

}

function drawFilledCircleClear(circleClear){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.fillStyle =  fillColorClearArea;
    contextFourierTransformArea.globalAlpha= globalAlphaClearArea;
    contextFourierTransformArea.strokeStyle = strokeColorClearArea;
    contextFourierTransformArea.lineWidth = borderWidthClearArea;
    contextFourierTransformArea.arc(circleClear.centerCoordinateX_InCanvasArea, circleClear.centerCoordinateY_InCanvasArea,circleClear.radius,circleClear.startAngle,circleClear.endAngle);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.stroke();
    contextFourierTransformArea.closePath();


    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.fillStyle =  fillColorClearArea;
    contextFourierTransformArea.globalAlpha= globalAlphaClearArea;
    contextFourierTransformArea.strokeStyle = strokeColorClearArea;
    contextFourierTransformArea.lineWidth = borderWidthClearArea;
    contextFourierTransformArea.arc(circleClear.centerCoordinateX_InCanvasArea, circleClear.centerCoordinateY_InCanvasArea,internRadius,circleClear.startAngle,circleClear.endAngle);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.stroke();
    contextFourierTransformArea.closePath();
}

function drawFilledCircleClearSelected(circleClear){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.fillStyle =  fillColorSelected;
    contextFourierTransformArea.globalAlpha= globalAlphaSelected;
    contextFourierTransformArea.strokeStyle = strokeColorSelected;
    contextFourierTransformArea.lineWidth = borderWidthSelected;
    contextFourierTransformArea.arc(circleClear.centerCoordinateX_InCanvasArea, circleClear.centerCoordinateY_InCanvasArea,circleClear.radius,circleClear.startAngle,circleClear.endAngle);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.stroke();
    contextFourierTransformArea.closePath();

    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.fillStyle =  fillColorSelected;
    contextFourierTransformArea.globalAlpha= globalAlphaSelected;
    contextFourierTransformArea.strokeStyle = strokeColorSelected;
    contextFourierTransformArea.lineWidth = borderWidthSelected;
    contextFourierTransformArea.arc(circleClear.centerCoordinateX_InCanvasArea, circleClear.centerCoordinateY_InCanvasArea,internRadius,circleClear.startAngle,circleClear.endAngle);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.stroke();
    contextFourierTransformArea.closePath();
}

function isCircleClearSelected(circleClear,mouseX, mouseY){
    var displacement_X = circleClear.centerCoordinateX_InCanvasArea - mouseX;
    var displacement_Y = circleClear.centerCoordinateY_InCanvasArea - mouseY;
    var displacement = Math.sqrt((displacement_X*displacement_X)  + (displacement_Y*displacement_Y) );
    if(  displacement < circleClear.radius  ){
        circleClear.isSelected = true;
        return;
    }
    circleClear.isSelected = false;
}

function circleClearDisplacement(circleClear,deltaX,deltaY){
    circleClear.centerCoordinateX_InCanvasArea = circleClear.centerCoordinateX_InCanvasArea + deltaX;
    circleClear.centerCoordinateY_InCanvasArea = circleClear.centerCoordinateY_InCanvasArea + deltaY;
}

function ctrlV_circlesClear(circleClear) {
    if (circleClear.isCtrlC) {
        var circ = new CircleClear(mouseCursorPositionInArea_X, mouseCursorPositionInArea_Y, circleClear.radius, circleClear.startAngle, circleClear.endAngle, false);
        var object = new ObjectShape(shapeTypes[6],circ);
        objetcsShape.push(object);
        circleClear.isCtrlC = false;
    }
}

function drawFilledCircleClearWhileMouseHold(mouseX_while,mouseY_while,mouseX,mouseY) {
    var deltaX = mouseX_while - mouseX;
    var deltaY = mouseY_while - mouseY;
    var radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.fillStyle =  fillColorClearArea;
    contextFourierTransformArea.globalAlpha= globalAlphaClearArea;
    contextFourierTransformArea.strokeStyle = strokeColorClearArea;
    contextFourierTransformArea.lineWidth = borderWidthClearArea;
    contextFourierTransformArea.arc(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  radius, 0, 2 * Math.PI);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.stroke();

    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.fillStyle =  fillColorClearArea;
    contextFourierTransformArea.globalAlpha= globalAlphaClearArea;
    contextFourierTransformArea.strokeStyle = strokeColorClearArea;
    contextFourierTransformArea.lineWidth = borderWidthClearArea;
    contextFourierTransformArea.arc(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  internRadius, 0, 2 * Math.PI);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.stroke();
}

function circleClearInSpectrum(circleClear){
    var recX = Math.round(circleClear.centerCoordinateX_InCanvasArea-circleClear.radius);
    var recY = Math.round(circleClear.centerCoordinateY_InCanvasArea-circleClear.radius);
    var recWidth = Math.round(recX + (circleClear.radius*2) );
    var recHeight = Math.round(recY + (circleClear.radius*2) );


    for(var row=recY; row<recY+recHeight; row++){

        for(var col=recX; col<recX+recWidth; col++){

            if( (circleClear.centerCoordinateX_InCanvasArea-col)*(circleClear.centerCoordinateX_InCanvasArea-col)
                + (circleClear.centerCoordinateY_InCanvasArea-row)*(circleClear.centerCoordinateY_InCanvasArea-row)
                < (circleClear.radius*circleClear.radius) ){//is it inside the circle
                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4] = fftSpectrumOriginal.real[((row*fftSpectrumModified.width)+col)*4];
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4] = fftSpectrumOriginal.imag[((row*fftSpectrumModified.width)+col)*4];

                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +1] = fftSpectrumOriginal.real[((row*fftSpectrumModified.width)+col)*4+1];
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +1] = fftSpectrumOriginal.imag[((row*fftSpectrumModified.width)+col)*4+1];

                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +2] = fftSpectrumOriginal.real[((row*fftSpectrumModified.width)+col)*4+2];
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +2] = fftSpectrumOriginal.imag[((row*fftSpectrumModified.width)+col)*4+2];

                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +3] = 255;
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +3] = 255;
            }

        }

    }

}

function areaCalculation(circle){
    return (circle.radius*circle.radius*Math.PI);
}
