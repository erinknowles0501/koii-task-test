// Both of these numbers have to be positive integers
const GUESSER_GENE_MAX = 100; // Guesser has two genes, 'right' and 'left', which are added to guess at the target number. This var is the max number that right and left can each be.
const GUESSER_TARGET_NUMBER = 60; // The number that the Guesser is trying to get to.

if (GUESSER_TARGET_NUMBER > GUESSER_GENE_MAX * 2) {
    throw "Guesser cannot ever guess the target, even with maxed out genes";
}

const MAX_MUTATION_PERCENTAGE = 20;

module.exports = {
    GUESSER_GENE_MAX,
    GUESSER_TARGET_NUMBER,
    MAX_MUTATION_PERCENTAGE,
};
