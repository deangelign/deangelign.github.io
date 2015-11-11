/////global variables

var startTime;

//////////mouse pointetr coordinates
var mouseCursorPositionInArea_X;
var mouseCursorPositionInArea_Y;

var mouseCursorPositionInArea_X_mouseDown;
var mouseCursorPositionInArea_Y_mouseDown;

var mouseCursorPositionInArea_X_mouseDown_While;
var mouseCursorPositionInArea_Y_mouseDown_While;
////////////////////////////////////////////

///////mouse onclick
var mousePressed = false;

var coordMouseDownMouseUp;//debugging purposes
///////////////////////////

/////////////drawing parameters
var  fillColor = "black";
var strokeColor = "black";
var borderWidth = 1;
///////////////////////////////

///////////////////////////
var OriginalImage = contextFourierTransformArea.getImageData(0,0,canvasEditableAreaWidth, canvasEditableAreaHeight);
var imageWhileMousePresses = OriginalImage;
var imageGeneratedFromLastMousePressUp = OriginalImage;
//////////////////////////


////////////////drag and drop objects/////////////////
var lastMouseCursorPositionX = 0;
var lastMouseCursorPositionY = 0;

/////////////////////////////////////////////////

//////////////////////////////////////////////////////
var isButtonDrawingRectangleSelected = false;
var isButtonDrawingCircleSelected = false;
var isButtonDrawingLineSelected = false;
var isButtonDrawingFreeFormSelected = false;
var isButtonDrawingConjugateSelected = false;

var ButtonDrawingRectangle  = document.getElementById('drawRectangleIcon');
var ButtonDrawingCircle = document.getElementById('drawCircleIcon');
var ButtonDrawingLine = document.getElementById('drawLineIcon');
var ButtonDrawingFreeForm = document.getElementById('drawFreeFormIcon');
var ButtonDrawingComplexConjugate = document.getElementById('drawConjugate');
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
var defaultButtonBorderStyle = "2px solid #555555";
var selectedButtonBorderStyle = "2px solid blue";
////////////////////////////////////////////////////

//////////////////////////////
ButtonDrawingRectangle.style.border = defaultButtonBorderStyle;
ButtonDrawingCircle.style.border = defaultButtonBorderStyle;
ButtonDrawingLine.style.border = defaultButtonBorderStyle;
ButtonDrawingFreeForm.style.border = defaultButtonBorderStyle;
ButtonDrawingComplexConjugate.style.border = defaultButtonBorderStyle;
////////////////////////////


/////////////////////////////classes constructor//////////////////////////////
var Rectangle = function (coordinateX_InCanvasArea,coordinateY_InCanvasArea,width,height, isSelected) {
    this.coordinateX_InCanvasArea = coordinateX_InCanvasArea
    this.coordinateY_InCanvasArea = coordinateY_InCanvasArea
    this.width = width;
    this.height = height;
    this.isSelected = isSelected;
    this.isCtrlC = false;
}

var Circle = function (centerCoordinateX_InCanvasArea,centerCoordinateY_InCanvasArea,radius, startAngle, endAngle, isSelected) {
    this.centerCoordinateX_InCanvasArea = centerCoordinateX_InCanvasArea;
    this.centerCoordinateY_InCanvasArea = centerCoordinateY_InCanvasArea;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.isSelected = isSelected;
    this.isCtrlC = false;
}

var Line = function (startCoordinateX_InCanvasArea,startCoordinateY_InCanvasArea,endCoordinateX_InCanvasArea,endCoordinateY_InCanvasArea, isSelected) {
    this.startCoordinateX_InCanvasArea = startCoordinateX_InCanvasArea;
    this.startCoordinateY_InCanvasArea = startCoordinateY_InCanvasArea;
    this.endCoordinateX_InCanvasArea = endCoordinateX_InCanvasArea;
    this.endCoordinateY_InCanvasArea = endCoordinateY_InCanvasArea;
    this.isSelected = isSelected;
    this.isCtrlC = false;
}
///////////////////////////////////////////////////////////////

//////////////////////////vectors/////////////////////////
var rectangles = [];
var circles = [];
var lines = [];
//////////////////////////////////////////////////////


//acha a posicao do curso do mouse em relacao a um objeto na pagina
function findPos(obj) {
    var curleft = 0, curtop = 0;
    if (obj.offsetParent) {
        do {
            curleft += obj.offsetLeft;
            curtop += obj.offsetTop;
        } while (obj = obj.offsetParent);
        return { x: curleft, y: curtop };
    }
    return undefined;
}

//convert R-G-B to Hexadecimal
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}



function storeObjectShape(){
    if(isButtonDrawingRectangleSelected){
        var rectWidth = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var rectHeight = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        if(rectWidth < 0){
            mouseCursorPositionInArea_X_mouseDown = mouseCursorPositionInArea_X_mouseDown + rectWidth;
            rectWidth = -rectWidth;
        }
        if(rectHeight < 0){
            mouseCursorPositionInArea_Y_mouseDown = mouseCursorPositionInArea_Y_mouseDown + rectHeight;
            rectHeight = -rectHeight;
        }

        var rectangle = new Rectangle(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,rectWidth,rectHeight,false);
        rectangles.push(rectangle);
        if(isButtonDrawingConjugateSelected){

            var displacementCenterImageToRectangleCentroidX = (rectangle.coordinateX_InCanvasArea+(rectangle.width/2))- canvasEditableAreaWidth/2;
            var displacementCenterImageToRectangleCentroidY = (rectangle.coordinateY_InCanvasArea+(rectangle.height/2))- canvasEditableAreaHeight/2;

            //conjugate is located in the opposite direction
            displacementCenterImageToRectangleCentroidX = -displacementCenterImageToRectangleCentroidX;
            displacementCenterImageToRectangleCentroidY = -displacementCenterImageToRectangleCentroidY;

            var conjugateCentroidX = displacementCenterImageToRectangleCentroidX+(canvasEditableAreaWidth/2);
            var conjugateCentroidY = displacementCenterImageToRectangleCentroidY+(canvasEditableAreaHeight/2);
            var rectangleConjugate = new Rectangle(conjugateCentroidX - (rectangle.width/2), conjugateCentroidY - (rectangle.height/2), rectWidth,rectHeight,false);
            rectangles.push(rectangleConjugate);
        }
    }
    else if(isButtonDrawingCircleSelected){
        var deltaX = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var deltaY = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        var radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
        var circle = new Circle(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  radius, 0, 2 * Math.PI,false);
        circles.push(circle);

        if(isButtonDrawingConjugateSelected){
            var displacementCenterImageToCircleCentroidX = (circle.centerCoordinateX_InCanvasArea - (canvasEditableAreaWidth/2));
            var displacementCenterImageToCircleCentroidY = (circle.centerCoordinateY_InCanvasArea - (canvasEditableAreaHeight/2) );

            displacementCenterImageToCircleCentroidX = -displacementCenterImageToCircleCentroidX;
            displacementCenterImageToCircleCentroidY = -displacementCenterImageToCircleCentroidY;

            var conjugateCentroidX = displacementCenterImageToCircleCentroidX+(canvasEditableAreaWidth/2);
            var conjugateCentroidY = displacementCenterImageToCircleCentroidY+(canvasEditableAreaHeight/2);


            var circleConjugate = new Circle(conjugateCentroidX,conjugateCentroidY,  radius, 0, 2 * Math.PI,false);
            circles.push(circleConjugate);


        }

    }else if(isButtonDrawingLineSelected){
        var line = new Line(mouseCursorPositionInArea_X_mouseDown, mouseCursorPositionInArea_Y_mouseDown, mouseCursorPositionInArea_X_mouseDown_While, mouseCursorPositionInArea_Y_mouseDown_While, false);
        lines.push(line);
    }
}

function deleteAllObjectsShape(){

    rectangles.splice(0,rectangles.length);
    circles.splice(0,circles.length);
    //for(var index; index < rectangles.length; index++){
    //    rectangles.pop();
    //}

    //for(var index; index < circles.length; index++){
    //    circles.pop();
    //}

    //for(var index; index < lines.length; index++){
    //    lines.pop();
    //}

}

function drawObjectShapesInOriginalImage(){
    contextFourierTransformArea.putImageData(OriginalImage, 0,0);

    for(var index=0; index<rectangles.length ; index++){
        if(rectangles[index].isSelected){
            drawFilledRectangleSelected(rectangles[index]);
        }
        else{
            drawFilledRectangle(rectangles[index]);
        }

    }

    for(var index=0; index<circles.length ; index++){
        if(circles[index].isSelected){
            drawFilledCircleSelected(circles[index]);
        }else{
            drawFilledCircle(circles[index]);
        }
    }

    for(var index=0; index<lines.length ; index++){
        if(lines[index].isSelected){
            drawLineSelected(lines[index]);
        }else{
            drawLine(lines[index]);
        }
    }
    imageGeneratedFromLastMousePressUp = contextFourierTransformArea.getImageData(0,0,canvasEditableAreaWidth, canvasEditableAreaHeight);
    drawInverseFFTImage();
}

function drawInverseFFTImage(){
    if(isImageLoaded){
        calculateZeroAreaInSpectrum();
        IFFT(fftSpectrumModified,'imageFourierResult',contextCanvasImageUploadedArea.getImageData(0,0,canvasEditableAreaWidth,canvasEditableAreaHeight).data );
    }
}


////////////drawing functions//////////
function drawFilledRectangle(rectangle){
    contextFourierTransformArea.fillRect(rectangle.coordinateX_InCanvasArea, rectangle.coordinateY_InCanvasArea, rectangle.width,rectangle.height );
}

function drawFilledRectangleSelected(rectangle){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.rect(rectangle.coordinateX_InCanvasArea, rectangle.coordinateY_InCanvasArea, rectangle.width, rectangle.height);
    contextFourierTransformArea.fillStyle = 'black';
    contextFourierTransformArea.fill();
    contextFourierTransformArea.lineWidth = 2;
    contextFourierTransformArea.strokeStyle = 'blue';
    contextFourierTransformArea.stroke();
}


function drawFilledCircle(circle){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.arc(circle.centerCoordinateX_InCanvasArea, circle.centerCoordinateY_InCanvasArea,circle.radius,circle.startAngle,circle.endAngle);
    contextFourierTransformArea.fill();
}

function drawFilledCircleSelected(circle){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.arc(circle.centerCoordinateX_InCanvasArea, circle.centerCoordinateY_InCanvasArea,circle.radius,circle.startAngle,circle.endAngle);
    contextFourierTransformArea.fill();
    contextFourierTransformArea.lineWidth = 2;
    contextFourierTransformArea.strokeStyle = 'blue';
    contextFourierTransformArea.stroke();
}

function drawLine(line){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.moveTo(line.startCoordinateX_InCanvasArea,line.startCoordinateY_InCanvasArea);
    contextFourierTransformArea.lineTo(line.endCoordinateX_InCanvasArea,line.endCoordinateY_InCanvasArea);
    contextFourierTransformArea.stroke();
}

function drawLineSelected(line){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.moveTo(line.startCoordinateX_InCanvasArea,line.startCoordinateY_InCanvasArea);
    contextFourierTransformArea.lineTo(line.endCoordinateX_InCanvasArea,line.endCoordinateY_InCanvasArea);
    contextFourierTransformArea.lineWidth = 10;
    contextFourierTransformArea.strokeStyle = 'blue';
    contextFourierTransformArea.stroke();
}
///////////////////////////


///////isSelected object-shape functions/////////
function anyObjectShapeSelected(mouseX,mouseY){
    anyRectangleSelected(mouseX,mouseY);
    anyCircleSelected(mouseX,mouseY);
    anyLineSelected(mouseX,mouseY);
    drawObjectShapesInOriginalImage();
}

function anyRectangleSelected(mouseX,mouseY){
    for(var index=0; index<rectangles.length ; index++){
        isRetangleSelected(rectangles[index],mouseX, mouseY);
    }
}

function isRetangleSelected(rectangle,mouseX, mouseY){

    if( (mouseX > rectangle.coordinateX_InCanvasArea) && (mouseX < rectangle.coordinateX_InCanvasArea + rectangle.width) ){
        if((mouseY > rectangle.coordinateY_InCanvasArea) && (mouseY < rectangle.coordinateY_InCanvasArea + rectangle.height)){
            rectangle.isSelected = true;
            return;
        }
    }
    rectangle.isSelected = false;
}

function anyCircleSelected(mouseX,mouseY){
    for(var index=0; index<circles.length ; index++){
        isCircleSelected(circles[index],mouseX, mouseY);
    }
}

function isCircleSelected(circle,mouseX, mouseY){
    var displacement_X = circle.centerCoordinateX_InCanvasArea - mouseX;
    var displacement_Y = circle.centerCoordinateY_InCanvasArea - mouseY;
    var displacement = Math.sqrt((displacement_X*displacement_X)  + (displacement_Y*displacement_Y) );
    if(  displacement < circle.radius  ){
        circle.isSelected = true;
        return;
    }
    circle.isSelected = false;
}

function anyLineSelected(mouseX,mouseY){
    for(var index=0; index<lines.length ; index++){
        isLineSelected(lines[index],mouseX, mouseY);
    }
}

//need improvements
function isLineSelected(line,mouseX, mouseY){
    var slope1 = (mouseY-line.startCoordinateY_InCanvasArea)/(mouseX-line.startCoordinateX_InCanvasArea);
    var slope2 = (line.endCoordinateX_InCanvasArea-line.startCoordinateY_InCanvasArea)/(line.endCoordinateY_InCanvasArea-line.startCoordinateX_InCanvasArea);
    //var tolerance;
    if(slope1 == slope2){
        line.isSelected = true;
        return;
    }
    line.isSelected = false;

}
/////////////////////////////////////////////////


////////////////////////////displacements////////////
function rectangleDisplacement(rectangle,deltaX,deltaY){
    rectangle.coordinateX_InCanvasArea = rectangle.coordinateX_InCanvasArea + deltaX;
    rectangle.coordinateY_InCanvasArea = rectangle.coordinateY_InCanvasArea + deltaY;
}

function circleDisplacement(circle,deltaX,deltaY){
    circle.centerCoordinateX_InCanvasArea = circle.centerCoordinateX_InCanvasArea + deltaX;
    circle.centerCoordinateY_InCanvasArea = circle.centerCoordinateY_InCanvasArea + deltaY;
}
////////////////////////////////////////////////////


/////////////////////////////////ctrl+c functions
function ctrlC_objects(){
    ctrlC_rectangle();
    ctrlC_circles();
}

function ctrlC_rectangle(){
    for(var index=0; index<rectangles.length; index++){
        if(rectangles[index].isSelected){
            rectangles[index].isCtrlC = true;
        }
    }
}

function ctrlC_circles(){
    for(var index=0; index<circles.length; index++){
        if(circles[index].isSelected){
            circles[index].isCtrlC = true;
        }
    }
}
////////////////////////////////////////////////////////



/////////////////////////////////////ctrl+v functions
function ctrlV_objects(){
    ctrlV_rectangles();
    ctrlV_circles();
    drawObjectShapesInOriginalImage();

}


function ctrlV_rectangles() {
    var numberOfRectanglesBeforeCtrlV = rectangles.length;
    for (var index = 0; index < numberOfRectanglesBeforeCtrlV; index++) {
        if (rectangles[index].isCtrlC) {
            var rectangle = new Rectangle(mouseCursorPositionInArea_X, mouseCursorPositionInArea_Y, rectangles[index].width, rectangles[index].height, false);
            rectangles.push(rectangle);
            rectangles[index].isCtrlC = false;
        }
    }
}

function ctrlV_circles() {
    var numberOfCirclesBeforeCtrlV = circles.length;
    for (var index = 0; index < numberOfCirclesBeforeCtrlV; index++) {
        if (circles[index].isCtrlC) {
            var circle = new Circle(mouseCursorPositionInArea_X, mouseCursorPositionInArea_Y, circles[index].radius, circles[index].startAngle, circles[index].endAngle, false);
            circles.push(circle);
            circles[index].isCtrlC = false;
        }
    }
}
///////////////////////////////////////////////////////



function receiveDataFromNewImageUpdated(imageData) {
    OriginalImage = imageData;
    imageWhileMousePresses = OriginalImage;
    imageGeneratedFromLastMousePressUp = OriginalImage;
}

function deslectAllObjectShapes(){

    for(var index=0; index<rectangles.length ; index++){
        rectangles[index].isSelected = false;
    }

    for(var index=0; index<circles.length ; index++){
        circles[index].isSelected = false;
    }

    for(var index=0; index<lines.length ; index++){
        linesp[index].isSelected = false;
    }


}

//////////////////////////////////////////button drawing
function drawRectangleSelectedButton(){
    if(isButtonDrawingRectangleSelected){
        ButtonDrawingRectangle.style.border = defaultButtonBorderStyle;
        isButtonDrawingRectangleSelected = false;
    }else{
        ButtonDrawingRectangle.style.border = selectedButtonBorderStyle;
        isButtonDrawingRectangleSelected = true;
        deslectAllObjectShapes();
        drawObjectShapesInOriginalImage();

    }

    isButtonDrawingCircleSelected = false;
    isButtonDrawingLineSelected = false;
    isButtonDrawingFreeFormSelected = false;


    ButtonDrawingCircle.style.border = defaultButtonBorderStyle;
    ButtonDrawingLine.style.border = defaultButtonBorderStyle;
    ButtonDrawingFreeForm.style.border = defaultButtonBorderStyle;
}

function drawCircleSelectedButton(){
    if(isButtonDrawingCircleSelected){
        ButtonDrawingCircle.style.border = defaultButtonBorderStyle;
        isButtonDrawingCircleSelected = false;
    }else{
        ButtonDrawingCircle.style.border = selectedButtonBorderStyle;
        isButtonDrawingCircleSelected = true;
        deslectAllObjectShapes();
        drawObjectShapesInOriginalImage();
    }
    isButtonDrawingRectangleSelected = false;
    isButtonDrawingLineSelected = false;
    isButtonDrawingFreeFormSelected = false;

    ButtonDrawingRectangle.style.border = defaultButtonBorderStyle;
    ButtonDrawingLine.style.border = defaultButtonBorderStyle;
    ButtonDrawingFreeForm.style.border = defaultButtonBorderStyle;
}

function drawLineSelectedButton(){
    if(isButtonDrawingLineSelected){
        ButtonDrawingLine.style.border = defaultButtonBorderStyle;
        isButtonDrawingLineSelected = false;
    }else{
        ButtonDrawingLine.style.border = selectedButtonBorderStyle;
        isButtonDrawingLineSelected = true;
        deslectAllObjectShapes();
        drawObjectShapesInOriginalImage();
    }
    isButtonDrawingRectangleSelected = false;
    isButtonDrawingCircleSelected = false;
    isButtonDrawingFreeFormSelected = false;

    ButtonDrawingRectangle.style.border = defaultButtonBorderStyle;
    ButtonDrawingCircle.style.border = defaultButtonBorderStyle;
    ButtonDrawingFreeForm.style.border = defaultButtonBorderStyle;
}

function drawFreeFormSelectedButton(){
    if(isButtonDrawingFreeFormSelected){
        ButtonDrawingFreeForm.style.border = defaultButtonBorderStyle;
        isButtonDrawingFreeFormSelected = false;
    }else{
        ButtonDrawingFreeForm.style.border = selectedButtonBorderStyle;
        isButtonDrawingFreeFormSelected = true;
        deslectAllObjectShapes();
        drawObjectShapesInOriginalImage();
    }
    isButtonDrawingRectangleSelected = false;
    isButtonDrawingCircleSelected = false;
    isButtonDrawingLineSelected = false;

    ButtonDrawingRectangle.style.border = defaultButtonBorderStyle;
    ButtonDrawingCircle.style.border = defaultButtonBorderStyle;
    ButtonDrawingLine.style.border = defaultButtonBorderStyle;
}

function drawComplexConjugateButtonSelected(){
    if(isButtonDrawingConjugateSelected){
        ButtonDrawingComplexConjugate.style.border = defaultButtonBorderStyle;
        isButtonDrawingConjugateSelected = false;
    }
    else{
        ButtonDrawingComplexConjugate.style.border = selectedButtonBorderStyle;
        isButtonDrawingConjugateSelected = true;
        deslectAllObjectShapes();
        drawObjectShapesInOriginalImage();
    }


}
////////////////////////////////////////





/////////////////////////////////while mouse down
function whileMouseDown(CursorPositionX, CursorPositionY){
    contextFourierTransformArea.putImageData(imageGeneratedFromLastMousePressUp, 0,0);
    mouseCursorPositionInArea_X_mouseDown_While = CursorPositionX;
    mouseCursorPositionInArea_Y_mouseDown_While = CursorPositionY;
    drawShapeBorderWhileMouseDown();
    coordMouseDownMouseUp = "x=" + mouseCursorPositionInArea_X_mouseDown + ", y=" + mouseCursorPositionInArea_Y_mouseDown +
        "<br>" + "x=" + mouseCursorPositionInArea_X_mouseDown_While + ", y=" + mouseCursorPositionInArea_Y_mouseDown_While;

    //debugging purposes
    $('#status2').html(coordMouseDownMouseUp);
}

function whileMouseDownObjectSelected(){
    var displacementX = mouseCursorPositionInArea_X - lastMouseCursorPositionX;
    var displacementY = mouseCursorPositionInArea_Y - lastMouseCursorPositionY;

    for(var index=0; index<rectangles.length ; index++){
        if(rectangles[index].isSelected){
            rectangleDisplacement(rectangles[index],displacementX,displacementY)
        }
    }

    for(var index=0; index<circles.length ; index++){
        if(circles[index].isSelected){
            circleDisplacement(circles[index],displacementX,displacementY);
        }
    }
    drawObjectShapesInOriginalImage();

    lastMouseCursorPositionX = mouseCursorPositionInArea_X;
    lastMouseCursorPositionY = mouseCursorPositionInArea_Y;

}

function drawShapeBorderWhileMouseDown(){

    if(isButtonDrawingRectangleSelected){
        var rectWidth = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var rectHeight = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        contextFourierTransformArea.strokeStyle = 'blue';
        contextFourierTransformArea.strokeRect(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,rectWidth,rectHeight);
    }else if(isButtonDrawingCircleSelected){
        contextFourierTransformArea.beginPath();
        var deltaX = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var deltaY = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        var radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
        contextFourierTransformArea.beginPath();
        contextFourierTransformArea.arc(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  radius, 0, 2 * Math.PI);
        contextFourierTransformArea.strokeStyle = 'blue';
        contextFourierTransformArea.stroke();
    }else if(isButtonDrawingLineSelected){
        contextFourierTransformArea.beginPath();
        contextFourierTransformArea.moveTo(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
        contextFourierTransformArea.lineTo(mouseCursorPositionInArea_X_mouseDown_While, mouseCursorPositionInArea_Y_mouseDown_While);
        contextFourierTransformArea.strokeStyle = 'blue';
        contextFourierTransformArea.stroke();
    }

}
/////////////////////////////////////////////

function anyButtonDrawSelected() {
    if ((isButtonDrawingRectangleSelected || isButtonDrawingCircleSelected || isButtonDrawingLineSelected || isButtonDrawingFreeFormSelected)
    || (isButtonDrawingConjugateSelected)) {
        return true;
    }else{
        return false;
    }
}
///////////////////////////////////output image fft functions
function calculateZeroAreaInSpectrum(){

    fftCopyData(fftSpectrumOriginal,fftSpectrumModified);

    for(var index=0; index<rectangles.length ; index++){
        rectangleInSpectrum(rectangles[index]);
    }

    for(var index=0; index<circles.length ; index++){
        circleInSpectrum(circles[index]);
    }

}

function rectangleInSpectrum(retangle){

    for(var row=retangle.coordinateY_InCanvasArea; row<retangle.coordinateY_InCanvasArea+retangle.height; row++){

        for(var col=retangle.coordinateX_InCanvasArea; col<retangle.coordinateX_InCanvasArea+retangle.width; col++){
            fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4] = 0;
            fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4] = 0;

            fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +1] = 0;
            fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +1] = 0;

            fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +2] = 0;
            fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +2] = 0;

            fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +3] = 255;
            fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +3] = 255;
        }

    }

}

function circleInSpectrum(circle){
    var recX = Math.round(circle.centerCoordinateX_InCanvasArea-circle.radius);
    var recY = Math.round(circle.centerCoordinateY_InCanvasArea-circle.radius);
    var recWidth = Math.round(recX + (circle.radius*2) );
    var recHeight = Math.round(recY + (circle.radius*2) );
    var circleBox = new Rectangle(circle.centerCoordinateX_InCanvasArea-circle.radius, circle.centerCoordinateY_InCanvasArea-circle.radius,circle.radius*2,circle.radius*2);


    for(var row=recY; row<recY+recHeight; row++){

        for(var col=recX; col<recX+recWidth; col++){

            if( (circle.centerCoordinateX_InCanvasArea-col)*(circle.centerCoordinateX_InCanvasArea-col) + (circle.centerCoordinateY_InCanvasArea-row)*(circle.centerCoordinateY_InCanvasArea-row)  < (circle.radius*circle.radius) ){//is it inside the circle
                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4] = 0;
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4] = 0;

                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +1] = 0;
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +1] = 0;

                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +2] = 0;
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +2] = 0;

                fftSpectrumModified.real[((row*fftSpectrumModified.width)+col)*4 +3] = 255;
                fftSpectrumModified.imag[((row*fftSpectrumModified.width)+col)*4 +3] = 255;
            }

        }

    }


}
////////////////////////////////////////////////////////////////////////////////////////


$("#imageFourier").on('click', function (e) {
    /*if (longpress) {

    }*/

    if(!(anyButtonDrawSelected())){
        var pos = findPos(this);
        mouseCursorPositionInArea_X = e.pageX - pos.x;
        mouseCursorPositionInArea_Y = e.pageY - pos.y;
        anyObjectShapeSelected(mouseCursorPositionInArea_X, mouseCursorPositionInArea_Y);
    }


});

$("#imageFourier").on('mousedown', function (e) {
        var pos = findPos(this);
    mouseCursorPositionInArea_X_mouseDown = e.pageX - pos.x;
    mouseCursorPositionInArea_Y_mouseDown = e.pageY - pos.y;
    coordMouseDownMouseUp = "x=" + mouseCursorPositionInArea_X_mouseDown + ", y=" + mouseCursorPositionInArea_Y_mouseDown;
    $('#status2').html(coordMouseDownMouseUp);
    startTime = new Date().getTime();

    mousePressed =  true;
    lastMouseCursorPositionX = mouseCursorPositionInArea_X;
    lastMouseCursorPositionY = mouseCursorPositionInArea_Y;
});

$("#imageFourier").on('mouseup', function (e) {
    endTime = new Date().getTime();
    longpress = (endTime - startTime >= 200);//clica e espera pelo ao menos 0.2 segundo para ser considera um "click and hold"
    //coordMouseDownMouseUp += "<br>" + "x=" + mouseCursorPositionInArea_X_mouseup + ", y=" + mouseCursorPositionInArea_Y_mouseup;
    $('#status2').html(coordMouseDownMouseUp);
    mousePressed = false;
    if( anyButtonDrawSelected()){
        storeObjectShape();
        drawObjectShapesInOriginalImage();



    }
});

$('#imageFourier').mousemove(function(e) {
    var pos = findPos(this);
    mouseCursorPositionInArea_X = e.pageX - pos.x;
    mouseCursorPositionInArea_Y = e.pageY - pos.y;
    var coord = "x=" +  mouseCursorPositionInArea_X + ", y=" + mouseCursorPositionInArea_Y;
    var c = this.getContext('2d');
    var p = contextFourierTransformArea.getImageData(mouseCursorPositionInArea_X, mouseCursorPositionInArea_Y, 1, 1).data;
    var hex = "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    $('#status').html(coord + "<br>" + hex);
    if(mousePressed){
        whileMouseDown(mouseCursorPositionInArea_X, mouseCursorPositionInArea_Y);
        if(!(anyButtonDrawSelected())){
            whileMouseDownObjectSelected();
        }
    }
});


//deletar objeto
document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    var keyCode = e.keyCode;
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;


    if(keyCode==46) {
        for(var index=0; index<rectangles.length ; index++){
            if(rectangles[index].isSelected){
                rectangles.splice(index,1);
                index = -1;
            }

        }

        for(var index=0; index<circles.length ; index++){
            if(circles[index].isSelected){
                circles.splice(index,1);
                index = -1;
            }
        }

        for(var index=0; index<lines.length ; index++){
            if(lines[index].isSelected){
                lines.splice(index,1);
                index = -1;
            }
        }
        drawObjectShapesInOriginalImage();
    }

}

//ctrl+c and ctrl+v of objects
$(document).ready(function()
{
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;

    $(document).keydown(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = true;
    }).keyup(function(e)
    {
        if (e.keyCode == ctrlKey) ctrlDown = false;
    });

    $(document).keydown(function(e)
    {
        if (ctrlDown && (e.keyCode == cKey)){
            if(!anyButtonDrawSelected()){
                ctrlC_objects();
                //alert('objetos copiados');
            }

        }
        if (ctrlDown && (e.keyCode == vKey)){
            if(!anyButtonDrawSelected()){
                ctrlV_objects();
                //alert('objetos colados');
            }
        }

    });
});





