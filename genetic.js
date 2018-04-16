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

    if(routePopulation[i].totalDistance < bestDistance) {
      bestDistance = routePopulation[i].totalDistance;
      bestRoutePairToDate = routePopulation[i];
      console.log('GEN ' + generation + ', NEW BEST DISTANCE: ' + floor(bestDistance));
    }
  }

  // sort route population by fitness
  routePopulation.sort(function(a,b) {
    if (a.totalDistance > b.totalDistance) {
        return 1;
    } else {
        return -1;
    }
  });

  // calculate normalizedFitness for each
  for (var i = 0; i < routePopulation.length; i++) {
    routePopulation[i].normalizedFitness = routePopulation[i].fitness / fitnessSum;
  }
}

function nextGeneration() {
  /*
  Creates the next generation, through selection, recombination, and mutation:
    - creates two arrays of parent phenotypes for the crossover process. Does this by throwing each phenotype into a bucket a number of times according to its fitness score, shuffling the buckets, and then pulling out the requisite number.
    - recombines the two parent arrays, using a crossover method. This takes an arbitrary piece of the first route, and adds non-redundant pieces of the second route to it to fill it up.
    - introduces random mutations, point swaps both within and across routes
  */
  generation += 1;

  // select parentPopulationA and parentPopulationB
  var parentBucketA = [];
  var parentBucketB = [];

  for (var i = 0; i < routePopulation.length; i++) {
    var candidate = routePopulation[i];

    // insert each item into parentBuckets a number of times specified by fitness score
    for (var j = 0; j < candidate.fitness; j++) {
      parentBucketA.push(candidate);
      parentBucketB.push(candidate);
    }
  }

  // shuffle parentBuckets
  parentBucketA = shuffle(parentBucketA);
  parentBucketB = shuffle(parentBucketB);

  // create parentArrays
  var parentArrayA = parentBucketA.slice(0, popSize - 50);
  var parentArrayB = parentBucketB.slice(0, popSize - 50);

  // add best to date a number of times, to give it a good shot at recombination
  for (var i = 0; i < 45; i++) {
    parentArrayA.push(bestRoutePairToDate);
    parentArrayB.push(bestRoutePairToDate);
  }

  // SKIPPING CROSSOVER FOR NOW
  routePopulation = parentArrayA;


  // crossover. What a mess...
  // perform crossover on each pair of parents, assign result to routePopulation
  // routePopulation = [];
  // for (var i = 0; i < parentArrayA.length; i++) {
  //   var parentA = parentArrayA[i];
  //   var parentB = parentArrayB[i];
  //   // which route, a or b?
  //   if (floor(random(1) > 0.5)) {
  //     // routeA
  //     let newRouteA = crossOver(parentA.routeAWithoutDepot, parentB.routeAWithoutDepot);
  //     parentA.routeAWithoutDepot = newRouteA;
  //     parentA.addDepot();
  //     routePopulation.push(parentA);
  //   } else {
  //     // routeB
  //     let newRouteB = crossOver(parentA.routeBWithoutDepot, parentB.routeBWithoutDepot);
  //     parentA.routeBWithoutDepot = newRouteB;
  //     parentA.addDepot();
  //     routePopulation.push(parentA);
  //   }

    
  //   let result = crossOver(parentArrayA[i], parentArrayB[i]);
  //   routePopulation.push(result);
  // }

  

    // mutate. Apply it to each route array in the population
    for(var i = 0; i < routePopulation.length; i++) {
      routePopulation[i].routeAWithoutDepot = mutate(routePopulation[i].routeAWithoutDepot);
      routePopulation[i].routeBWithoutDepot = mutate(routePopulation[i].routeBWithoutDepot);
    }

  // include unmodified running best array, for good measure
  routePopulation.push(bestRoutePairToDate);
}
  
function crossOver(arrayA, arrayB) {
  var start = floor(random(arrayA.length));
  var end = floor(random(start + 1, arrayA.length));
  var newArray = arrayA[start, end];
  for (var i = 0; i < arrayB.length; i++) {
    var item = arrayB[i];
    if (!newArray.includes(item)) {
      newArray.push(item);
    }
  }
  return newArray;
}
  
  
function mutate(array) {
  if (random(1) < mutationRate) {
    var indexA = floor(random(array.length));
    var indexB = (indexA + 1) % array.length;
    var returnArray = swap(array, indexA, indexB);
    return returnArray;
  }

}

function swap(array, i, j) {
  var temp = array[i];
  array[i] = array[j];
  array[j] = temp;
  return array;
}

// function crossOver(parentA, parentB) {
//   // determine whether crossover will occur within or between routes
//   var newRoutePair = parentA;
  
//   if (floor(random(1) > 0.5)) {
//     // routeA
//     var routeLength = parentA.routeAWithoutDepot.length;
//     var start = floor(random(routeLength));
//     var end = floor(random(start + 1, routeLength));
//     var newOrder = parentA.routeAWithoutDepot.slice(start, end);

//     while(newOrder.length < routeLength) {
//       console.log('while loop. newOrder.length: ' + newOrder.length);       // REMOVE
//       // while not long enough, step through parent until you find an item not in the array
//       let item = parentB.routeAWithoutDepot.shift();
//       if (!newOrder.includes(item)) {
//         newOrder.push(item);
//       }
      
//     }
//     newRoutePair.routeAWithoutDepot = newOrder;
//   } else {
//     // routeB
//     // var routeLength = parentB.routeBWithoutDepot.length;
//     // var start = floor(random(routeLength));
//     // var end = floor(random(start + 1, routeLength));
//     // var newOrder = parentA.routeBWithoutDepot.slice(start, end);

//     // while(newOrder.length < routeLength) {
//     //   // while not long enough, step through parent until you find an item not in the array
//     //   for (var i = 0; i < routeLength; i++) {
//     //     let item = parentB.routeBWithoutDepot[i];
//     //     if (!newOrder.includes(item)) {
//     //       newOrder.push(item);
//     //     }
//     //   }
//     // }
//     // newRoutePair.routeBWithoutDepot = newOrder;
//   }
//   //console.log(newRoutePair);
//   //console.log('    final length: ' + newOrder.length);
//   return newRoutePair;

//   // var start = floor(random(parentArrayA.length));
//   // var end = floor(random(start + 1, parentArrayB.length));
//   // var neworder = parentArrayB.slice(start, end);
//   // // var left = totalCities - neworder.length;
//   // for (var i = 0; i < parentArrayB.length; i++) {
//   //   var city = parentArrayB[i];
//   //   if (!neworder.includes(city)) {
//   //     neworder.push(city);
//   //   }
//   // }
//   // return neworder;
// }
