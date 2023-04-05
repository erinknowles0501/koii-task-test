const express = require("express");
const TASK_NAME = process.argv[2];
const TASK_ID = process.argv[3];
const EXPRESS_PORT = process.argv[4];
const NODE_MODE = process.argv[5];
const MAIN_ACCOUNT_PUBKEY = process.argv[6];
const SECRET_KEY = process.argv[7];
const K2_NODE_URL = process.argv[8];
const SERVICE_URL = process.argv[9];
const STAKE = Number(process.argv[10]);

// Both of these numbers have to be positive integers
const GUESSER_GENE_MAX = 100; // Guesser has two genes, 'right' and 'left', which are added to guess at the target number. This var is the max number that right and left can each be.
const GUESSER_TARGET_NUMBER = 60; // The number that the Guesser is trying to get to.

if (GUESSER_TARGET_NUMBER > GUESSER_GENE_MAX * 2) {
    throw "Guesser cannot ever guess the target, even with maxed out genes";
}

const app = express();

console.log("SETTING UP EXPRESS", NODE_MODE, EXPRESS_PORT);
app.get("/", (req, res) => {
    res.send("Hello World!");
});

app.listen(EXPRESS_PORT, () => {
    console.log(`${TASK_NAME} listening on port ${EXPRESS_PORT}`);
});

module.exports = {
    app,
    NODE_MODE,
    TASK_ID,
    MAIN_ACCOUNT_PUBKEY,
    SECRET_KEY,
    K2_NODE_URL,
    SERVICE_URL,
    STAKE,
    GUESSER_GENE_MAX,
    GUESSER_TARGET_NUMBER,
};
