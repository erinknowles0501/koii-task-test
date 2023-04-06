let currentID = 0;
function makeID() {
    currentID++;
    return currentID;
}
function resetID() {
    currentID = 0;
}

module.exports = { makeID, resetID };
