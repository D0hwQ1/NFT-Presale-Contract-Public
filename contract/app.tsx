const Caver = require("caver-js");
const address = require(__dirname + "/../src/klaytn/address.json");
const kip17 = require(__dirname + "/build/contracts/KIP17Token.json");
const dlc = require(__dirname + "/build/contracts/DLC.json");

require("dotenv").config();

var wallet = {
    _address: "",
    _key: "",
};


var caver;
var contract;
if (process.env.GATSBY_MODE == "testnet") {
    caver = new Caver("https://public-node-api.klaytnapi.com/v1/baobab");
    contract = new caver.contract(kip17.abi, "0x8e9cc35c83379376829dc881f1c459942f7b47f8");
    wallet = caver.wallet.keyring.create(caver.klay.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address, process.env.PRIVATE_KEY);
    caver.wallet.add(wallet);
} else {
    caver = new Caver("https://public-node-api.klaytnapi.com/v1/cypress");
    contract = new caver.contract(kip17.abi, "0x16c15581818ba99472b0ff7616d05fe1fd7cd44d");
    wallet = caver.wallet.keyring.create(caver.klay.accounts.privateKeyToAccount(process.env.PRIVATE_KEY).address, process.env.PRIVATE_KEY);
    caver.wallet.add(wallet);
}

(async () => {
    var res = await contract.methods.addMinter(dlc.networks[process.env.GATSBY_MODE == "testnet" ? "1001" : "8217"].address).send({
        from: wallet._address,
        gas: 2500000,
    });
    console.log(res);
})();

export {};
