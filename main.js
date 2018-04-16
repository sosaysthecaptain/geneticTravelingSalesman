var points = [];
var depot = [];
var minX = -88.2;
var maxX = -87.6;
var minY = 41.7;
var maxY = 43.05;

var popSize = 500;
var routePopulation = [];
var mutationRate = 0.01;

var bestDistance = Infinity;
var bestRoutePairToDate;

var generation = 0;

var csv;

function preload() {
    csv = loadStrings("coords.csv");
    //processCSV();
    

    //console.log(csv[2].splitCSV());
}

function setup() {
  processCSV();
  createCanvas(600, 600);
}

function draw() {
  /*
  Main loop:
    - assessFitness()
      - calculates and sorts current populaton by fitness, finds best individual to date
    - renderRoutes()
      - draw the best route to date, as well as the best route of the batch, on the screen
    - nextGeneration()
      - culls the present generation to create the next one, more highly representing fitter phenotypes
      - performs crossover, adding to genetic diversity
      - introduces random mutations
  */

  background(0);

  assessFitness();
  renderRoutes();
  nextGeneration();
}






function calcDistance(points, order) {
  var sum = 0;
  for (var i = 0; i < order.length - 1; i++) {
    var cityAIndex = order[i];
    var cityA = points[cityAIndex];
    var cityBIndex = order[i + 1];
    var cityB = points[cityBIndex];
    var d = dist(cityA.x, cityA.y, cityB.x, cityB.y);
    sum += d;
  }
  return sum;
}


// *********
function drawPointArray(pointArray) {
  stroke(255);
  strokeWeight(1);
  noFill();
  beginShape();

  for(var i = 0; i < pointArray.length; i++) {
    var pointInstance = pointArray[i];
    //vertex(pointInstance.vector.x, pointInstance.vector.y);
    ellipse(pointInstance.vector.x, pointInstance.vector.y, 4, 4);

  }
    
  endShape();
}

function drawDepot() {
  stroke(255, 0, 0);
  strokeWeight(4);
  noFill();
  beginShape();
  ellipse(depot.vector.x, depot.vector.y, 4, 4);
  endShape();
}

function drawRoutePairLight(routePairInstance) {
  
  strokeWeight(1);
  noFill();
  beginShape();

  // draw route 1
  stroke(0, 255, 0);
  beginShape();
  for(var i = 0; i < routePairInstance.routeAWithDepot.length; i++) {
    var pointInstance = routePairInstance.routeAWithDepot[i];
    vertex(pointInstance.vector.x, pointInstance.vector.y);
  }
  endShape();

  // draw route 2
  stroke(0, 0, 255);
  beginShape();
  for(var i = 0; i < routePairInstance.routeBWithDepot.length; i++) {
    var pointInstance = routePairInstance.routeBWithDepot[i];
    vertex(pointInstance.vector.x, pointInstance.vector.y);
  }
  endShape();
}

function drawBestRoutePair() {
  let routePairInstance = bestRoutePairToDate;

  strokeWeight(4);
  noFill();
  beginShape();

  // draw route 1
  stroke(0, 255, 0);
  beginShape();
  for(var i = 0; i < routePairInstance.routeAWithDepot.length; i++) {
    var pointInstance = routePairInstance.routeAWithDepot[i];
    vertex(pointInstance.vector.x, pointInstance.vector.y);
  }
  endShape();

  // draw route 2
  stroke(0, 0, 255);
  beginShape();
  for(var i = 0; i < routePairInstance.routeBWithDepot.length; i++) {
    var pointInstance = routePairInstance.routeBWithDepot[i];
    vertex(pointInstance.vector.x, pointInstance.vector.y);
  }
  endShape();
}

function renderRoutes() {
  /*
  Main draw function, draws points, current best route pair, running best route pair, and the depot. Called once per generation.
  */

  // draw points
  drawPointArray(points);

  // draw current best route, found at the beginning of the sorted array
  drawRoutePairLight(routePopulation[0]);

  // draw running best route
  drawBestRoutePair();

  // draw depot last
  drawDepot()
}

