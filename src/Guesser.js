const { makeID } = require("./helpers.js");
const {
    GUESSER_GENE_MAX,
    MAX_MUTATION_PERCENTAGE,
    GUESSER_TARGET_NUMBER,
    PARENT_PICK_PERCENTAGE,
} = require("./constants");

class Guesser {
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

        function getMutation(gene) {
            // Computes a maximum and minimum gene value based on the max mutation percentage
            const max = Math.floor(gene * (1 + MAX_MUTATION_PERCENTAGE / 100));
            const min = Math.ceil(gene * (1 - MAX_MUTATION_PERCENTAGE / 100));
            const range = (max - min + 1);
            return Math.floor(Math.random() * range) + min; // Get random number in that range, bump it up to at least the minimum value, and clamp it so it doesn't exceed the max
        }

        const genes = {
            left: getMutation(parent.genes.left),
            right: getMutation(parent.genes.right),
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
