function runGeneration() {
  /*
  Performs a complete generation. Steps:
    1) Culling/new population creation
    2) Recombination
    3) Mutation
    4) Fitness assessment
    5) Rendering
  */
  var oldBestDistance = bestDistance;

  // 1) Culling/new population creation
  createNewGeneration();

  // 2) Recombination
  recombinePopulation();

  // 3) Mutation
  for (var i = 0; i < routePopulation.length; i++) {
    routePopulation[i] = mutateRouteA(routePopulation[i]);
    routePopulation[i] = mutateRouteB(routePopulation[i]);
    routePopulation[i] = mutateExchange(routePopulation[i]);
  }

  // 4) Assess fitness
  assessFitness();

  // 5) Render best route pair to date (skipping rendering the best of the batch)
  drawRoutePairLight(bestRoutePairToDate);

  // Increment generation & report
  generation += 1;
  
  console.log('Generation ' + generation + '. Running best: ' + floor(bestDistance) + ', avg fitness: ' + getAverageFitness());

}

function assessFitness() {
  /*
  Calculates distance, fitness, and normalizedFitness of current generation, sorts routePopulation, and sets best.
  */

  // calcTotalDistance, fitness on everybody. If record distance, set.
  var fitnessSum = 0;
  for (var i = 0; i < routePopulation.length; i++) {
    routePopulation[i].calcTotalDistance()
    routePopulation[i].fitness = floor((1 / routePopulation[i].totalDistance) * 100000);
    fitnessSum += routePopulation[i].fitness
  }

  // sort route population by fitness
  routePopulation.sort(function(a,b) {
    if (a.totalDistance > b.totalDistance) {
        return 1;
    } else {
        return -1;
    }
  });

  // if best of this batch is the best yet, set it
  if (routePopulation[0].totalDistance < bestDistance) {
    console.log('NEW BEST FOUND: ' + floor(routePopulation[0].totalDistance));

    bestDistance = Number(routePopulation[0].totalDistance);
    bestRoutePairToDate = Object.assign({}, routePopulation[0]);
  }

  // calculate normalizedFitness for each
  for (var i = 0; i < routePopulation.length; i++) {
    routePopulation[i].normalizedFitness = routePopulation[i].fitness / fitnessSum;
  }
}



function mutateRouteA(routePairInstance) {
  /*
  Swaps order of two random points in route A, according to mutation rate
  */
  if (random(1) < flipMutationRate) {
    //console.log('mutateRouteA firing');
    var start = floor(random(routePairInstance.routeAWithoutDepot.length));
    var end = floor(random(routePairInstance.routeAWithoutDepot.length));
    var temp = routePairInstance.routeAWithoutDepot[start];
    routePairInstance.routeAWithoutDepot[start] = routePairInstance.routeAWithoutDepot[end];
    routePairInstance.routeAWithoutDepot[end] = temp;
  }
  return routePairInstance;
}

function mutateRouteB(routePairInstance) {
  /*
  Swaps order of two random points in route B, according to mutation rate
  */
  if (random(1) < flipMutationRate) {
    //console.log('mutateRouteB firing');
    var start = floor(random(routePairInstance.routeBWithoutDepot.length));
    var end = floor(random(routePairInstance.routeBWithoutDepot.length));
    var temp = routePairInstance.routeBWithoutDepot[start];
    routePairInstance.routeBWithoutDepot[start] = routePairInstance.routeBWithoutDepot[end];
    routePairInstance.routeBWithoutDepot[end] = temp;
  }
  return routePairInstance;
}

function mutateExchange(routePairInstance) {
  /*
  Swaps a randomly selected point between routeA and routeB
  */
  if (random(1) < exchangeMutationRate) {
    //console.log('mutateExchange firing');
    var start = floor(random(routePairInstance.routeAWithoutDepot.length));
    var end = floor(random(routePairInstance.routeBWithoutDepot.length));
    var temp = routePairInstance.routeAWithoutDepot[start];         // from A, to B
    routePairInstance.routeAWithoutDepot[start] = routePairInstance.routeBWithoutDepot[end];  // from B, to A
    routePairInstance.routeBWithoutDepot[end] = temp;               // from A, to B
  }
  return routePairInstance;
}

function createNewGeneration() {
  /*
  Generates an array of enriched fitness on the basis of the current routePopulation array. Does this by putting each routePair into a bucket a certain number of times, according to its fitness score, shuffling the bucket, and then withdrawing the requisite number.

  Output can be used directly, or array can be shuffled and recombined with itself.
  */

  // debug: log initial averageFitness
  //console.log('Initial average fitness: ' + getAverageFitness());

  // iterate through routePopulation, add items to bucket fitness times
  var length = routePopulation.length;
  var parentBucket = [];
  for (var i = 0; i < routePopulation.length; i++) {
    for (var j = 0; j < routePopulation[i].fitness; j++) {
      parentBucket.push(routePopulation[j]);
    }
  }

  // shuffle the bucket
  parentBucket = shuffle(parentBucket);

  // take the requisite number, put them back in routePopulation
  routePopulation = parentBucket.splice(0, length)
  //console.log(routePopulation);

  // log final average fitness
  //console.log('Final average fitness: ' + getAverageFitness());
}

function recombinePopulation() {
  /*
  Recombines the entire population, creating two shuffled versions of routePopulation and using them as parents. Calls the recombine() method with two routePair instances. That method, in turn, uses the crossOver() method.
  */

  let parentA = shuffle(routePopulation);
  let parentB = shuffle(routePopulation);

  for (var i = 0; i < parentA.length; i++) {
    routePopulation[i] = recombine(parentA[i], parentB[i]);

  }


}

function recombine(parentA, parentB) {
  /*
  Recombines two routePair objects, using the crossOver method. This it does by:
    - joining the two route arrays,
    - choosing a random chunk of the first, and
    - filling in the remaining space with non-redundant items from the second
  */


    // collect parent arrays, stitch together A and B
  let parentARouteA = parentA.routeAWithoutDepot;
  let parentARouteB = parentA.routeBWithoutDepot;
  let routeALength = parentARouteA.length;
  
  let parentACombined = parentARouteA.concat(parentARouteB);

  //console.log('parentACombined: ' + getPointIndexArray(parentACombined));

  let parentBRouteA = parentB.routeAWithoutDepot;
  let parentBRouteB = parentB.routeBWithoutDepot;
  
  let parentBCombined = parentBRouteA.concat(parentBRouteB);

  //console.log('parentBCombined: ' + getPointIndexArray(parentBCombined));

  // recombine these
  let recombinedArray = crossOver(parentACombined, parentBCombined);
  //console.log('recombinedArray: ' + getPointIndexArray(recombinedArray));

  // split recombined list into two
  let resultA = recombinedArray.splice(0, routeALength);
  let resultB = recombinedArray.splice(0);

  // assign these to child
  let child = parentA;
  child.routeAWithoutDepot = resultA;
  child.routeBWithoutDepot = resultB;

  // run setDepot() and calcTotalDistance() methods
  child.addDepot()
  child.calcTotalDistance();
  
  // debug
  //console.log('final result, routeA: '+ getPointIndexArray(child.routeAWithDepot));
  //console.log('final result, routeB: '+ getPointIndexArray(child.routeBWithDepot));

  return child;
  }

function crossOver(arrayA, arrayB) {
  /*
  Takes two arrays containing different permutations of the same set of constituents, and recombines them. Takes a random chunk of one, fills in the remaining space with non-redundant items from the other.
  */
  var start = floor(random(arrayA.length));
  var end = floor(random(start + 1, arrayA.length));
  var returnArray = arrayA.slice(start, end);
  // var left = totalCities - neworder.length;
  for (var i = 0; i < arrayB.length; i++) {
    var item = arrayB[i];
     if (!returnArray.includes(item)) {
      returnArray.push(item);
     }
  }
  return returnArray;
}

// **********************************************
// minor helper/utility functions



function getAverageFitness() {
  /*
  Returns average fitnessScore of the present generation.
  */
  var fitnessSum = 0;
  for(var i = 0; i < routePopulation.length; i++) {
    fitnessSum += routePopulation[i].fitness;
  }
  return (fitnessSum / routePopulation.length);
}

function getRoutePairIndexArray(routePairArray) {
  /*
  Debug method. Returns array of routePair indexes for routePair array
  */

  let returnArray = [];
  for (var i = 0; i < routePairArray.length; i++) {
    returnArray.push(routePairArray[i].index);
  }
  return returnArray;
}

function getPointIndexArray(pointArray) {
  /*
  Debug method. Returns array of point indexes for point array (route)
  */
  let returnArray = [];
  for (var i = 0; i < pointArray.length; i++) {
    returnArray.push(pointArray[i].index);
  }
  return returnArray;
}

function compareRoutePairs(routePairA, routePairB) {
  /*
  Debug function. Compares two routePairs side by side.
  */
  console.log('routePairA, routeA: ' + getPointIndexArray(routePairA.routeAWithDepot));
  console.log('routePairA, routeB: ' + getPointIndexArray(routePairA.routeBWithDepot));
  console.log('routePairB, routeA: ' + getPointIndexArray(routePairB.routeAWithDepot));
  console.log('routePairB, routeB: ' + getPointIndexArray(routePairB.routeBWithDepot));
}

function testRecombine(parentA, parentB) {
  /*
  Used for testing the recombine function. Takes two parent routePairs, recombines them, compares the two, draws & returns the child.
  */

  let child = recombine(parentA, parentB);
  console.log('PARENTA VS PARENTB:');
  compareRoutePairs(parentA, child);
  console.log('PARENTA VS CHILD:');
  compareRoutePairs(parentB, child);

  drawRoutePairLight(child);
  return child;
}

