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
  var parentArrayA = parentBucketA.slice(0, popSize);
  var parentArrayB = parentBucketB.slice(0, popSize);

  console.log(parentArrayA);

  
  
}
  
//   function nextGeneration() {
//     var newPopulation = [];
//     for (var i = 0; i < population.length; i++) {
//       var orderA = pickOne(population, fitness);
//       var orderB = pickOne(population, fitness);
//       var order = pickOne(population, fitness);
//       var order = crossOver(orderA, orderB);
//       mutate(order, 0.01);
//       newPopulation[i] = order;
//     }
//     population = newPopulation;
  
//   }
  
//   function pickOne(list, prob) {
//     var index = 0;
//     var r = random(1);
  
//     while (r > 0) {
//       r = r - prob[index];
//       index++;
//     }
//     index--;
//     return list[index].slice();
//   }
  
//   function crossOver(orderA, orderB) {
//     var start = floor(random(orderA.length));
//     var end = floor(random(start + 1, orderA.length));
//     var neworder = orderA.slice(start, end);
//     // var left = totalCities - neworder.length;
//     for (var i = 0; i < orderB.length; i++) {
//       var city = orderB[i];
//       if (!neworder.includes(city)) {
//         neworder.push(city);
//       }
//     }
//     return neworder;
//   }
  
  
//   function mutate(order, mutationRate) {
//     for (var i = 0; i < totalCities; i++) {
//       if (random(1) < mutationRate) {
//         var indexA = floor(random(order.length));
//         var indexB = (indexA + 1) % totalCities;
//         swap(order, indexA, indexB);
//       }
//     }
//   }