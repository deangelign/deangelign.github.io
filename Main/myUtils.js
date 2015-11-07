/////global variables

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
var OriginalImage = contextFourierTransformArea.getImageData(0,0,canvasAreaWidth, canvasAreaHeight);
var imageWhileMousePresses = OriginalImage;
var imageGeneratedFromLastMousePressUp = OriginalImage;
//////////////////////////


//////////////////////////////////////////////////////
var isButtonDrawingRectangleSelected = false;
var isButtonDrawingCircleSelected = false;
var isButtonDrawingLineSelected = false;
var isButtonDrawingFreeFormSelected = false;

var ButtonDrawingRectangle  = document.getElementById('drawRectangleIcon');
var ButtonDrawingCircle = document.getElementById('drawCircleIcon');
var ButtonDrawingLine = document.getElementById('drawLineIcon');
var ButtonDrawingFreeForm = document.getElementById('drawFreeFormIcon');
//////////////////////////////////////////////////////

//////////////////////////////////////////////////////
var defaultButtonBorderStyle = "2px solid #555555";
var selectedButtonBorderStyle = "2px solid blue";
////////////////////////////////////////////////////


/////////////////////////////classes constructor//////////////////////////////
var Rectangle = function (coordinateX_InCanvasArea,coordinateY_InCanvasArea,width,heigh, isSelected) {
    this.coordinateX_InCanvasArea = coordinateX_InCanvasArea
    this.coordinateY_InCanvasArea = coordinateY_InCanvasArea
    this.width = width;
    this.heigh = heigh;
    this.isSelected = isSelected;
}

var Circle = function (centerCoordinateX_InCanvasArea,centerCoordinateY_InCanvasArea,radius, startAngle, endAngle, isSelected) {
    this.centerCoordinateX_InCanvasArea = centerCoordinateX_InCanvasArea;
    this.centerCoordinateY_InCanvasArea = centerCoordinateY_InCanvasArea;
    this.radius = radius;
    this.startAngle = startAngle;
    this.endAngle = endAngle;
    this.isSelected = isSelected;
}

var Line = function (startCoordinateX_InCanvasArea,startCoordinateY_InCanvasArea,endCoordinateX_InCanvasArea,endCoordinateY_InCanvasArea, isSelected) {
    this.startCoordinateX_InCanvasArea = startCoordinateX_InCanvasArea;
    this.startCoordinateY_InCanvasArea = startCoordinateY_InCanvasArea;
    this.endCoordinateX_InCanvasArea = endCoordinateX_InCanvasArea;
    this.endCoordinateY_InCanvasArea = endCoordinateY_InCanvasArea;
    this.isSelected = isSelected;
}
///////////////////////////////////////////////////////////////

//////////////////////////vectors/////////////////////////
var rectangles = [];
var circles = [];
var lines = [];


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
    }
    else if(isButtonDrawingCircleSelected){
        var deltaX = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var deltaY = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        var radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
        var circle = new Circle(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  radius, 0, 2 * Math.PI,false);
        circles.push(circle);
    }else if(isButtonDrawingLineSelected){
        var line = new Line(mouseCursorPositionInArea_X_mouseDown, mouseCursorPositionInArea_Y_mouseDown, mouseCursorPositionInArea_X_mouseDown_While, mouseCursorPositionInArea_Y_mouseDown_While, false);
        lines.push(line);
    }
}

function drawObjectShapesInOriginalImage(){
    imageGeneratedFromLastMousePressUp = OriginalImage;
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
    imageGeneratedFromLastMousePressUp = contextFourierTransformArea.getImageData(0,0,canvasAreaWidth, canvasAreaHeight);
}


////////////drawing functions//////////
function drawFilledRectangle(rectangle){
    contextFourierTransformArea.fillRect(rectangle.coordinateX_InCanvasArea, rectangle.coordinateY_InCanvasArea, rectangle.width,rectangle.heigh );
}

function drawFilledRectangleSelected(rectangle){
    contextFourierTransformArea.beginPath();
    contextFourierTransformArea.rect(rectangle.coordinateX_InCanvasArea, rectangle.coordinateY_InCanvasArea, rectangle.width, rectangle.heigh);
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
        if((mouseY > rectangle.coordinateY_InCanvasArea) && (mouseY < rectangle.coordinateY_InCanvasArea + rectangle.heigh)){
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

//////////////////////////////////////////
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
////////////////////////////////////////


//convert R-G-B to Hexadecimal
function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

function drawShapeBorderWhileMouseDown(){

    if(isButtonDrawingRectangleSelected){
        var rectWidth = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var rectHeight = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        contextFourierTransformArea.strokeStyle = 'black';
        contextFourierTransformArea.strokeRect(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,rectWidth,rectHeight);
    }else if(isButtonDrawingCircleSelected){
        contextFourierTransformArea.beginPath();
        var deltaX = mouseCursorPositionInArea_X_mouseDown_While - mouseCursorPositionInArea_X_mouseDown;
        var deltaY = mouseCursorPositionInArea_Y_mouseDown_While - mouseCursorPositionInArea_Y_mouseDown;
        var radius = Math.sqrt((deltaX*deltaX) + (deltaY*deltaY));
        contextFourierTransformArea.beginPath();
        contextFourierTransformArea.arc(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown,  radius, 0, 2 * Math.PI);
        contextFourierTransformArea.strokeStyle = 'black';
        contextFourierTransformArea.stroke();
    }else if(isButtonDrawingLineSelected){
        contextFourierTransformArea.beginPath();
        contextFourierTransformArea.moveTo(mouseCursorPositionInArea_X_mouseDown,mouseCursorPositionInArea_Y_mouseDown);
        contextFourierTransformArea.lineTo(mouseCursorPositionInArea_X_mouseDown_While, mouseCursorPositionInArea_Y_mouseDown_While);
        contextFourierTransformArea.strokeStyle = 'black';
        contextFourierTransformArea.stroke();
    }

}

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

$("#imageFourier").on('click', function (e) {
    if (longpress) {

    }

    if(!(isButtonDrawingRectangleSelected || isButtonDrawingCircleSelected || isButtonDrawingLineSelected || isButtonDrawingFreeFormSelected)){

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
});

$("#imageFourier").on('mouseup', function (e) {
    endTime = new Date().getTime();
    longpress = (endTime - startTime >= 200);//clica e espera pelo ao menos 0.2 segundo para ser considera um "click and hold"
    //coordMouseDownMouseUp += "<br>" + "x=" + mouseCursorPositionInArea_X_mouseup + ", y=" + mouseCursorPositionInArea_Y_mouseup;
    $('#status2').html(coordMouseDownMouseUp);
    mousePressed = false;
    storeObjectShape();
    drawObjectShapesInOriginalImage();
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
    }
});

document.addEventListener("keydown", keyDownTextField, false);

function keyDownTextField(e) {
    var keyCode = e.keyCode;
    if(keyCode==46) {
        for(var index=0; index<rectangles.length ; index++){
            if(rectangles[index].isSelected){
                rectangles.splice(index,1);
            }

        }

        for(var index=0; index<circles.length ; index++){
            if(circles[index].isSelected){
                circles.splice(index,1);
            }
        }

        for(var index=0; index<lines.length ; index++){
            if(lines[index].isSelected){
                lines.splice(index,1);
            }
        }
        drawObjectShapesInOriginalImage();
    }
}




