#circomlibjs

`circomlibjs` is a Javascript library that provides programs to compute the witness of several circuits of `circomlib`.
This library is used to make tests of circomlib circuits.

In the `src` directory the package includes these programs.

In the `test` directory includes its own tests and.

In the `tools` directory includes programs to precompute some needed parameters.

You can install `circomlibjs` with the following command:

```text
npm install -g circomlibjs
```


#Forked off of iden3/circomlibjs
This fork has been changed to support Starkware version of Poseidon3 contract for ethereum L1. Current version has been deployed on goerli at 0x84d43a8cbEbF4F43863f399c34c06fC109c957a4. Byte code and abi included in the deployed folder.

#Disclaimer
The above contract has not been audited. Should not be used in Mainnet/Production

