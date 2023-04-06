# Guesser Task

The aim of this task is to generate a 'Guesser' whose 'left' and 'right' genes add up to the target number.

Each round's task() is to create a new Guesser, whose genes are a slight mutation (no greater than the maximum mutation percentage defined in `src/constants`) of whichever parent it has picked - the closer the parent's genes are to adding up to the target number, the more likely it is to be picked to mutate from.

Each node's Guessers are then added to the list of parents (stored in levelDB) in the generateDistributionList() phase. Then, if one of the submitted Guesser's genes add up to the target number, it is saved in levelDB.

Before each round is executed, a check is made to see if that guesser exists. If it does, a success message is printed, with the winning Guesser's info, and no more executions are made.

## Editing the parameters

The target number, maximum mutation percentage, and maximum gene value are all defined in `/src/constants`.

## Testing

A test for the Guesser is defined in `/tests/Guesser.test.js`. A script to run all the defined tests is included in `package.json`.

## Simulation

You can _simulate_ the process of generating Guessers across nodes and rounds by running `/simulate/index.js` (a script for this is included in `package.json`.)

Note that this does not necessarily duplicate the logic included in `coreLogic.js`! It was written to assist with making sure the Guessers would eventually guess correctly, given the task's parameters, and also because it's fun to watch.
