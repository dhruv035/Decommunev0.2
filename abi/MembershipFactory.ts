const abi = [
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "internalType": "address",
        "name": "_contractAddress",
        "type": "address"
      }
    ],
    "name": "Deploy",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "getAllMemberships",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "creator",
        "type": "address"
      }
    ],
    "name": "getCreatorStack",
    "outputs": [
      {
        "internalType": "address[]",
        "name": "",
        "type": "address[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "memberships",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "initialOwner",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "name",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "symbol",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "baseUrl",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "basePrice",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "switchValue",
        "type": "bool"
      }
    ],
    "name": "newMembership",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
] as const;
export { abi };
