
import { test, describe } from 'node:test'
import { equal } from 'node:assert'


import { FakeStoreSDK } from '..'


describe('exists', async () => {

  test('test-mode', async () => {
    const testsdk = await FakeStoreSDK.test()
    equal(null !== testsdk, true)
  })

})
