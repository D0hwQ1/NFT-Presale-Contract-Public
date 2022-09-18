// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import './NFT.sol';

contract DLC is Ownable {
    using SafeMath for uint256;
    using Address for address;

    KIP17Token private _kip17;

    uint256[] public _tokenList;
    string[] public _uriList;
    uint256 private _listLength = 0;
    uint256 private _tokenPrice;
    uint256 private _tokenLaunchTime;
    uint256 private _maxAmount;

    address[] _whiteAddress;
    bool private _whiteList = false;

    uint256[] private _airdropId;
    string[] private _airdropURI;
    uint256 private _airdropLength;


    constructor (address kip17) {
        _kip17 = KIP17Token(kip17);
    }
    function name() external view returns(string memory) {
        return _kip17.name();
    }


    function getList() external onlyOwner view returns (uint256[] memory, string[] memory, address[] memory) {
        return (_tokenList, _uriList, _whiteAddress);
    }
    
function getInformation() public view returns (uint256, uint256, uint256, uint256, uint256, bool, uint256, uint256, uint256) {
    return (
        _tokenList.length,
        _tokenPrice,
        _tokenLaunchTime,
        _maxAmount,
        _listLength,
        _whiteList,
        address(this).balance,
        _airdropId.length,
        _whiteAddress.length
    );
}

function setList(uint256[] memory tokenList, string[] memory uriList) external onlyOwner returns (bool) {
    if (_tokenList.length == 0) {
        _listLength = 0;
    }
    
    for (uint256 i = 0; i < tokenList.length; i++) {
        _tokenList.push(tokenList[i]);
    }
    for (uint256 i = 0; i < uriList.length; i++) {
        _uriList.push(uriList[i]);
    }

    _listLength += tokenList.length;
    return true;
}

    function setPrice(uint256 price) external onlyOwner returns (bool) {
        _tokenPrice = price;
        return true;
    }

    function setTime(uint256 time) external onlyOwner returns (bool) {
        _tokenLaunchTime = time;
        return true;
    }

    function setAmount(uint256 maxAmount) external onlyOwner returns (bool) {
        _maxAmount = maxAmount;
        return true;
    }

    function setWhiteList(bool tmp) external onlyOwner returns (bool) {
        _whiteList = tmp;

        return true;
    }

    function setWhiteAddress(address[] memory whiteAddress) external onlyOwner returns (bool) {
        for (uint256 i = 0; i < whiteAddress.length; i++) {
            _whiteAddress.push(whiteAddress[i]);
        }

        return true;
    }

    function resetWhiteAddress() external onlyOwner returns (bool) {
        delete _whiteAddress;

        return true;
    }

    function setAirdrop(uint256[] memory tokenList, string[] memory uriList) external onlyOwner returns (bool) {
        for (uint256 i = 0; i < tokenList.length; i++) {
            _airdropId.push(tokenList[i]);
        }
        for (uint256 i = 0; i < uriList.length; i++) {
            _airdropURI.push(uriList[i]);
        }
        return true;
    }

    function airdrop(address[] memory user, uint256 amount) external onlyOwner returns (bool) {
        for (uint256 i = 0; i < user.length; i++) {
            for (uint256 j = 0; j < amount; j++) {
                uint256 _tokenId = _airdropId[_airdropId.length - 1];
                string memory _uri = _airdropURI[_airdropURI.length - 1];
                
                _airdropId.pop();
                _airdropURI.pop();

                _kip17.mintWithTokenURI(user[i], _tokenId, _uri);
            }
        }

        return true;
    }

    function purchase(uint256 amount) external payable returns (bool) {
        require(_tokenList.length > 0, "KIP17Token: Sold out");
        require(_maxAmount >= amount, "KIP17Token: Purchase limit");
        require(_tokenPrice >= msg.value, "KIP17Token: Don't pay enough coin");

        bool pass = false;
        
        if (_whiteList == true) {
            for (uint256 i=0; i < _whiteAddress.length; i++) {
                if (_whiteAddress[i] == msg.sender) {
                    pass = true;
                }
            }
            require(pass == true, "KIP17Token: Not holder");
        }

        uint256 _amount = amount;
        if (amount > _tokenList.length) {
            _amount = _tokenList.length;
        }
        uint256 _refunds = (amount - _amount) * _tokenPrice;

        for (uint256 i=0; i < _amount; i++) {
            uint256 _tokenId = _tokenList[_tokenList.length - 1];
            string memory _uri = _uriList[_uriList.length - 1];
            
            _tokenList.pop();
            _uriList.pop();
            
            _kip17.mintWithTokenURI(msg.sender, _tokenId, _uri);
        }

        if (_refunds > 0) {
            payable(msg.sender).transfer(_refunds);
        }

        return true;
    }

    function combine(uint256 token1, uint256 token2, uint256 id, string memory _uri) public returns(bool) {
        _kip17.burn(token1);
        _kip17.burn(token2);

        _kip17.mintWithTokenURI(msg.sender, id, _uri);

        return true;
    }

    function withdraw(uint256 money) external onlyOwner returns (bool) {
        payable(msg.sender).transfer(money);
        return true;
    }
    function withdrawAll() external onlyOwner returns (bool) {
        payable(msg.sender).transfer(address(this).balance);
        return true;
    }
}