This is a genetic algorithm implementation of the traveling salesman problem. The CSV file is loaded and parsed into instances of the points class, which store location data on the vending machines, both in terms of GPS coordinates and relative coordinates relevant to the browser.

The CSV parsing file also instantiates a population of phenotypes of the routePair class. The routePair class holds a pair of routes, which can be mutated and recombined before having the depot appended to their beginning and end. routePair contains a method to calculate its total route length.

Upon completion of setup, the program enters a loop, contained in the draw() function. In each generation, three main functions are run:
    - assessFitness()
      - calculates and sorts current populaton by fitness, finds best individual route pair to date
    - renderRoutes()
      - draw the best route to date, as well as the best route of the current population, on the screen
    - nextGeneration()
      - culls the present generation to create the next one, more highly representing fitter phenotypes
      - performs crossover, adding to genetic diversity
      - introduces random mutations, both swapping pairs of points within each route, and swapping points between routes

With enough generations, this process eventually produces a pair of reasonably optimal routes. 

***********

Assumptions:
    - this model completely fails to take real world routing/traffic conditions into account, and is therefore an idealization
    - much less significantly, it assumes Chicago is perfectly planar

How to execute:
    - dump everything in a folder, open index.html in a browser. The CSV will automatically load. After a somewhat arbitrary number of cycles, the output will be logged to the terminal.