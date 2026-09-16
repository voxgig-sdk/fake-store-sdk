

import Path from 'node:path'
import * as Fs from 'node:fs'

import { test, describe, afterEach } from 'node:test'
import assert from 'node:assert'
import { createLiveTransport } from '../../live-runner'
import { runLiveEntity } from '../../live-entity'


import { FakeStoreSDK, BaseFeature, stdutil } from '../../..'

import {
  envOverride,
  liveClientOptions,
  liveDelay,
  loadEnvLocal,
  makeCtrl,
  makeMatch,
  makeReqdata,
  makeStepData,
  makeValid,
  maybeSkipControl,
} from '../../utility'


// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
loadEnvLocal(__dirname + '/../../../.env.local')


describe('CartEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when FAKE_STORE_TEST_LIVE=TRUE.
  afterEach(liveDelay('FAKE_STORE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = FakeStoreSDK.test()
    const ent = testsdk.Cart()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.FAKE_STORE_TEST_LIVE
    for (const op of ['create', 'list', 'update', 'load', 'remove']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'cart.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":[{"active":true,"name":"id","req":false,"type":"`$INTEGER`","index$":0},{"active":true,"name":"products","req":false,"type":"`$ARRAY`","index$":1},{"active":true,"name":"userId","req":false,"type":"`$INTEGER`","index$":2}],"id":{"field":"id","name":"id"},"name":"cart","op":{"create":{"input":"data","name":"create","points":[{"active":true,"args":{},"contract":{"id":"POST /carts","json":"{\"operationId\":\"addCart\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"id\":{\"type\":\"integer\"},\"products\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"userId\":{\"type\":\"integer\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"201\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"id\":{\"type\":\"integer\"},\"products\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"userId\":{\"type\":\"integer\"}},\"type\":\"object\"}}},\"description\":\"Cart created successfully\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"POST","orig":"/carts","segments":[{"lit":"carts"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"active":true,"args":{},"contract":{"id":"GET /carts","json":"{\"operationId\":\"getAllCarts\",\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"items\":{\"properties\":{\"id\":{\"type\":\"integer\"},\"products\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"userId\":{\"type\":\"integer\"}},\"type\":\"object\"},\"type\":\"array\"}}},\"description\":\"Success\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/carts","segments":[{"lit":"carts"}],"select":{},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$INTEGER`","index$":0}]},"contract":{"id":"GET /carts/{id}","json":"{\"operationId\":\"getCartById\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"integer\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"id\":{\"type\":\"integer\"},\"products\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"userId\":{\"type\":\"integer\"}},\"type\":\"object\"}}},\"description\":\"Success\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"GET","orig":"/carts/{id}","segments":[{"lit":"carts"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$INTEGER`","index$":0}]},"contract":{"id":"DELETE /carts/{id}","json":"{\"operationId\":\"deleteCart\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"integer\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"description\":\"Cart deleted successfully\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"DELETE","orig":"/carts/{id}","segments":[{"lit":"carts"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"active":true,"args":{"params":[{"active":true,"kind":"param","name":"id","orig":"id","reqd":true,"type":"`$INTEGER`","index$":0}]},"contract":{"id":"PUT /carts/{id}","json":"{\"operationId\":\"updateCart\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"integer\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"id\":{\"type\":\"integer\"},\"products\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"userId\":{\"type\":\"integer\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"id\":{\"type\":\"integer\"},\"products\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"},\"userId\":{\"type\":\"integer\"}},\"type\":\"object\"}}},\"description\":\"Cart updated successfully\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}","source":"openapi3","version":1},"kind":"http","method":"PUT","orig":"/carts/{id}","segments":[{"lit":"carts"},{"var":"id"}],"select":{"exist":["id"]},"transform":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"cart","name__orig":"cart","Name":"Cart","name_":"cart","name-":"cart","NAME":"CART","index$":0}, {"active":true,"entity":"cart","key$":"BasicCartFlow","kind":"basic","name":"BasicCartFlow","param":{},"step":[{"active":true,"data":{},"input":{"ref":"cart_ref01"},"match":{},"op":"create","spec":[],"valid":[],"index$":0},{"active":true,"data":{},"input":{},"match":{},"op":"list","spec":[],"valid":[{"apply":"ItemExists","def":{"ref":"cart_ref01"}}],"index$":1},{"active":true,"data":{},"input":{"ref":"cart_ref01","srcdatavar":"cart_ref01_data","suffix":"_up0"},"match":{},"op":"update","spec":[{"apply":"TextFieldMark","def":{"mark":"Mark01-cart_ref01"}}],"valid":[],"index$":2},{"active":true,"data":{},"input":{"ref":"cart_ref01","srcdatavar":"cart_ref01_data","suffix":"_dt0"},"match":{"id":"cart01"},"op":"load","spec":[],"valid":[{"apply":"TextFieldMark","def":{"mark":"Mark01-cart_ref01"}}],"index$":3},{"active":true,"data":{},"input":{"ref":"cart_ref01","suffix":"_rm0"},"match":{"id":"cart01"},"op":"remove","spec":[],"valid":[],"index$":4},{"active":true,"data":{},"input":{"suffix":"_rt0"},"match":{},"op":"list","spec":[],"valid":[{"apply":"ItemNotExists","def":{"ref":"cart_ref01"}}],"index$":5}]}, 'Cart')
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const cart_ref01_ent = client.Cart()
    let cart_ref01_data = setup.data.new.cart['cart_ref01']

    cart_ref01_data = (await cart_ref01_ent.create(cart_ref01_data)).data()
    assert(null != cart_ref01_data.id)


    // LIST
    const cart_ref01_match: any = {}

    const cart_ref01_list = (await cart_ref01_ent.list(cart_ref01_match)).map((e: any) => e.data())

    assert(!isempty(select(cart_ref01_list, { id: cart_ref01_data.id })))


    // UPDATE
    const cart_ref01_data_up0: any = {}
    cart_ref01_data_up0.id = cart_ref01_data.id

    const cart_ref01_resdata_up0 = (await cart_ref01_ent.update(cart_ref01_data_up0)).data()
    assert(cart_ref01_resdata_up0.id === cart_ref01_data_up0.id)


    // LOAD
    const cart_ref01_match_dt0: any = {}
    cart_ref01_match_dt0.id = cart_ref01_data.id
    const cart_ref01_data_dt0 = (await cart_ref01_ent.load(cart_ref01_match_dt0)).data()
    assert(cart_ref01_data_dt0.id === cart_ref01_data.id)


    // REMOVE
    const cart_ref01_match_rm0: any = { id: cart_ref01_data.id }
    await cart_ref01_ent.remove(cart_ref01_match_rm0)
  

    // LIST
    const cart_ref01_match_rt0: any = {}

    const cart_ref01_list_rt0 = (await cart_ref01_ent.list(cart_ref01_match_rt0)).map((e: any) => e.data())

    assert(isempty(select(cart_ref01_list_rt0, { id: cart_ref01_data.id })))


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/cart/CartTestData.json')

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
    ['cart01','cart02','cart03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'FAKE_STORE_TEST_CART_ENTID': idmap,
    'FAKE_STORE_TEST_LIVE': 'FALSE',
    'FAKE_STORE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['FAKE_STORE_TEST_CART_ENTID']

  const live = 'TRUE' === env.FAKE_STORE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['FAKE_STORE_TEST_CART_ENTID']
    idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {}
    if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
      throw new Error('Live ENTID must be a JSON object')
    }
    client = new FakeStoreSDK(merge([
      // FIRST, so the generated fields below win: sdk-test-control.json's
      // test.client.options adds to the live client, it does not redirect it.
      liveClientOptions(),
      {
      },
      // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
      // last entry is undefined, and basicSetup is normally called with no
      // argument at all - so a bare 'extra' silently discarded the apikey
      // and server values above and handed the SDK undefined. Harmless
      // while there was nothing in that object; not harmless now.
      extra || {},
      { system: { fetch: transport.fetch } }
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
    transport,
    now: Date.now(),
  }

  return setup
}
  
