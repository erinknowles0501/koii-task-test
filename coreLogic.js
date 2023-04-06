const { namespaceWrapper } = require("./namespaceWrapper");
const Guesser = require("./src/Guesser.js");
const { STARTNG_PARENTS } = require("./src/constants.js");

class CoreLogic {
    async checkForCorrectGuess() {
        try {
            const correctGuess = JSON.parse(
                await namespaceWrapper.storeGet("correctGuess")
            );
            return correctGuess;
        } catch (error) {
            console.error("ERROR IN checkForCorrectGuess: ", error);
        }
    }

    async task() {
        try {
            const parents =
                JSON.parse(await namespaceWrapper.storeGet("parents")) ||
                new Array(STARTNG_PARENTS).fill().map(() => new Guesser()); // Give it a few to pick from for the beginning rounds, otherwise, since there's only one node operating, it may take a long time to converge on an answer, depending on your MAX_MUTATION_PERCENTAGE.
            console.log("parents in task", parents);

            const guesser = new Guesser(parents && Guesser.pickParent(parents));
            console.log("guesser in task", guesser);

            await namespaceWrapper.storeSet("guesser", JSON.stringify(guesser));
        } catch (err) {
            console.log("ERROR IN EXECUTING TASK", err);
        }
    }
    async fetchSubmission() {
        // console.log("IN FETCH SUBMISSION");
        const round = await namespaceWrapper.getRound();
        console.log("round in fetch submission", round);

        const guesser = await namespaceWrapper.storeGet("guesser");
        console.log("guesser in fetchSubmittion", guesser);

        return guesser;
    }

    async generateDistributionList(round) {
        try {
            console.log("GenerateDistributionList called");

            let distributionList = {};
            const taskAccountDataJSON = await namespaceWrapper.getTaskState();
            const submissions = taskAccountDataJSON.submissions[round];
            const submissions_audit_trigger =
                taskAccountDataJSON.submissions_audit_trigger[round];
            if (submissions == null) {
                console.log("No submisssions found in N-2 round");
                return distributionList;
            } else {
                const keys = Object.keys(submissions);
                const values = Object.values(submissions);
                const size = values.length;
                console.log(
                    "Submissions from last round: ",
                    keys,
                    values,
                    size
                );

                const newParents = [];
                for (let i = 0; i < size; i++) {
                    const candidatePublicKey = keys[i];
                    if (
                        submissions_audit_trigger &&
                        submissions_audit_trigger[candidatePublicKey]
                    ) {
                        console.log(
                            submissions_audit_trigger[candidatePublicKey].votes,
                            "distributions_audit_trigger votes "
                        );
                        const votes =
                            submissions_audit_trigger[candidatePublicKey].votes;
                        let numOfVotes = 0;
                        for (let index = 0; index < votes.length; index++) {
                            if (votes[i].is_valid) numOfVotes++;
                            else numOfVotes--;
                        }
                        if (numOfVotes < 0) continue;
                    }

                    const submittedGuesser = JSON.parse(
                        values[i].submission_value
                    );
                    if (submittedGuesser.distance === 0) {
                        console.log(
                            "Correct guess has been made!",
                            submittedGuesser
                        );
                        await namespaceWrapper.storeSet(
                            "correctGuess",
                            JSON.stringify(submittedGuesser)
                        );
                    }
                    newParents.push(submittedGuesser);

                    distributionList[candidatePublicKey] = 1;
                }

                const storeParents = JSON.parse(
                    await namespaceWrapper.storeGet("parents")
                );
                console.log("storeParents", storeParents);

                let parents = storeParents ?? [];

                parents.push(...newParents);
                console.log("parents - pushed", parents);

                parents = Guesser.sortParents(parents);
                console.log("parents - set", parents);

                const successfulSubmissions =
                    Object.keys(distributionList).length;

                if (parents.length > successfulSubmissions) {
                    parents = parents.slice(
                        0,
                        parents.length -
                            Object.keys(distributionList).length -
                            1
                    ); // remove the n worst parents, where n is the number of new successful submissions.
                    console.log("parents - sliced", parents);
                }

                await namespaceWrapper.storeSet(
                    "parents",
                    JSON.stringify(parents)
                );
            }
            console.log("Distribution List", distributionList);
            return distributionList;
        } catch (err) {
            console.log("ERROR IN GENERATING DISTRIBUTION LIST", err);
        }
    }

    async submitDistributionList(round) {
        // This function just upload your generated dustribution List and do the transaction for that

        console.log("SubmitDistributionList called");

        try {
            const distributionList = await this.generateDistributionList(round);

            const decider = await namespaceWrapper.uploadDistributionList(
                distributionList,
                round
            );
            console.log("DECIDER", decider);

            if (decider) {
                const response =
                    await namespaceWrapper.distributionListSubmissionOnChain(
                        round
                    );
                console.log("RESPONSE FROM DISTRIBUTION LIST", response);
            }
        } catch (err) {
            console.log("ERROR IN SUBMIT DISTRIBUTION", err);
        }
    }

    async validateNode(submissionValue, round) {
        console.log("Received submission_value", submissionValue, round);

        try {
            const guesser = JSON.parse(await this.fetchSubmission());
            const shallowEquals = this.shallowEqual(guesser, submissionValue);
            if (shallowEquals) {
                return true;
            }
        } catch (error) {
            console.error("Node validation error: ", error);
        }

        return false;
    }

    shallowEqual(object1, object2) {
        const keys1 = Object.keys(object1);
        const keys2 = Object.keys(object2);
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (let key of keys1) {
            if (object1[key] !== object2[key]) {
                return false;
            }
        }
        return true;
    }

    validateDistribution = async (distributionListSubmitter, round) => {
        try {
            console.log(
                "Distribution list Submitter",
                distributionListSubmitter
            );
            const fetchedDistributionList = JSON.parse(
                await namespaceWrapper.getDistributionList(
                    distributionListSubmitter,
                    round
                )
            );
            console.log("FETCHED DISTRIBUTION LIST", fetchedDistributionList);
            const generateDistributionList =
                await this.generateDistributionList(round);

            // compare distribution list

            const parsed = JSON.parse(fetchedDistributionList);
            const result = this.shallowEqual(parsed, generateDistributionList);

            console.log("RESULT", result);
            return result;
        } catch (err) {
            console.log("ERROR IN VALIDATING DISTRIBUTION", err);
            return false;
        }
    };
    // Submit Address with distributioon list to K2
    async submitTask(round) {
        //.log("submitTask called with round", round);
        try {
            const submission = await this.fetchSubmission();
            console.log("submission in submitTask", submission);

            await namespaceWrapper.checkSubmissionAndUpdateRound(
                submission,
                round
            );
        } catch (error) {
            console.log("error in submission", error);
        }
    }

    async auditTask(roundNumber) {
        // console.log("auditTask called with round", roundNumber);
        await namespaceWrapper.validateAndVoteOnNodes(
            this.validateNode,
            roundNumber
        );
    }

    async auditDistribution(roundNumber) {
        console.log("auditDistribution called with round", roundNumber);
        await namespaceWrapper.validateAndVoteOnDistributionList(
            this.validateDistribution,
            roundNumber
        );
    }
}
const coreLogic = new CoreLogic();

module.exports = {
    coreLogic,
};
