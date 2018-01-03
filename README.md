# genetic-algorithm

Foundation of algorithms and patterns taken and modified from here:
http://burakkanber.com/blog/machine-learning-genetic-algorithms-in-javascript-part-2/#fiddle

But code has all been rewritten.

## Usage

This example solves the same knapsack problem that Burak Kanber has walked through in the above link.


```
const { Chromosome, Population } = require('genetic-algorithm-js');

class KnapsackChromosome extends Chromosome {

    mutateGenes(genes) {
        const doMutation = Math.random() <=  MUTATION_RATE;

        if (doMutation) {
            const pivot = utilities.getRandomInt(0, genes.length);
            const mutatedValue = utilities.toNumber(!!!utilities.toNumber(genes.slice(pivot, pivot + 1)));
            return genes.slice(0, pivot) + mutatedValue + genes.slice(pivot + 1);
        }
        else {
            return genes;
        }
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

new KnapsackPopulation({
    maximumSize: SIZE_OF_POPULATION,
})
    .age(AGE)
    .getMembers()

```
