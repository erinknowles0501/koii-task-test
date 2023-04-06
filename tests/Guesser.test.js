const test = require("node:test");
const assert = require("node:assert");
const Guesser = require("../src/Guesser.js");
const { MAX_MUTATION_PERCENTAGE } = require("../src/constants.js");

test("Guesser can be created", () => {
    const guesser = new Guesser();
    assert(guesser);
});

test("Guesser created from parent mutates inherited genes within MAX_MUTATION_PERCENTAGE", () => {
    const parent = new Guesser();
    const guesser = new Guesser(parent);

    const leftMutationDistance = Math.abs(
        guesser.genes.left - parent.genes.left
    );
    const leftGeneAverageValue = (guesser.genes.left + parent.genes.left) / 2;
    const leftMutationPercentage =
        (leftMutationDistance / leftGeneAverageValue) * 100;

    const rightMutationDistance = Math.abs(
        guesser.genes.right - parent.genes.right
    );
    const rightGeneAverageValue =
        (guesser.genes.right + parent.genes.right) / 2;
    const rightMutationPercentage =
        (rightMutationDistance / rightGeneAverageValue) * 100;

    console.log(
        "leftMutationPercentage, rightMutationPercentage",
        leftMutationPercentage,
        rightMutationPercentage,
        MAX_MUTATION_PERCENTAGE
    );

    assert(leftMutationPercentage <= MAX_MUTATION_PERCENTAGE);
    assert(rightMutationPercentage <= MAX_MUTATION_PERCENTAGE);
});

test("Guesser saves the id of its parent", () => {
    const parent = new Guesser();
    const guesser = new Guesser(parent);
    assert(guesser.parentID === parent.id);
});

test("Guesser.pickParent returns a parent from the list given", () => {
    const parents = [new Guesser(), new Guesser(), new Guesser()];
    const myParent = Guesser.pickParent(parents);

    assert(parents.find((parent) => parent.id === myParent.id));
});

test("Guesser.sortParents sorts parents by distance", () => {
    const guesser1 = new Guesser();
    const guesser2 = new Guesser();
    const guesser3 = new Guesser();

    guesser1.distance = 3;
    guesser2.distance = 1;
    guesser3.distance = 2;

    const parents = Guesser.sortParents([guesser1, guesser2, guesser3]);
    assert(parents[0].id === guesser2.id);
    assert(parents[1].id === guesser3.id);
    assert(parents[2].id === guesser1.id);
});
