<a href="https://npmjs.com/package/vue-cli-plugin-ethers">
    <img alt="" src="https://img.shields.io/npm/v/vue-cli-plugin-ethers/latest.svg?style=flat-square">
</a>
<a href="https://npmjs.com/package/vue-cli-plugin-ethers">
    <img alt="" src="https://img.shields.io/npm/dm/vue-cli-plugin-ethers.svg?style=flat-square">
</a>

# Ethereum ethers.js vuex store module generator plugin for vue-cli 3

[vue-cli 3](https://github.com/vuejs/vue-cli) plugin to generate a vuex store module that will connect to the Ethereum blockchain using the [ethers.js](https://github.com/ethers-io/ethers.js/) web3 provider. It monitors and updates connection and network status with your Ethereum node and allows you to connect to contracts and submit transactions. (Requires a browser that supports Ethereum or the use of a browser plugin like [MetaMask](https://metamask.io/).)

## Usage

- Install via vue-cli

```sh
$ vue add vue-cli-plugin-vuex-ethers
```

- Invoke to generate the ethers.js ethereum connection vuex module:

```sh
$ vue invoke vue-cli-plugin-vuex-ethers
? Where's your store's root directory? ./src/store
? What would you like to name the module? ethers
```

#### Acknowledgements
Modified from [vue-cli-plugin-vuex-module-generator](https://github.com/paulgv/vue-cli-plugin-vuex-module-generator). Thanks!
