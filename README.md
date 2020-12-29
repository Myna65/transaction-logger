# Ethereum address logger

This script will log all the transaction with ETH (amout > 0) received by a specific address to a file

## Build

The git version must be build manually before use. To do so, please run `npm run build`. 

The npm version, once published, will not have such limitation

## Usage

This script needs **node 14** to run  

To log all the transactions to a specific address `<address>` run

```npm run minter <address>```

## Configuration

The following environment variable can be set

`OUTPUT_PATH`: Set the path of the output file. It should be an empty file or a file given by a previous execution of this script with the **same address**. Otherwise, the results are unpredicable. Defaults to `OUTPUT.txt`

`ETHERSCAN_ENDPOINT`: Etherscan's chain endpoint. Uses ropsten by default on `https://api-ropsten.etherscan.io`

`ETHERSCAN_API_KEY`: Etherscan applies a rate limit of 5 requests/sec/IP as of today. If you execute this script on an address with a huge number of transactions or if you run multiple instances of this script at the same times, you might face rate limit errors. If it's the case, please set this env variable to a valid API key.

`UPDATE_INTERVAL`: Specifies the interval in seconds to wait between each poll of transaction. Default to `15` (average time between block mining)


