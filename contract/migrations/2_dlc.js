var dlc = artifacts.require('DLC');
var kip17 = require('../build/contracts/KIP17Token.json')

const address = require(__dirname + "/../../src/klaytn/address")

module.exports = function(deployer) {
    deployer.deploy(dlc, kip17.networks[address[1]].address)
};