class routePair {
    /*
    Instance of a route pair, the basic organism of this genetic algorithm. 
    */
    constructor() {
        this.totalDistance = 0;
        this.fitness = 0;
        this.normalizedFitness = 0;

        this.routeAWithoutDepot = [];
        this.routeBWithoutDepot = [];

        this.routeAWithDepot = [];
        this.routeBWithDepot = [];

        this.totalDistanceA = 0;
        this.totalDistanceB = 0;

        this.index = routePairIndex;
        routePairIndex += 1;

        // make a copy of the points array, shuffle it
        let pointsShuffled = shuffle(points);

        // split the total points array between the two routes
        for(var i = 0; i < pointsShuffled.length; i++) {
            if (i % 2 == 0) {
                this.routeAWithoutDepot.push(pointsShuffled[i]);
            } else {
                this.routeBWithoutDepot.push(pointsShuffled[i]);
            }
        }

        // generate withDepot lists. Will have to be done again whenever routes are modified.
        this.addDepot();
    }

    addDepot() {
        this.routeAWithDepot = [];
        this.routeBWithDepot = [];

        this.routeAWithDepot.push(depot);
        this.routeBWithDepot.push(depot);

        for(var i = 0; i < this.routeAWithoutDepot.length; i++) {
            this.routeAWithDepot.push(this.routeAWithoutDepot[i]);
        }

        for(var i = 0; i < this.routeBWithoutDepot.length; i++) {
            this.routeBWithDepot.push(this.routeBWithoutDepot[i]);
        }

        this.routeAWithDepot.push(depot);
        this.routeBWithDepot.push(depot);
    }

    calcTotalDistance() {
        this.addDepot()
        this.totalDistance = 0;
        this.totalDistanceA = 0;
        this.totalDistanceB = 0;

        // sum routeAWithDepot
        for (var i = 0; i < this.routeAWithDepot.length - 1; i++) {
            let pointAtIndex = this.routeAWithDepot[i];
            let nextPoint = this.routeAWithDepot[i+1];

            let distance = dist(pointAtIndex.relX, pointAtIndex.relY, nextPoint.relX, nextPoint.relY);

            this.totalDistanceA += distance;
        }

        // sum routeBWithDepot
        for (var i = 0; i < this.routeBWithDepot.length - 1; i++) {
            let pointAtIndex = this.routeBWithDepot[i];
            let nextPoint = this.routeBWithDepot[i+1];

            let distance = dist(pointAtIndex.relX, pointAtIndex.relY, nextPoint.relX, nextPoint.relY);

            this.totalDistanceB += distance;
        }

        this.totalDistance = this.totalDistanceA + this.totalDistanceB;
    }
}