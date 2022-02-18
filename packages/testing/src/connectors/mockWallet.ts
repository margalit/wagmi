import { ethers } from 'ethers'

interface MockWalletOptions {
  privateKey: string
}

export class MockWallet extends ethers.Wallet {
  constructor(options: MockWalletOptions) {
    super(options.privateKey)
  }
}
