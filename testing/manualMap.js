// Testing things live here

var upperLeft;
var upperLeftInner;
var lowerLeft;
var lowerLeftInner;
var upperRight;
var upperRightInner;
var lowerRight;
var lowerRightInner;

var testRoutePair;
var bestRoutePair;
var correctRoutePair;
var needsExchange;
var needsFlip;

// individually grabbable stops on test map
function setTestVariables() {
    upperLeft = points[0];
    upperLeftInner = points[1];
    lowerLeft = points[2];
    lowerLeftInner = points[3];
    upperRight = points[4];
    upperRightInner = points[5];
    lowerRight = points[6];
    lowerRightInner = points[7];

    // random route pair
    randomRoutePair = new routePair();
    //drawRoutePairLight(randomRoutePair);
    //logRoutePairs(randomRoutePair);

    // best route pair
    var bestA = [lowerLeftInner, lowerLeft, lowerRight, lowerRightInner];
    var bestB = [upperRightInner, upperRight, upperLeft, upperLeftInner];
    bestRoutePair = new routePair();
    bestRoutePair.routeAWithoutDepot = bestA;
    bestRoutePair.routeBWithoutDepot = bestB;
    bestRoutePair.addDepot();                // must call this manually if manually messing with arrays
    bestRoutePair.calcTotalDistance();
    //drawRoutePairLight(bestRoutePair);
    //logRoutePairs(bestRoutePair);
    
    // correct route pair
    var correctA = [upperLeftInner, upperLeft, lowerLeft, lowerLeftInner];
    var correctB = [upperRightInner, upperRight, lowerRight, lowerRightInner];
    correctRoutePair = new routePair();
    correctRoutePair.routeAWithoutDepot = correctA;
    correctRoutePair.routeBWithoutDepot = correctB;
    correctRoutePair.addDepot();                // must call this manually if manually messing with arrays
    correctRoutePair.calcTotalDistance();
    drawRoutePairLight(correctRoutePair);
    logRoutePairs(correctRoutePair);

    // needs exchange route pair
    var needsExchangeA = [upperLeftInner, upperRight, lowerLeft, lowerLeftInner];
    var needsExchangeB = [upperRightInner, upperLeft, lowerRight, lowerRightInner];
    needsExchange = new routePair();
    needsExchange.routeAWithoutDepot = needsExchangeA;
    needsExchange.routeBWithoutDepot = needsExchangeB;
    needsExchange.addDepot();                // must call this manually if manually messing with arrays
    needsExchange.calcTotalDistance();
    //drawRoutePairLight(needsExchange);
    //logRoutePairs(needsExchange);

    // needs flip route pair
    var needsFlipA = [upperLeft, upperLeftInner, lowerLeft, lowerLeftInner];
    var needsFlipB = [upperRightInner, upperRight, lowerRight, lowerRightInner];
    needsFlip = new routePair();
    needsFlip.routeAWithoutDepot = needsFlipA;
    needsFlip.routeBWithoutDepot = needsFlipB;
    needsFlip.addDepot();                // must call this manually if manually messing with arrays
    needsFlip.calcTotalDistance();
    //drawRoutePairLight(needsFlip);
    //logRoutePairs(needsFlip);
}

function runTest() {
    /*
    Put things in this to save typing
    */

    correctRoutePair = mutateExchange(correctRoutePair);
    drawRoutePairLight(correctRoutePair);
    logRoutePairs(correctRoutePair);
}

function drawBest() {
    /*
    Assesses the current population & draws the best route pair to date.
    */
   assessFitness();
   console.log('BEST OF PHENOTYPE: '+ floor(bestRoutePairToDate.totalDistance) + ', theoretical best 2730');
   drawRoutePairLight(bestRoutePairToDate);
}





