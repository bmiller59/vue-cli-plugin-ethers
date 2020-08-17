module.exports = [
  {
    type: 'input',
    name: 'mainJsDir',
    message: 'Where\'s your app\'s main.js file?',
    default: './src',
  },
  {
    type: 'input',
    name: 'storeRootDir',
    message: 'Where\'s your store\'s root directory?',
    default: './src/store',
  },
  {
    type: 'input',
    name: 'moduleName',
    message: 'What would you like to name the module?',
    default: 'ethers'
  }
]
