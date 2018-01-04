const blueprint = require('../data.json');
const _ = require('lodash');
const util = require('util');
const { Chromosome, Population } = require('../src/index');
const utilities = require('../src/utilities');

const NUM_POPULATIONS = 1;
const SIZE_OF_POPULATION = 100;
const AGE = 500;

// Mutating everytime yields the best result
const MUTATION_RATE = 1;

const NUM_GENES = _.size(blueprint);

const SORTED_BLUEPRINT_LOOKUP = _(blueprint)
    .keys()
    .sort()
    .map( keyName => _.get(blueprint, keyName) )
    .value()
;

class KnapsackChromosome extends Chromosome {

    mutateGenes() {
        const genes = this.getGenes();
        const doMutation = Math.random() <=  MUTATION_RATE;

        if (doMutation) {
            const pivot = utilities.getRandomInt(0, genes.length);
            const mutatedValue = utilities.toNumber(!!!utilities.toNumber(genes.slice(pivot, pivot + 1)));
            return genes.slice(0, pivot) + mutatedValue + genes.slice(pivot + 1);
        }

        return genes;
    }

    createGenes() {
        return _.join(
            _.map(
                _.range( 0, _.size(blueprint) ),
                () => Math.round(Math.random())
            ),
            ''
        );
    }

    calculateFitness() {
        const genes = this.getGenes();

        const penalty = 50;
        const maxWeight = 1000;

        const { value: reducedValue, weight: reducedWeight } = _.reduce(
            genes.split(''),
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

    mate(partner) {
        return _.map(
            utilities.doStringMate(this.getGenes(), partner.getGenes()),
            genes => new KnapsackChromosome({genes})
        )
    }
}

class KnapsackPopulation extends Population {
    createChromosome() {
        return new KnapsackChromosome();
    }
};

_.forEach(
    _.range(0, 1),
    () => {
        console.log(
            _.last(
                new KnapsackPopulation({
                    maximumSize: SIZE_OF_POPULATION,
                })
                    .age(AGE)
                    .getMembers()
            )
        )
    }
)
