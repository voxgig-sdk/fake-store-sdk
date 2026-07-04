
const envlocal = __dirname + '/../../../.env.local'
require('dotenv').config({ quiet: true, path: [envlocal] })

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'


import { FakeStoreSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveDelay,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


describe('ProductEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when FAKESTORE_TEST_LIVE=TRUE.
  afterEach(liveDelay('FAKESTORE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = FakeStoreSDK.test()
    const ent = testsdk.Product()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.FAKE_STORE_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'load', 'remove']) {
      if (maybeSkipControl(t, 'entityOp', 'product.' + op, live)) return
    }

    const setup = basicSetup()
    // The basic flow consumes synthetic IDs and field values from the
    // fixture (entity TestData.json). Those don't exist on the live API.
    // Skip live runs unless the user provided a real ENTID env override.
    if (setup.syntheticOnly) {
      t.skip('live entity test uses synthetic IDs from fixture — set FAKE_STORE_TEST_PRODUCT_ENTID JSON to run live')
      return
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const product_ref01_ent = client.Product()
    let product_ref01_data = setup.data.new.product['product_ref01']

    product_ref01_data = await product_ref01_ent.create(product_ref01_data)
    assert(null != product_ref01_data.id)


    // LIST
    const product_ref01_match: any = {}

    const product_ref01_list = await product_ref01_ent.list(product_ref01_match)

    assert(!isempty(select(product_ref01_list, { id: product_ref01_data.id })))


    // UPDATE
    const product_ref01_data_up0: any = {}
    product_ref01_data_up0.id = product_ref01_data.id

    const product_ref01_markdef_up0 = { name: 'category', value: 'Mark01-product_ref01_' + setup.now }
    product_ref01_data_up0 [product_ref01_markdef_up0.name] = product_ref01_markdef_up0.value

    const product_ref01_resdata_up0 = await product_ref01_ent.update(product_ref01_data_up0)
    assert(product_ref01_resdata_up0.id === product_ref01_data_up0.id)

    assert(product_ref01_resdata_up0[product_ref01_markdef_up0.name] === product_ref01_markdef_up0.value)


    // LOAD
    const product_ref01_match_dt0: any = {}
    product_ref01_match_dt0.id = product_ref01_data.id
    const product_ref01_data_dt0 = await product_ref01_ent.load(product_ref01_match_dt0)
    assert(product_ref01_data_dt0.id === product_ref01_data.id)


    // REMOVE
    const product_ref01_match_rm0: any = { id: product_ref01_data.id }
    await product_ref01_ent.remove(product_ref01_match_rm0)
  

    // LIST
    const product_ref01_match_rt0: any = {}

    const product_ref01_list_rt0 = await product_ref01_ent.list(product_ref01_match_rt0)

    assert(isempty(select(product_ref01_list_rt0, { id: product_ref01_data.id })))


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/product/ProductTestData.json')

  // TODO: file ready util needed?
  const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8')

  // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
  const entityData = JSON.parse(entityDataSource)

  options.entity = entityData.existing

  let client = FakeStoreSDK.test(options, extra)
  const struct = client.utility().struct
  const merge = struct.merge
  const transform = struct.transform

  let idmap = transform(
    ['product01','product02','product03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  // Detect whether the user provided a real ENTID JSON via env var. The
  // basic flow consumes synthetic IDs from the fixture file; without an
  // override those synthetic IDs reach the live API and 4xx. Surface this
  // to the test so it can skip rather than fail.
  const idmapEnvVal = process.env['FAKE_STORE_TEST_PRODUCT_ENTID']
  const idmapOverridden = null != idmapEnvVal && idmapEnvVal.trim().startsWith('{')

  const env = envOverride({
    'FAKE_STORE_TEST_PRODUCT_ENTID': idmap,
    'FAKE_STORE_TEST_LIVE': 'FALSE',
    'FAKE_STORE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['FAKE_STORE_TEST_PRODUCT_ENTID']

  const live = 'TRUE' === env.FAKE_STORE_TEST_LIVE

  if (live) {
    client = new FakeStoreSDK(merge([
      {
      },
      extra
    ]))
  }

  const setup = {
    idmap,
    env,
    options,
    client,
    struct,
    data: entityData,
    explain: 'TRUE' === env.FAKE_STORE_TEST_EXPLAIN,
    live,
    syntheticOnly: live && !idmapOverridden,
    now: Date.now(),
  }

  return setup
}
  
