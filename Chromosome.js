class Chromosome {

    constructor({genes} = {}) {
        this.genes = this.mutateGenes(genes || this.createGenes());
        this.fitness = this.calculateFitness();
    }

    getFitness() {
        return this.fitness;
    }

    getGenes() {
        return this.genes;
    }

    mutateGenes(genes) {
        throw new Error('Must supply mutateGenes method');
    }

    mate(partner) {
        throw new Error('Must supply mate method');
    }

    createGenes() {
        throw new Error('Must supply createGenes method');
    }

    calculateFitness() {
        throw new Error('Must supply calculateFitness method');
    }
}

module.exports = Chromosome;
