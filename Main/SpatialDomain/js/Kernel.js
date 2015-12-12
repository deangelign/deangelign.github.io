var Kernel = function(rows,cols, type, imageWidth, imageHeight){
    this.numberRows = rows;
    this.numberColumns = cols;
    this.type = type;
    this.MinimumRowAllowed = Math.floor(this.numberRows/2);
    this.MinimumColumnAllowed = Math.floor(this.numberColumns/2);
    this.MaximumRowAllowed = imageHeight - (this.MinimumRowAllowed);
    this.MaxiumColumnsAllowed = imageWidth - this.MinimumColumnAllowed;
    this.currentRow = this.MinimumRowAllowed;
    this.currentColumn = this.MinimumColumnAllowed;
    this.topLeftCornerRow = this.currentRow - this.MinimumRowAllowed;
    this.topLeftCornerCol = this.currentColumn - this.MinimumColumnAllowed;
}

function updateKernelPosition(kernel,horizontalDisplacement,verticalDisplacement){
    if( (kernel.currentColumn >= kernel.MaxiumColumnsAllowed) && (kernel.currentRow >= kernel.MaximumRowAllowed) ){
        return ;
    }


}





