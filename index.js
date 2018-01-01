const blueprint = require('./data.json');
const _ = require('lodash');
const util = require('util');
const Population = require('./Population');
const utilities = require('./utilities');

const NUM_POPULATIONS = 1;
const SIZE_OF_POPULATION = 100;
const AGE = 500;

// Mutating everytime yields the best result
const MUTATION_RATE = 1;

console.log(
    _.last(
        new Population({
            maximumSize: SIZE_OF_POPULATION,
            blueprint,
            chromosomeConfig: {
                mutationRate: MUTATION_RATE
            }
        })
            .age(AGE)
            .getMembers()
    )
)
