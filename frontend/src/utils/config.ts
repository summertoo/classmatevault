export const NETWORK_CONFIG = {
  testnet: {
    fullnode: 'https://fullnode.testnet.sui.io',
    faucet: 'https://faucet.testnet.sui.io/gas',
  },
  mainnet: {
    fullnode: 'https://fullnode.mainnet.sui.io',
    faucet: '',
  },
};

export const CONTRACT_PACKAGE_ID = {
  testnet: '0x15a5f901aa64a339e9dd55b33a42f55b70072367edb18aaad186937eb6d96be6', // 部署后填入
  mainnet: '0x9bdc8526e164e7a4eda87f646660a1ae32735c8a4a0ed54b2130368909c536a8', // 部署后填入
};