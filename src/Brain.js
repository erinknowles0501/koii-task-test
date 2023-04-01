const OPERATOR_FUNCTIONS = {
    add: (a, b) => a + b,
    subtract: (a, b) => a - b,
    multiply: (a, b) => a * b,
    divide: (a, b) => a / b,
};

const MAX_EXPRESSION = 100;

class Brain {
    //#influencability = 0; // TODO: Play with what happens if this is also a gene! Could be cool

    constructor() {
        this.genes = {
            left: 0,
            right: 0,
            operation: this.#getOperation(),
        };
        // this.#influencability = Math.round((Math.random() * 2 - 1) * 100) / 100; // gives random between (approximately) -0.99 and +0.99
        // console.log(
        //     "this.genes, this.#influencability",
        //     this.genes,
        //     this.#influencability
        // );
    }

    #getOperation() {
        const opFuncs = Object.keys(OPERATOR_FUNCTIONS);
        const opFuncIndex = Math.floor(Math.random() * opFuncs.length);
        return OPERATOR_FUNCTIONS[opFuncs[opFuncIndex]];
    }

    pickParent(parents) {
        // Randomly select, weighted by how correct the parent was
    }

    mutate(parent) {
        // parent will have a value for left, new gene has a value for left
        // ultimate left value should be closer to parent depending on how correct they were
        // First, normalize
        /*
        Parent left: 100
        mutation left: 0
        parent correctness: 0.75
        ultimate left: 75

        parent left: 1
        mutation left: 100
        parent correctness: 0.25
        ultimate left: 75

        weighted parent left: parent left * parent correctness quotient (100*0.75 = 75, 1*0.25 = 0.25)
        ultimate left: weighted parent left - mutation left (75 - 0 = 75, 0.25
        */
        // ultimate operation gene should be a coin flip, weighted by how correct parent was

        // TODO Error handling
        const newGenes = {
            left: Math.round(Math.random() * MAX_EXPRESSION),
            right: Math.round(Math.random() * MAX_EXPRESSION),
            operation: this.#getOperation(),
        };
        const genes = (this.genes = genes);
    }
}

console.log(new Brain());
