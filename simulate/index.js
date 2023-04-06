const { GUESSER_TARGET_NUMBER, STARTING_PARENTS } = require("../src/constants");
const Guesser = require("../src/Guesser.js");

let currentGuess = false;
let parents = Array(STARTING_PARENTS)
    .fill()
    .map(() => new Guesser());

async function runSim() {
    while (!currentGuess) {
        const parent = await Guesser.pickParent(parents);
        const guesser = new Guesser(parent);

        console.log("guesser", guesser);
        parents.push(guesser);

        if (guesser.distance === 0) {
            currentGuess = guesser;
        }
    }
}

runSim();

console.log(`

Success! in ${currentGuess.id} tries. Target number: ${GUESSER_TARGET_NUMBER}

`);
console.log("currentGuess", currentGuess);
