/////////////////////////////////ctrl+c functions
function ctrlC_objects(){

    for(var index=0; index<objetcsShape.length; index++){
        if(objetcsShape[index].shape.isSelected) {

            if (objetcsShape[index].type == shapeTypes[0]) {
                objetcsShape[index].shape.isCtrlC = true;
            }

            if (objetcsShape[index].type == shapeTypes[1]) {
                objetcsShape[index].shape.isCtrlC = true;
            }

            if (objetcsShape[index].type == shapeTypes[2]) {
                objetcsShape[index].shape.isCtrlC = true;
            }

            if (objetcsShape[index].type == shapeTypes[3]) {
                objetcsShape[index].shape.isCtrlC = true;
            }
            if (objetcsShape[index].type == shapeTypes[4]) {
                objetcsShape[index].shape.isCtrlC = true;
            }
            if (objetcsShape[index].type == shapeTypes[5]) {
                objetcsShape[index].shape.isCtrlC = true;
            }
        }

    }
}


/////////////////////////////////////ctrl+v functions
function ctrlV_objects(){

    for(var index=0; index<objetcsShape.length; index++){
        if(objetcsShape[index].shape.isSelected) {
            if (objetcsShape[index].type == shapeTypes[0]) {
                ctrlV_rectangle(objetcsShape[index].shape);
            }
            if (objetcsShape[index].type == shapeTypes[1]) {
                ctrlV_rectanglesConjugate(objetcsShape[index].shape);
            }
            if (objetcsShape[index].type == shapeTypes[2]) {
                ctrlV_circles(objetcsShape[index].shape);
            }
            if (objetcsShape[index].type == shapeTypes[3]) {
                ctrlV_circlesConjugate(objetcsShape[index].shape);
            }
            if (objetcsShape[index].type == shapeTypes[4]) {
                ctrlV_clearRectangle(objetcsShape[index].shape);
            }
            if (objetcsShape[index].type == shapeTypes[5]) {
                ctrlV_rectanglesClearConjugate(objetcsShape[index].shape);
            }
        }
    }
    drawObjectShapesInOriginalImage();
}


//deletar objeto
document.addEventListener("keydown", keyDownTextField, false);
function keyDownTextField(e) {
    var keyCode = e.keyCode;
    var ctrlDown = false;
    var ctrlKey = 17, vKey = 86, cKey = 67;

    if(keyCode==46) {

        for(var index=0; index<objetcsShape.length ; index++){
            if(objetcsShape[index].shape.isSelected){
                objetcsShape.splice(index,1);
                index=-1;
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

