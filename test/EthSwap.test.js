const { assert } = require('chai');
const { default: Web3 } = require('web3');

const Token = artifacts.require("Token");
const EthSwap = artifacts.require("EthSwap");

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract('EthSwap', ([deployer, investor]) => {
    let token, ethSwap
    before(async () => {
        token = await Token.new()
        ethSwap = await EthSwap.new(token.address)
        await token.transfer(ethSwap.address, tokens('1000000')) 
    })

    describe('Token deployment', async() => {
        it('contract has a name', async() => {
            const name = await token.name()
            assert.equal(name, 'DApp Token')
        })
    })

    describe('EthSwap deployment', async() => {
        it('contract has a name', async() => {
            const name = await ethSwap.name()
            assert.equal(name, 'EthSwap Instant Exchange')
        })
        it('contract has token', async() => {
            let balance = await token.balanceOf(ethSwap.address)
            assert.equal(balance.toString(), tokens('1000000'))
        })
    })
    describe('buyTokens()', async() => {
        let result;
        before(async () => {
           result = await ethSwap.buyTokens({from: investor, value: web3.utils.toWei('1', 'ether')})

        })
        it('Allows instantly purchase token from ethSwap for a fixed price', async() => {
            //Check investor balance after purchase
            let investorBalance = await token.balanceOf(investor);
            assert.equal(investorBalance.toString(), tokens('100'))

            //Check ethSwap balance after purchase
            let ethSwapBalance;
            ethSwapBalance = await token.balanceOf(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), tokens('999900'))
            ethSwapBalance = await web3.eth.getBalance(ethSwap.address)
            assert.equal(ethSwapBalance.toString(), web3.utils.toWei('1', 'Ether'))
        })
    })


})