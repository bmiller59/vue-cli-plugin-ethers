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
* In the store module, search for the `alert` and `confirm` statements. These will alert the state of the ethereum connection and account changes in the browser.
* By default ethersConnect.js is set to log each block of the blockchain in the console. Review the code comments to see how to easily extend or disable this.

### Usage

* See [Vuex Getting Started](https://vuex.vuejs.org/guide/) for general information about Vuex.
* This plugin expects you to have a file `main.js` in your `src` folder according to vue-cli standard.
* It also expects you to have already added Vuex to your project before adding this plugin.
* And that
  * your store folder is called ```store ``` with an `index.js` in it,
  * you have a ```modules``` section in your store `index.js`,
  * and you have an ```export``` in your store `index.js` file.

For example, the standard store created by `vue add vuex`, with a modules section added, will work:

```
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
  },
  mutations: {
  },
  actions: {
  },
  modules: {
  }
})
```

These are needed to correctly augment the root store with the ethers module code.


### Install via vue-cli

```sh
$ vue add ethers
```


### Interacting with contracts
Read about how to do this in the [ethers.js contract documentation](https://docs.ethers.io/v5/api/contract/contract/).

### Contributions
Pull requests welcome!



#### Acknowledgements
Extended and modified from [vue-cli-plugin-vuex-module-generator](https://github.com/paulgv/vue-cli-plugin-vuex-module-generator). Thanks!
