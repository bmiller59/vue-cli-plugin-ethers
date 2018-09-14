<a href="https://npmjs.com/package/vue-cli-plugin-ethers">
    <img alt="" src="https://img.shields.io/npm/v/vue-cli-plugin-ethers/latest.svg?style=flat-square">
</a>
<a href="https://npmjs.com/package/vue-cli-plugin-ethers">
    <img alt="" src="https://img.shields.io/npm/dm/vue-cli-plugin-ethers.svg?style=flat-square">
</a>

## Ethereum ethers.js vuex store module generator plugin for vue-cli 3
#### Build dApps!

[vue-cli 3](https://github.com/vuejs/vue-cli) plugin to generate a vuex store module that will connect to the Ethereum blockchain using the [ethers.js](https://github.com/ethers-io/ethers.js/) web3 provider. (ethers.js can do everything [web3.js](https://github.com/ethereum/web3.js/) can do and more, like ENS name resolution. It is also well documented.)

This plugin monitors and updates connection and network status with your Ethereum node on any network and allows you to connect to contracts and submit transactions.

(Requires a browser that supports Ethereum or the use of a browser plugin like [MetaMask](https://metamask.io/).) Can serve as the foundation of a vue-based Ethereum dApp!

### State
These state variables are kept updated:
* connected (true or false)
* address (of the user)
* ens (ENS name if any for selected address)
* user (either address or if on a net that supports ENS, the ENS name)
* error (error if any)
* network (human readable name of the network you are on)

### Example code
This plugin comes with the following example code enabled so you can see how this module works. Replace the example code with your own application logic.
* In the store actions, look for the ```alert``` statements. These will alert the state of the ethereum connection and account changes in the browser.
* By default ethersConnect.js is set to log each block of the blockchain in the console. Review the code comments to see how to easily extend or disable this.

### Usage

* See [Vuex Getting Started](https://vuex.vuejs.org/guide/) for general information.
* You either
  * do not yet have a root store file already,
  * or if you do in that file
    *  your store is called ```store ```,
    * you have a ```modules``` section in your store,
    * and you have an ```export```. These are needed to correctly augment the root store with the ethers module code.


- Install via vue-cli

```sh
$ vue add vue-cli-plugin-ethers
```

- Invoke to generate the ethers.js ethereum connection vuex module:

```sh
$ vue invoke vue-cli-plugin-ethers
? Where is the root directory of your store? ./src/store
? What would you like to name the module? ethers
```


### Interacting with contracts
Read about how to do this in the [ethers.js contract documentation](https://docs.ethers.io/ethers.js/html/api-contract.html).

### Contributions
Pull requests welcome!



#### Acknowledgements
Extended and modified from [vue-cli-plugin-vuex-module-generator](https://github.com/paulgv/vue-cli-plugin-vuex-module-generator). Thanks!
