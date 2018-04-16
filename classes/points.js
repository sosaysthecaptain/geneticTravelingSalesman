class point {
    /*
    Holds a point on the map. Takes GPS coordinates, and maps them to relative coordinates relevant to the screen.
    */
    constructor(pointName, pointAddress, pointX, pointY) {
        this.pointName = pointName;
        this.pointAddress = pointAddress;
        this.pointX = pointX;
        this.pointY = pointY;
        this.relX = 0;
        this.relY = 0;
        this.vector;

        // if (pointX > maxX) {
        //     maxX = pointX;
        // } else if (pointX < minX) {
        //     minX = pointX;
        // }

        // if (pointY > maxY) {
        //     maxY = pointY;
        // } 
        // if (pointY > minY) {
        //     minY = pointY;
        // }
    }

    setRelXY() {
        /*
        Call this once all points are added and max/min values thus established.
        */

       // map function: first two are range of pointX, second two are range of desired output
       this.relX = map(this.pointX, minX, maxX, 10, 590);
       this.relY = map(this.pointY, minY, maxY, 590, 10);
       
       // create vector for map point
       this.vector = createVector(this.relX, this.relY);
    }

}