// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Identity {

    struct IdentityInfo {
        string username;
        string profilePicture;
    }

    mapping(address => IdentityInfo) public identities;

    function registerIdentity(string memory _username, string memory _profilePicture) public {
        require(bytes(_username).length > 0, "Username cannot be empty.");
        require(bytes(_profilePicture).length > 0, "Profile picture cannot be empty.");
        identities[msg.sender] = IdentityInfo({
            username: _username,
            profilePicture: _profilePicture
        });
    }

    function getIdentity(address _user) public view returns (string memory, string memory) {
        IdentityInfo memory userIdentity = identities[_user];
        return (userIdentity.username, userIdentity.profilePicture);
    }
}
