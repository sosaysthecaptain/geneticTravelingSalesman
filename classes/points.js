class point {
    /*
    Holds a point on the map. Takes GPS coordinates, and maps them to relative coordinates relevant to the screen.
    */
    constructor(pointName, pointAddress, pointX, pointY) {
        this.pointName = pointName;
        this.pointAddress = pointAddress;
        this.pointX = Number(pointX);
        this.pointY = Number(pointY);
        this.relX = 0;
        this.relY = 0;
        this.vector;

        //console.log('CREATING POINT FOR ' + pointName + ', pointX: ' + pointX + ', pointY: ' + pointY);

        if (this.pointX > maxX) {
            // console.log('  X value ' + this.pointX + ' is greater than maxX value ' + maxX);
            maxX = this.pointX;
            // console.log('    maxX reset to ' + maxX);
        } 
        if (this.pointX < minX) {
            // console.log('  X value ' + this.pointX + ' is less than minX value ' + minX);
            minX = this.pointX;
            // console.log('    minX reset to ' + minX);
        }

        if (this.pointY > maxY) {
            // console.log('  Y value ' + this.pointY + ' is greater than maxY value ' + maxY);
            maxY = this.pointY;
            // console.log('    maxY reset to ' + maxY);
        } 
        if (this.pointY < minY) {
            //console.log('  Y value ' + this.pointY + ' is less than minY value ' + minY);
            minY = this.pointY;
            //console.log('    minY reset to ' + minY);
        }

        // console.log('  minX: ' + minX + ', maxX: ' + maxX);
        // console.log('  minY: ' + minY + ', maxY: ' + maxY);

        this.setRelXY();
    }

    setRelXY() {
        /*
        Call this once all points are added and max/min values thus established.
        */

       // map function: first two are range of pointX, second two are range of desired output
       this.relX = map(this.pointX, minX, maxX, 20, 580);
       this.relY = map(this.pointY, minY, maxY, 580, 20);       // since 
       
       // create vector for map point
       this.vector = createVector(this.relX, this.relY);
    }

}