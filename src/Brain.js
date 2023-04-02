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

const MAX_EXPRESSION = 100;

class Brain {
    //#influencability = 0; // TODO: Play with what happens if this is also a gene! Could be cool

    constructor() {
        this.genes = {
            left: Math.round(Math.random() * MAX_EXPRESSION),
            right: Math.round(Math.random() * MAX_EXPRESSION),
        };
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
            return Math.random() / 5 - 0.1 + 1; // between 1.1 and 0.99
        }

        const genes = {
            left: Math.round(parent.genes.left * getMultiplicator()),
            right: Math.round(parent.genes.right * getMultiplicator()),
        };

        this.genes = genes;
        return genes;
    }
}

const MY_NUMBER = 53;
// Pick parent: given list of eligible parents, pick one to inherit from, weighted by how 'correct' they were.
let myParents = [
    new Brain(),
    new Brain(),
    new Brain(),
    new Brain(),
    new Brain(),
].map((brain) => {
    brain.distance = Math.abs(brain.genes.left + brain.genes.right - MY_NUMBER);
    return brain;
});

function sortParents(parents) {
    parents = parents.sort((parentA, parentB) => {
        return parentA.distance > parentB.distance ? 1 : -1;
    });
    return parents;
}
sortParents(myParents);

function pickParent(parents) {
    // parents are sorted by distance
    // chance of selecting a parent is logarithmic
    // first parent option: 50% chance of selecting as parent
    // if that fails, move to second parent (25% chance), etc
    // once succeeds, kill the loop
    let parent;
    for (let i = 0; i < parents.length; i++) {
        if (Math.random() < 1 / (2 * (i + 1))) {
            parent = parents[i];
            break;
        }
        if (i + 1 == parents.length) {
            i = 0;
        }
    }

    return parent;
}

const brain = new Brain();
console.log(brain);

console.log(brain.mutate(pickParent(myParents)));
myParents.push({
    ...brain,
    baby: true,
    distance: Math.abs(brain.genes.left + brain.genes.right - MY_NUMBER),
});
sortParents(myParents);
console.log("parents", myParents);
