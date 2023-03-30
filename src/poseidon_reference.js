
import assert from "assert";
import { getCurveFromName, Scalar, F1Field } from "ffjavascript";

import poseidonConstants from "./poseidon_constants.js";

function unsringifyConstants(Fr, o) {
    if ((typeof (o) == "string") && (/^[0-9]+$/.test(o))) {
        return Scalar.e(o);
    } else if ((typeof (o) == "string") && (/^0x[0-9a-fA-F]+$/.test(o))) {
        return Scalar.e(o);
    } else if (Array.isArray(o)) {
        return o.map(unsringifyConstants.bind(null, Fr));
    } else if (typeof o == "object") {
        if (o === null) return null;
        const res = {};
        const keys = Object.keys(o);
        keys.forEach((k) => {
            res[k] = unsringifyConstants(Fr, o[k]);
        });
        return res;
    } else {
        return o;
    }
}

export default async function buildPoseidon() {
    const bn128 = await getCurveFromName("bn128", true);
    const F = new F1Field(Scalar.e("3618502788666131213697322783095070105623107215331596699973092056135872020481"));

    // Parameters are generated by a reference script https://extgit.iaik.tugraz.at/krypto/hadeshash/-/blob/master/code/generate_parameters_grain.sage
    // Used like so: sage generate_parameters_grain.sage 1 0 254 2 8 56 0x30644e72e131a029b85045b68181585d2833e84879b9709143e1f593f0000001
    const { C, M } = unsringifyConstants(F, poseidonConstants);

    // Using recommended parameters from whitepaper https://eprint.iacr.org/2019/458.pdf (table 2, table 8)
    // Generated by https://extgit.iaik.tugraz.at/krypto/hadeshash/-/blob/master/code/calc_round_numbers.py
    // And rounded up to nearest integer that divides by t
    const N_ROUNDS_F = 8;
    const N_ROUNDS_P = 83;

    const pow3 = a => F.mul(a, F.square(a, a));

    function poseidon(inputs) {
        assert(inputs.length == 3); // Only Poseidon3 is supported for starkware
        // assert(inputs.length <= N_ROUNDS_P.length);

        const t = inputs.length;
        const nRoundsF = N_ROUNDS_F;
        const nRoundsP = N_ROUNDS_P;

        // if (initState) {
        //     initState = Scalar.e(initState);
        // } else {
        //     initState = Scalar.zero;
        // }

        let state = [...inputs.map(a => Scalar.e(a))];
        for (let r = 0; r < nRoundsF + nRoundsP; r++) {
            state = state.map((a, i) => F.add(a, C[t - 2][r * t + i]));

            if (r < nRoundsF / 2 || r >= nRoundsF / 2 + nRoundsP) {
                state = state.map(a => pow3(a));
            } else {
                state[2] = pow3(state[2]);
            }

            state = state.map((_, i) =>
                state.reduce((acc, a, j) => F.add(acc, F.mul(M[t - 2][i][j], a)), F.zero)
            );
        }
        return state
    }

    poseidon.F = F;
    return poseidon;
}

