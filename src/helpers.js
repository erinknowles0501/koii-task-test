const { GUESSER_TARGET_NUMBER } = require("../init");

function parentMap(parent) {
    console.log(
        "parent in parentmap",
        parent,
        typeof parent,
        parent.genes,
        parent.genes.left
    );

    parent.distance = Math.abs(
        parent.genes.left + parent.genes.right - GUESSER_TARGET_NUMBER
    );
    return parent;
}

function parentSort(parentA, parentB) {
    return parentA.distance > parentB.distance ? 1 : -1;
}

function pickParent(parents) {
    // parents are sorted by distance
    // Coin flip at each parent on whether to select it
    // loop around if run out of parents

    parents = parents.map(parentMap);
    console.log("parents in pickParent after map", parents);

    parents = parents.sort(parentSort);
    console.log("parents in pickParent after sort", parents);

    for (let i = 0; i < parents.length; i++) {
        if (Math.random() < 0.5) {
            return parents[i];
        }
        if (i + 1 == parents.length) {
            i = 0;
        }
    }
}

module.exports = {
    pickParent,
};
