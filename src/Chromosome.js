class Chromosome {

    constructor({genes} = {}) {
        this.setGenes(genes || this.createGenes());
        this.setGenes(this.mutateGenes());
        this.fitness = this.calculateFitness();
    }

    getFitness() {
        return this.fitness;
    }

    getGenes() {
        return this.genes;
    }

    setGenes(genes) {
        this.genes = genes;
        return this.getGenes();
    }

    // This method must explicitly call 'setGenes' to return
    // a mutated set of genes
    mutateGenes() {
        throw new Error('Must supply mutateGenes method');
    }

    // This method must return an array of Chromosome instances
    mate(partner) {
        throw new Error('Must supply mate method');
    }

    // Must return the data structure of the genes you are keeping
    createGenes() {
        throw new Error('Must supply createGenes method');
    }

    // Must return the fitness value that was calculated
    calculateFitness() {
        throw new Error('Must supply calculateFitness method');
    }
}

module.exports = Chromosome;
