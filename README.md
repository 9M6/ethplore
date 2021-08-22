# Ethplore

A Ethereum CLI to explore specific range of blocks and give details about
incoming and outgoing ethereum transfers.

## Required
- Node.js
- NPM
- Shell (Bash, ZSH, etc.)

## Install

Install with HTTPS
```bash
npm i git+https://github.com/kebani/ethplore.git -g
```

Install with SSH
```bash
npm i git+ssh://github.com/kebani/ethplore.git -g
```

## How to Use ethplore

Command Line Arguments
```bash
Usage: 
  ethplore [arguments]

Arguments:
  ethplore [Number]                                     By providing a single number, the cli will fetch all 
                                                        blocks starting from the current height block and going 
                                                        backwards to the amount of steps specified as argument.
                                                        The result will be the total value of each block.
  
  ethplore [Number..Number]                             By providing a range of numbers ethplore will go backwards 
                                                        starting from the first number to the specified second number.

            --tx-type incoming|outgoing|contract|all    Will output list of transactions based on the passed value.
                                                        - incoming list addresses that receive ethereum
                                                        - outgoing list addresses that have sent ethereum
                                                        - contract list addresses that are contract type
                                                        - all list all addresses with incoming and outgoing tx
                                                        
Examples:
  ethplore 10                                           Ethplore will fetch the last 10 blocks starting from the latest block.
  ethplore 10 --tx-type incoming                        Will fetch 10 blocks and list up all unique addresses that have received eth
  ethplore 10..20                                       Ethplore will fetch the blocks between the latest 10 to the latest 20 blocks.
```

### The tool includes several Environmental Variables:

```bash
ETH_NETWORK # This is the ethereum endpoint, can be testnet or main net
INFURA_ID # Infura Project ID
INFURA_SECRET # Infura Secret ID
```
_note I'm using Ethers.js as a main library to connect to ethereum._

### Tests

```bash
npm test
```
