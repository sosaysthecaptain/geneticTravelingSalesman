function assessFitness() {
  /*
  Calculates distance, fitness, and normalizedFitness of current generation, sorts routePopulation, and sets best.
  */

  // calcTotalDistance, fitness on everybody. If record distance, set.
  var fitnessSum = 0;
  for (var i = 0; i < routePopulation.length; i++) {
    routePopulation[i].calcTotalDistance()
    routePopulation[i].fitness = (1 / routePopulation[i].totalDistance) * 10000;
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