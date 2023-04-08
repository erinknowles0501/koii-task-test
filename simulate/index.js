const { GUESSER_TARGET_NUMBER, STARTING_PARENTS } = require("../src/constants");
const Guesser = require("../src/Guesser.js");

const NODES = 5; // How many nodes to simulate running the Guesser Task on

let currentGuess = false;
let parents = Array(STARTING_PARENTS)
    .fill()
    .map(() => new Guesser());

function task() {
    const parent = Guesser.pickParent(parents);
    const guesser = new Guesser(parent);

    if (guesser.distance === 0) {
        currentGuess = guesser;
    }

    return guesser;
}

let rounds = 0;
const timer = setInterval(() => {
    if (currentGuess) {
        clearInterval(timer);
        success();
        return;
    }

    const roundSubmissions = [];
    for (let i = 0; i < NODES; i++) {
        roundSubmissions.push(task());
    }
    console.log('parents distance', parents.map(p => p.distance));
    console.log(
        "roundSubmissions distance",
        roundSubmissions.map((s) => s.distance)
    );

    parents.unshift(...roundSubmissions);
    rounds++;
}, 500);

// SUCCESS!
function success() {
    console.log(`

Success! in ${rounds} rounds across ${NODES} nodes. Target number: ${GUESSER_TARGET_NUMBER}

`);
    console.log("currentGuess", currentGuess);
}
