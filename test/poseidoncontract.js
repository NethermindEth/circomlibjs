import chai from "chai";
import { createCode, generateABI } from "../src/poseidon_gencontract.js";
import buildPoseidonReference from "../src/poseidon_reference.js";
import { ethers } from "ethers";
import ganache from "ganache";
import bigInt from "big-integer";
const assert = chai.assert;
const log = (msg) => { if (process.env.MOCHA_VERBOSE) console.log(msg); };

describe("Poseidon Smart contract test", function () {
    let testrpc;
    let web3;
    let poseidon6;
    let poseidon3;
    let poseidon;
    let account;
    this.timeout(100000);

    before(async () => {
        const provider = new ethers.providers.Web3Provider(ganache.provider());

        account = provider.getSigner(0);
        poseidon = await buildPoseidonReference();
    });

    it("Should deploy the contract", async () => {
        const C3 = new ethers.ContractFactory(
            generateABI(3),
            createCode(3),
            account
        );

        poseidon3 = await C3.deploy();
    });

    it("Should calculate the poseidon correctly t=3", async () => {

        const res = await poseidon3["poseidon(uint256[3])"]([0, 0, 0]);

        console.log("Cir: " + res);
        // comparing results with -> https://github.com/starkware-industries/poseidon
        const res2 = poseidon([0, 0, 0]);
        console.log("Ref: " + res2);

        assert.equal(res.toString(), res2.toString());
    });

});

