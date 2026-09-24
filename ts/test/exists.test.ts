
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { FakeStoreSDK } from '..'


describe('exists', async () => {

  test('test-mode', () => {
    const testsdk = FakeStoreSDK.test()
    equal(testsdk instanceof FakeStoreSDK, true,
      'FakeStoreSDK.test() must return a client synchronously')
  })

})
