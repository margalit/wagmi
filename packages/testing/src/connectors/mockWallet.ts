import { ethers } from 'ethers'

import { MockProvider } from './mockProvider'

interface MockWalletOptions {
  privateKey: string
  provider: MockProvider
}

export class MockWallet extends ethers.Wallet {
  constructor(options: MockWalletOptions) {
    super(options.privateKey, options.provider)
  }

  async sendTransaction(transaction) {
    // TODO
    return {
      from: transaction.from,
    }
  }
}
