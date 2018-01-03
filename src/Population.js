const _ = require('lodash');
const utilities = require('./utilities');

class Population {

    constructor(...args) {
        this.createProperties(...args);
        this.init(...args);
    }

    init({maximumSize, members}) {
        !members && this.fill();
        this.sortMembers();
    }

    createProperties({maximumSize, members}) {
        Object.defineProperty(
            this,
            '_maximumSize',
            {
                writable: false,
                value: maximumSize || _.size(members),
                enumerable: false
            }
        );

        Object.defineProperty(
            this,
            'members',
            {
                writable: true,
                value: members || [],
                enumerable: true
            }
        );

    }

    getCurrentSize() {
        return _.size(this.getMembers());
    }

    getMaximumSize() {
        return this._maximumSize;
    }

    getRefillThreshhold() {
        return this.getMaximumSize() / 3;
    }

    getMembers() {
        return this.members;
    }

    sortMembers() {
        this.members = _.sortBy(
            this.members,
            member => member.getFitness()
        );
        return this.getMembers();
    }

    getElitism() {
        return .2;
    }

    runGeneration() {
        this.kill();
        this.mate();
        this.fill();
        this.sortMembers();
        return this;
    }

    age(duration) {
        return _.reduce(
            _.range(0, duration),
            (population, idx) => {
                population.runGeneration();
                //console.log(idx, _.last(population.getMembers()));
                return population;
            },
            this
        );
    }

    addMember(member) {
        this.members = _.concat(this.getMembers(), member);
        return this.getMembers();
    }

    createChromosome() {
        throw new Error('Must supply createChromosome method');
    }

    fill() {
        while( this.getCurrentSize() < this.getMaximumSize()) {
            if (this.getCurrentSize() < this.getRefillThreshhold()) {
                this.addMember( this.createChromosome() )
            }
            else {
                this.addMember( this.mate());
            }

        }
    }

    kill() {
        const membersToKeep = Math.floor(this.getCurrentSize() * this.getElitism());
        this.members = _.slice(this.getMembers(), -membersToKeep);
        return this.getMembers();
    }

    mate() {
        const self = this;
        const mate1Index = utilities.getRandomInt(0, this.getCurrentSize());
        const mate2Index = (function findMate(previousIndex) {
            const nextIndex = utilities.getRandomInt(0, self.getCurrentSize());
            return previousIndex == nextIndex ? (
                findMate(nextIndex)
            ) : (
                nextIndex
            );
        })(mate1Index);

        const mate1 = _.get(this.getMembers(), mate1Index);
        const mate2 = _.get(this.getMembers(), mate2Index);

        return mate1.mate(mate2);
    }
}

module.exports = Population;
