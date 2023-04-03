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

const MAX_EXPRESSION = 100;

class Guesser {
    //#influencability = 0; // TODO: Play with what happens if this is also a gene! Could be cool

    constructor(parent = null) {
        this.id = makeID();
        if (parent) {
            this.genes = this.mutate(parent);
            this.parentID = parent.id;
        } else {
            this.genes = {
                left: Math.round(Math.random() * MAX_EXPRESSION),
                right: Math.round(Math.random() * MAX_EXPRESSION),
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

const MY_NUMBER = 53;
// Pick parent: given list of eligible parents, pick one to inherit from, weighted by how 'correct' they were.
let myParents = [
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
    new Guesser(),
].map(mapParent);

function mapParent(brain) {
    brain.distance = Math.abs(brain.genes.left + brain.genes.right - MY_NUMBER);
    return brain;
}

function sortParents(parents) {
    parents = parents.sort((parentA, parentB) => {
        return parentA.distance > parentB.distance ? 1 : -1;
    });
    return parents;
}
sortParents(myParents);

function pickParent(parents) {
    // parents are sorted by distance
    // Coin flip at each parent on whether to select it
    // loop around if run out of parents
    // once succeeds, kill the loop
    let parent;
    for (let i = 0; i < parents.length; i++) {
        if (Math.random() < 0.5) {
            parent = parents[i];
            break;
        }
        if (i + 1 == parents.length) {
            i = 0;
        }
    }

    return parent;
}

for (let i = 0; i < 20; i++) {
    const brain = new Guesser(pickParent(myParents));
    brain.distance = Math.abs(brain.genes.left + brain.genes.right - MY_NUMBER);
    myParents.push({ ...brain });
    sortParents(myParents);
    if (brain.distance == 0) {
        break;
    }
    if (i == 19) {
        i = 0;
    }
}
console.log("myParents", myParents);
console.log("tries: ", myParents.length);
