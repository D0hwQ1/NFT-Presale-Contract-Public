const HDWalletProvider = require("truffle-hdwallet-provider-klaytn");
require("dotenv").config();

module.exports = {
    CYPRESS_PRIVATE_KEY,
    BAOBAB_PRIVATE_KEY,

    networks: {
        baobab: {
            provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, "https://api.baobab.klaytn.net:8651/"),
            network_id: "1001",
            gas: "8500000",
            gasPrice: null,
        },
        cypress: {
            provider: () => new HDWalletProvider(process.env.PRIVATE_KEY, "https://public-node-api.klaytnapi.com/v1/cypress"),
            network_id: "8217",
            gas: "8500000",
            gasPrice: null,
        },
    },

    compilers: {
        solc: {
            version: "0.8.0",
            settings: {
                optimizer: {
                    enabled: true,
                    runs: 999999,
                },
                evmVersion: "istanbul",
                outputSelection: {
                    "*": {
                        "": ["ast"],
                        "*": [
                            "evm.bytecode.object",
                            "evm.deployedBytecode.object",
                            "abi",
                            "evm.bytecode.sourceMap",
                            "evm.deployedBytecode.sourceMap",
                            "metadata",
                        ],
                    },
                },
            },
        },
    },
};
