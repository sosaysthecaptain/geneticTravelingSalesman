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

    // if(routePopulation[i].totalDistance < bestDistance) {
    //   bestDistance = routePopulation[i].totalDistance;
    //   bestRoutePairToDate = routePopulation[i];
    //   console.log('NEW BEST DISTANCE: ' + floor(bestDistance));
    // }
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
    bestDistance = Number(routePopulation[0].totalDistance);
    bestRoutePairToDate = routePopulation[0];

    // hopefully we can get rid of these
    bestRouteAToDate = routePopulation[0].routeAWithoutDepot.slice();
    bestRouteBToDate = routePopulation[0].routeBWithoutDepot.slice();
    
    //console.log('    NEW BEST DISTANCE: ' + floor(bestDistance));
  }

  // calculate normalizedFitness for each
  for (var i = 0; i < routePopulation.length; i++) {
    routePopulation[i].normalizedFitness = routePopulation[i].fitness / fitnessSum;
  }
}


// *******************************************
// New functions below here

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
  var oldBestPair = bestRoutePairToDate;
  var oldBestRouteA = bestRouteAToDate;
  var oldBestRouteB = bestRouteBToDate;

  // 1) Culling/new population creation

  // 2) Recombination

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
  
  // console.log('  oldBestDistance: ' + oldBestDistance)
  // console.log('  oldBestPair: ' + oldBestPair.totalDistance)
  // console.log('  bestDistance: ' + bestDistance)
  // console.log('  bestRoutePairToDate: ' + bestRoutePairToDate.totalDistance)

  // if (oldBestPair.totalDistance < bestRoutePairToDate) {
  //   console.log('    ERROR IN bestRoutePairToDate');
  // }

  // solving a weird bug...
  if (oldBestDistance < bestDistance) {
    bestDistance = oldBestDistance;
  }
  
  console.log('Generation ' + generation + '. Running best: ' + floor(bestDistance));
}

function mutateRouteA(routePairInstance) {
  /*
  Swaps order of two random points in route A, according to mutation rate
  */
  if (floor(random(1)) < flipMutationRate) {
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
  if (floor(random(1)) < flipMutationRate) {
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
  if (floor(random(1)) < exchangeMutationRate) {
    var start = floor(random(routePairInstance.routeAWithoutDepot.length));
    var end = floor(random(routePairInstance.routeBWithoutDepot.length));
    var temp = routePairInstance.routeAWithoutDepot[start];         // from A, to B
    routePairInstance.routeAWithoutDepot[start] = routePairInstance.routeBWithoutDepot[end];  // from B, to A
    routePairInstance.routeBWithoutDepot[end] = temp;               // from A, to B
  }
  return routePairInstance;
}