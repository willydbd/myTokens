pragma solidity ^0.5.0;

import "./Token.sol";
contract EthSwap {
    string public name = "EthSwap Instant Exchange";
    Token public token;
    uint public rate = 100;

    // When token is purchased event handler
    event TokensPurchased(
        address account,
        address token,
        uint amount,
        uint rate
      );
      // Event handler for when token is sold
      event TokensSold(
        address account,
        address token,
        uint amount,
        uint etherAmount,
        uint rate
      );

    constructor(Token _token) public {
        token = _token;
    }

    //Method handling investor buying token
    function buyTokens() public payable {
        //Calc the total token sender is buying
        uint tokenAmount = rate * msg.value;
        // Ensure EthSwap has enough tokens to send/sell
        require(token.balanceOf(address(this)) >= tokenAmount);
        //If require statement returns true then send token to the buyer.
        token.transfer(msg.sender, tokenAmount);
        // Emit an event
        emit TokensPurchased(msg.sender, address(token), tokenAmount, rate);
    }

    //Method handling investor selling token to exchange to get 'ether'
    function sellTokens(uint _amount) public {
        // User can't sell more tokens than they have
        require(token.balanceOf(msg.sender) >= _amount);
        //Calc the total ether sender gets by dividing total token 
        // sender sends by redemption rate
        uint etherAmount =  _amount / rate;
        //Ensure EthSwap has enough Ether to exchange
        require(address(this).balance >= etherAmount);
        //Approve method is to be called before calling this method
        //but this approval would be done from outside the contract. 
        token.transferFrom(msg.sender, address(this), _amount);
        //send ether to user
        msg.sender.transfer(etherAmount);
        // Emit an event
        emit TokensSold(msg.sender, address(token), _amount, etherAmount, rate);
    }
}