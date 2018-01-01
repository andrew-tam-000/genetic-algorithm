const GeneticAlgorithmConstructor = require('geneticalgorithm');
const blueprint = require('./data.json');
const _ = require('lodash');
const utilities = require('./utilities');

const population = _.map(
    _.range(
        0, 100
    ),
    () => _.join(
        _.map(
            _.range( 0, _.size(blueprint) ),
            () => Math.round(Math.random())
        ),
        ''
    )
);

const SORTED_BLUEPRINT_LOOKUP = _(blueprint)
    .keys()
    .sort()
    .map( keyName => _.get(blueprint, keyName) )
    .value()
;


const MUTATION_RATE = 1;

const config = {
    mutationFunction,
    crossoverFunction,
    fitnessFunction,
    population,
    populationSize: 100
}

const baseInstance = GeneticAlgorithmConstructor( config );

_.forEach(
    _.range(0, 1),
    () => {

        const geneticInstance = baseInstance.clone();

        const evolvedPopulation = _.reduce(
            _.range(0, 900),
            population => geneticInstance.evolve(),
            geneticInstance
        );

        console.log(evolvedPopulation.best());
        console.log(evolvedPopulation.bestScore());
    }
)


function crossoverFunction(phenotypeA, phenotypeB) {
    return utilities.doStringMate(phenotypeA, phenotypeB);
}

function mutationFunction(phenotype) {

    const doMutation = Math.random() <=  MUTATION_RATE;

    if (doMutation) {
        const pivot = utilities.getRandomInt(0, phenotype.length);
        const mutatedValue = utilities.toNumber(!!!utilities.toNumber(phenotype.slice(pivot, pivot + 1)));
        return phenotype.slice(0, pivot) + mutatedValue + phenotype.slice(pivot + 1);
    }
    else {
        return phenotype;
    }
}

function fitnessFunction(phenotype) {
    const penalty = 50;
    const maxWeight = 1000;

    const { value: reducedValue, weight: reducedWeight } = _.reduce(
        _.split(phenotype, ''),
        (agg, val, idx) => {
            if (utilities.toNumber(val)) {

                const dataAtIndex = (
                    (SORTED_BLUEPRINT_LOOKUP || [])[idx]
                ) || {};

                const additionalWeight = utilities.toNumber(dataAtIndex['weight'])
                const additionalValue = utilities.toNumber(dataAtIndex['value']);

                agg.weight += additionalWeight;
                agg.value += additionalValue;

                return agg;

            }
            else {
                return agg;
            }
        },
        {
            value: 0,
            weight: 0
        }
    );

    const penaltyToDeduct = Math.max(reducedWeight - maxWeight, 0) * penalty;

    return reducedValue - penaltyToDeduct;
}
