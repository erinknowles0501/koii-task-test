// const OPERATOR_FUNCTIONS = {
//     add: (a, b) => a + b,
//     subtract: (a, b) => a - b,
//     multiply: (a, b) => a * b,
//     divide: (a, b) => a / b,
// };
// #getOperation() {
//     const opFuncs = Object.keys(OPERATOR_FUNCTIONS);
//     const opFuncIndex = Math.floor(Math.random() * opFuncs.length);
//     return OPERATOR_FUNCTIONS[opFuncs[opFuncIndex]];
// }
// TODO: Operation is inherited and becomes a 'species' - species with unworkable operations die out.

const { makeID } = require("./helpers.js");
const {
    GUESSER_GENE_MAX,
    MAX_MUTATION_PERCENTAGE,
    GUESSER_TARGET_NUMBER,
    PARENT_PICK_PERCENTAGE,
} = require("./constants");

class Guesser {
    //#influencability = 0; // TODO: Play with what happens if this is also a gene! Could be cool

    constructor(parent = null) {
        this.id = makeID();
        if (parent) {
            this.genes = this.mutate(parent);
            this.parentID = parent.id;
        } else {
            this.genes = {
                left: Math.round(Math.random() * GUESSER_GENE_MAX),
                right: Math.round(Math.random() * GUESSER_GENE_MAX),
            };
        }
        this.distance = Math.abs(
            this.genes.left + this.genes.right - GUESSER_TARGET_NUMBER
        );
    }

    mutate(parent) {
        if (
            !parent ||
            !parent.genes ||
            parent.genes.left < 0 ||
            parent.genes.right < 0
        ) {
            throw new Error("Bad parent: " + parent);
        }

        function getMultiplicator() {
            // This function returns a number that is off from 1 by a random amount within the range specified by MAX_MUTATION_PERCENTAGE.
            const decimalPercent = MAX_MUTATION_PERCENTAGE / 100;
            const mutatedRandom = Math.random() * decimalPercent; //  Assuming MAX_MUTATION_PERCENTAGE is 20, this returns something between 0 and 0.2
            const adjustedMutatedRandom = 1 + mutatedRandom - decimalPercent; // This would return a random number between 0.8 and 1.2 - each 0.2 (20 percent) off from 1
            return adjustedMutatedRandom;
        }

        const genes = {
            left: Math.round(parent.genes.left * getMultiplicator()),
            right: Math.round(parent.genes.right * getMultiplicator()),
        };

        return genes;
    }

    static sortParents(parents) {
        return parents.sort((parentA, parentB) => {
            return parentA.distance > parentB.distance ? 1 : -1;
        });
    }

    static pickParent(parents) {
        // parents are sorted by distance
        // Coin flip at each parent on whether to select it
        // loop around if run out of parents

        parents = this.sortParents(parents);
        console.log("parents sorted", parents);

        for (let i = 0; i < parents.length; i++) {
            if (Math.random() < PARENT_PICK_PERCENTAGE / 100) {
                return parents[i];
            }
            if (i + 1 == parents.length) {
                i = 0;
            }
        }
    }
}

module.exports = Guesser;
