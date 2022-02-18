import { wallets } from 'wagmi-testing'

import { useConnect } from '..'

import { actHook, renderHook } from '../../../test'
import { Config, useTransaction } from './useTransaction'

const transaction = {
  request: {
    from: wallets.ethers1.address,
    to: wallets.ethers2.address,
  },
}

const useTransactionWithConnect = (config: { transaction?: Config } = {}) => {
  const connect = useConnect()
  const transaction = useTransaction(config.transaction)
  return { connect, transaction } as const
}

describe('useTransaction', () => {
  it('on mount', async () => {
    const { result } = renderHook(() => useTransaction())
    expect(result.current[0]).toMatchInlineSnapshot(`
      {
        "data": undefined,
        "error": undefined,
        "loading": false,
      }
    `)
    expect(result.current[1]).toBeDefined()
  })

  describe('transaction', () => {
    it('uses config', async () => {
      const { result } = renderHook(() =>
        useTransactionWithConnect({
          transaction,
        }),
      )

      expect(result.current.transaction[0]).toMatchInlineSnapshot(`
        {
          "data": undefined,
          "error": undefined,
          "loading": false,
        }
      `)

      await actHook(async () => {
        const mockConnector = result.current.connect[0].data.connectors[0]
        await result.current.connect[1](mockConnector)
        await result.current.transaction[1]()
      })

      expect(result.current.transaction[0]).toMatchInlineSnapshot(`
        {
          "data": {
            from: "0x012363d61bdc53d0290a0f25e9c89f8257550fb8",
          },
          "error": undefined,
          "loading": false,
        }
      `)
    })

    it('has error', async () => {
      const { result } = renderHook(() => useTransactionWithConnect())

      await actHook(async () => {
        const mockConnector = result.current.connect[0].data.connectors[0]
        await result.current.connect[1](mockConnector)

        const res = await result.current.transaction[1]()
        expect(res).toMatchInlineSnapshot(`
          {
            "data": undefined,
            "error": [Error: request is required],
          }
        `)
      })
    })
  })
})
