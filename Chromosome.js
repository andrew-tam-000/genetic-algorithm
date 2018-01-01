const utilities = require('./utilities');
const _ = require('lodash');

function _geneData(blueprint) {
    return _(blueprint)
        .keys()
        .sort()
        .map( keyName => _.get(blueprint, keyName) )
        .value()
    ;
}

const memoizedGeneData = _.memoize(_geneData);

class Chromosome {

    constructor(...args) {
        this.createProperties(...args);
    }

    createProperties({blueprint, genes, mutationRate}) {

        this._mutationRate =  mutationRate || .5,
        this._blueprint = blueprint;
        this._numberOfGenes = this.calculateNumberOfGenes();
        this._genes = this.mutateGenes(genes || this.createGenes(this.getNumberOfGenes()));

        // Translates to value + weight
        const score = this.calculateScore() || {};

        _.map(
            _.keys(score),
            key =>  this[key] = score[key]
        );
    }

    getMutationRate() {
        return this._mutationRate;
    }

    getBlueprint() {
        return this._blueprint;
    }

    getScore() {
        return this.score;
    }

    mutateGenes(genes) {
        const doMutation = Math.random() <=  this.getMutationRate();

        if (doMutation) {
            const pivot = utilities.getRandomInt(0, genes.length);
            const mutatedValue = utilities.toNumber(!!!utilities.toNumber(genes.slice(pivot, pivot + 1)));
            return genes.slice(0, pivot) + mutatedValue + genes.slice(pivot + 1);
        }
        else {
            return genes;
        }
    }

    calculateNumberOfGenes() {
        return _.size(this.getBlueprint());
    }

    getNumberOfGenes() {
        return this._numberOfGenes;
    }

    getGenes() {
        return this._genes;
    }

    mate(partner) {
        return _.map(
            utilities.doStringMate(this.getGenes(), partner.getGenes()),
            genes => new Chromosome({blueprint: this.getBlueprint(), genes, mutationRate: this.getMutationRate()})
        )
    }

    createGenes(numberOfGenes) {
        return createGenes(numberOfGenes);
    }

    calculateScore() {

        const dataForGene = memoizedGeneData(this.getBlueprint());

        const penalty = 50;
        const maxWeight = 1000;

        const { value: reducedValue, weight: reducedWeight } = _.reduce(
            _.split(this.getGenes(), ''),
            (agg, val, idx) => {
                if (utilities.toNumber(val)) {

                    const dataAtIndex = (
                        (dataForGene || [])[idx]
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

        return {
            score: reducedValue - penaltyToDeduct,
            value: reducedValue,
            weight: reducedWeight
        }

    }
}

function createGenes(numberOfGenes) {
    return _(_.range(0, numberOfGenes - 1))
        .map( val => utilities.getRandomInt(0, 2) )
        .join('')
    ;
}

module.exports = Chromosome;
