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
let currentID = 0;
function makeID() {
    currentID++;
    return currentID;
}

const { GUESSER_GENE_MAX } = require("../init");

class Guesser {
    //#influencability = 0; // TODO: Play with what happens if this is also a gene! Could be cool

    constructor(parent = null) {
        console.log("parent in guesser", parent);

        this.id = makeID();
        if (parent) {
            console.log("parent is: ", parent);

            this.genes = this.mutate(parent);
            this.parentID = parent.id;
        } else {
            this.genes = {
                left: Math.round(Math.random() * GUESSER_GENE_MAX),
                right: Math.round(Math.random() * GUESSER_GENE_MAX),
            };
        }

        // this.#influencability = Math.round((Math.random() * 2 - 1) * 100) / 100; // gives random between (approximately) -0.99 and +0.99
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
            //return Math.random() / 5 - 0.1 + 1; // between (approximately) 1.1 and 0.99
            return Math.random() / 3 - 1 / 6 + 1; // between (approximately) 1.3 and 0.7
        }

        const genes = {
            left: Math.round(parent.genes.left * getMultiplicator()),
            right: Math.round(parent.genes.right * getMultiplicator()),
        };

        return genes;
    }
}

module.exports = Guesser;
