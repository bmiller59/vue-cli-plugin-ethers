/* eslint-disable */
import Vue from 'vue'
import {
  providers,
  Contract as ContractModule,
  utils as utilsModule
} from 'ethers'

export const PROVIDER_CHECK_MS = 500
// networks where ens exists
// Mainet, Ropsten, Ropsten
export const ENS_NETS = ['0x1', '0x3', '0x4']

// messages
export const MSGS = {
  NOT_CONNECTED: 'Not connected to Ethereum network',
  NOT_READY: 'Ethereum network not ready',
  NO_WALLET: 'No Ethereum wallet detected',
  ACCOUNT_CHANGED: 'Ethereum account changed',
  ETHERS_VUEX_INITIALIZED: 'Ethers vuex module initialized',
  ETHERS_VUEX_READY: 'Ethers vuex module ready'
}
export const EVENT_CHANNEL = 'ethers'
// use vue as a simple event channel
export const event = new Vue()
// expose ethers modules
export const utils = utilsModule
export const Contract = ContractModule

// ethereum transactions to log
// More information: https://docs.ethers.io/ethers.js/html/api-providers.html#events
export const LOG_TRANSACTIONS = [
  'block'
  // can also be an address or transaction hash
  // [] // list of topics, empty for all topics
]

// for ethers
let ethereum
let provider
let chainId
let userWallet
let currentAccount
let providerInterval
let initialized

function getEthereum() {
  return window.ethereum
}

function ethereumOk() {
  const em = getEthereum()
  return em && em.isConnected()
}

// get the name of this network
export async function getNetName() {
  switch (chainId) {
    case '0x1':
      return 'Mainnet';
    case '0x2':
      return 'Morden (deprecated)'
    case '0x3':
      return 'Ropsten Test Network'
    case '0x4':
      return 'Rinkeby Test Network'
    case '0x5':
      return 'Goerli Test Network'
    case '0x2a':
      return 'Kovan Test Network';
    case undefined:
    case null:
      return 'No Chain!'
    // if you give your ganache an id your can detect it here if you want
    default:
      return 'Unknown'
  }
}

// if this net has ens
export async function hasEns() {
  return ENS_NETS.includes(chainId)
}

// get deployed address for a contract from its networks object and current network id or null
export async function getNetworkAddress(networks) {
  if (!networks[chainId] || !networks[chainId].address) return null
  return networks[chainId].address
}

export function getProvider() {
  return provider
}

export function getWallet() {
  return userWallet
}

export async function getWalletAddress() {
  const addr = userWallet && await userWallet.getAddress()
  return addr
}

export function ready() {
  return !!provider && !!userWallet
}

export async function startProviderWatcher() {
  // this should only be run when a ethereum provider is detected and set at the ethereum value above
  async function updateProvider() {
    try {
      ethereum = getEthereum()
      if (!ethereum) return
      // set ethers provider
      provider = new providers.Web3Provider(ethereum)
      initialized = true

      // this is modeled after EIP-1193 example provided by MetaMask for clarity and consistency
      // but works for all EIP-1193 compatible ethereum providers
      // https://docs.metamask.io/guide/ethereum-provider.html#using-the-provider

      /**********************************************************/
      /* Handle chain (network) and chainChanged (per EIP-1193) */
      /**********************************************************/

      // Normally, we would recommend the 'eth_chainId' RPC method, but it currently
      // returns incorrectly formatted chain ID values.
      chainId = ethereum.chainId

      ethereum.on('chainChanged', handleChainChanged)

      /***********************************************************/
      /* Handle user accounts and accountsChanged (per EIP-1193) */
      /***********************************************************/

      const accounts = await ethereum.request({ method: 'eth_accounts' })
      await handleAccountsChanged(accounts)
      // Note that this event is emitted on page load.
      // If the array of accounts is non-empty, you're already
      // connected.
      ethereum.on('accountsChanged', handleAccountsChanged)
    } catch (err) {
      // Some unexpected error.
      // For backwards compatibility reasons, if no accounts are available,
      // eth_accounts will return an empty array.
      console.error('Error requesting ethereum accounts', err)
      event.$emit(EVENT_CHANNEL, MSGS.NO_WALLET)
    }
  }

  function checkProvider() {
    // handle changes of availability of ethereum provider
    if (ethereum && !ethereumOk()) {
      ethereum = null
      provider = null
      chainId = null
      currentAccount = null
      userWallet = null
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY)
    } else if (!ethereum && ethereumOk()) {
      updateProvider()
    }
  }

  // kick it off now
  checkProvider()
  // and set interval
  providerInterval = setInterval(checkProvider, PROVIDER_CHECK_MS)
}

function handleChainChanged(_chainId) {
  // We recommend reloading the page, unless you must do otherwise
  console.log('Ethereum chain changed. Reloading as recommended.')
  chainId = _chainId
  alert('Ethereum chain has changed. We will reload the page as recommended.')
  window.location.reload()
}

// For now, 'eth_accounts' will continue to always return an array
function handleAccountsChanged(accounts) {
  if (accounts.length === 0) {
    // MetaMask is locked or the user has not connected any accounts
    console.log('No ethereum accounts available')
    event.$emit(EVENT_CHANNEL, MSGS.NO_WALLET)
  } else if (accounts[0] !== currentAccount) {
    currentAccount = accounts[0]
    userWallet = provider && provider.getSigner(currentAccount)
    event.$emit(EVENT_CHANNEL, MSGS.ACCOUNT_CHANGED)
  }
}

/*********************************************/
/* Access the user's accounts (per EIP-1102) */
/*********************************************/

// You should only attempt to request the user's accounts in response to user
// interaction, such as a button click.
// Otherwise, you popup-spam the user like it's 1999.
// If you fail to retrieve the user's account(s), you should encourage the user
// to initiate the attempt.
// document.getElementById('connectButton', connect)

export async function connect() {
  try {
    if (!ethereum) return event.$emit(EVENT_CHANNEL, MSGS.NOT_CONNECTED)
    const accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    await handleAccountsChanged(accounts)
    await event.$emit(EVENT_CHANNEL, MSGS.ACCOUNT_CHANGED)
  } catch (err) {
    if (err.code === 4001) {
      // EIP-1193 userRejectedRequest error
      // If this happens, the user rejected the connection request.
      console.log('Please connect to Ethereum wallet')
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY, err)
    } else {
      console.error('Error requesting Ethereum connection/accounts', err)
      event.$emit(EVENT_CHANNEL, MSGS.NOT_READY, err)
    }
  }
}

// stop interval looking for ethereum provider changes
export async function stopWatchProvider() {
  if (providerInterval) clearInterval(providerInterval)
  providerInterval = null
}

// start ethereum provider checker
startProviderWatcher()

export default {
  connect,
  ethereumOk,
  getNetName,
  hasEns,
  getProvider,
  getWallet,
  getWalletAddress,
  getNetworkAddress,
  ready
}
