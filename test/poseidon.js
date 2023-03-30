import chai from "chai";
const assert = chai.assert;

import buildPoseidonOpt from "../src/poseidon_opt.js";
import { buildPoseidon as buildPoseidonWasm } from "../src/poseidon_wasm.js";
import buildPoseidonReference from "../src/poseidon_reference.js";

// NOTE: THIS FILE ONLY TESTS FOR Poseidon3

describe("Poseidon test", function () {
    let poseidonOpt;
    let poseidonReference;
    let poseidonWasm;
    this.timeout(10000000);

    before(async () => {
        poseidonOpt = await buildPoseidonOpt();
        poseidonReference = await buildPoseidonReference();
        poseidonWasm = await buildPoseidonWasm();
    });

    it("Should check constrain reference implementation poseidonperm_x5_254_3", async () => {
        const res1 = poseidonReference([1, 2, 2]);
        let buffer = res1.buffer;

        //console.log(" poseidonReference res1 ", res1[0]);
        assert(poseidonReference.F.eq(poseidonReference.F.e("0x5d44a3decb2b2e0cc71071f7b802f45dd792d064f0fc7316c46514f70f9891a"), res1[0]));

    });
});
