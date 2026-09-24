

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
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"id":{"a":true,"h":"Id","n":"id","r":false,"t":"`$INTEGER`","key$":"id","index$":0},"products":{"a":true,"h":"Products","n":"products","r":false,"t":"`$ARRAY`","key$":"products","index$":1},"userId":{"a":true,"h":"User Id","n":"userId","r":false,"t":"`$INTEGER`","key$":"userId","index$":2}},"id":{"field":"id","name":"id"},"name":"cart","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /carts","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/carts","q":{},"r":{},"s":[{"lit":"carts"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"},"list":{"input":"data","name":"list","points":[{"a":true,"co":{"id":"GET /carts","source":"openapi3","version":2},"g":{},"k":"http","m":"GET","o":"/carts","q":{},"r":{},"s":[{"lit":"carts"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"list"},"load":{"input":"data","name":"load","points":[{"a":true,"co":{"id":"GET /carts/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"GET","o":"/carts/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"carts"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"load"},"remove":{"input":"data","name":"remove","points":[{"a":true,"co":{"id":"DELETE /carts/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"DELETE","o":"/carts/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"carts"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"remove"},"update":{"input":"data","name":"update","points":[{"a":true,"co":{"id":"PUT /carts/{id}","source":"openapi3","version":2},"g":{"params":[{"a":true,"k":"param","n":"id","or":"id","r":true,"t":"`$INTEGER`","index$":0}]},"k":"http","m":"PUT","o":"/carts/{id}","q":{"exist":["id"]},"r":{},"s":[{"lit":"carts"},{"var":"id"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"update"}},"relations":{"ancestors":[]},"key$":"cart","name__orig":"cart","Name":"Cart","name_":"cart","name-":"cart","NAME":"CART","index$":0}, {"active":true,"entity":"cart","key$":"BasicCartFlow","kind":"basic","name":"BasicCartFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"cart_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0},{"a":true,"d":{},"i":{},"m":{},"o":"list","s":[],"v":[{"apply":"ItemExists","def":{"ref":"cart_ref01"}}],"index$":1},{"a":true,"d":{},"i":{"ref":"cart_ref01","srcdatavar":"cart_ref01_data","suffix":"_up0"},"m":{},"o":"update","s":[{"apply":"TextFieldMark","def":{"mark":"Mark01-cart_ref01"}}],"v":[],"index$":2},{"a":true,"d":{},"i":{"ref":"cart_ref01","srcdatavar":"cart_ref01_data","suffix":"_dt0"},"m":{"id":"cart01"},"o":"load","s":[],"v":[{"apply":"TextFieldMark","def":{"mark":"Mark01-cart_ref01"}}],"index$":3},{"a":true,"d":{},"i":{"ref":"cart_ref01","suffix":"_rm0"},"m":{"id":"cart01"},"o":"remove","s":[],"v":[],"index$":4},{"a":true,"d":{},"i":{"suffix":"_rt0"},"m":{},"o":"list","s":[],"v":[{"apply":"ItemNotExists","def":{"ref":"cart_ref01"}}],"index$":5}]}, 'Cart', {"POST /carts":{"protocol":"http","operationId":"addCart","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"userId":{"type":"integer","key$":"userId"},"products":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"title":{"type":"string","key$":"title"},"price":{"type":"number","format":"float","key$":"price"},"description":{"type":"string","key$":"description"},"category":{"type":"string","key$":"category"},"image":{"type":"string","format":"uri","key$":"image"}},"x-ref":"#/components/schemas/Product"},"key$":"products"}},"x-ref":"#/components/schemas/Cart","index$":1}}}},"responses":{"201":{"description":"Cart created successfully","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"userId":{"type":"integer","key$":"userId"},"products":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"title":{"type":"string","key$":"title"},"price":{"type":"number","format":"float","key$":"price"},"description":{"type":"string","key$":"description"},"category":{"type":"string","key$":"category"},"image":{"type":"string","format":"uri","key$":"image"}},"x-ref":"#/components/schemas/Product"},"key$":"products"}},"x-ref":"#/components/schemas/Cart"}}}},"400":{"description":"Bad request"}},"parameters":[],"securitySource":"unspecified"},"GET /carts":{"protocol":"http","operationId":"getAllCarts","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"userId":{"type":"integer","key$":"userId"},"products":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"title":{"type":"string","key$":"title"},"price":{"type":"number","format":"float","key$":"price"},"description":{"type":"string","key$":"description"},"category":{"type":"string","key$":"category"},"image":{"type":"string","format":"uri","key$":"image"}},"x-ref":"#/components/schemas/Product"},"key$":"products"}},"x-ref":"#/components/schemas/Cart","index$":0}}}}},"400":{"description":"Bad request"}},"parameters":[],"securitySource":"unspecified"},"GET /carts/{id}":{"protocol":"http","operationId":"getCartById","responses":{"200":{"description":"Success","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"userId":{"type":"integer","key$":"userId"},"products":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"title":{"type":"string","key$":"title"},"price":{"type":"number","format":"float","key$":"price"},"description":{"type":"string","key$":"description"},"category":{"type":"string","key$":"category"},"image":{"type":"string","format":"uri","key$":"image"}},"x-ref":"#/components/schemas/Product"},"key$":"products"}},"x-ref":"#/components/schemas/Cart","index$":0}}}},"400":{"description":"Bad request"}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer"},"index$":0}],"securitySource":"unspecified"},"DELETE /carts/{id}":{"protocol":"http","operationId":"deleteCart","responses":{"200":{"description":"Cart deleted successfully"},"400":{"description":"Bad request"}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer"},"index$":0}],"securitySource":"unspecified"},"PUT /carts/{id}":{"protocol":"http","operationId":"updateCart","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"userId":{"type":"integer","key$":"userId"},"products":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"title":{"type":"string","key$":"title"},"price":{"type":"number","format":"float","key$":"price"},"description":{"type":"string","key$":"description"},"category":{"type":"string","key$":"category"},"image":{"type":"string","format":"uri","key$":"image"}},"x-ref":"#/components/schemas/Product"},"key$":"products"}},"x-ref":"#/components/schemas/Cart","index$":1}}}},"responses":{"200":{"description":"Cart updated successfully","content":{"application/json":{"schema":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"userId":{"type":"integer","key$":"userId"},"products":{"type":"array","items":{"type":"object","properties":{"id":{"type":"integer","key$":"id"},"title":{"type":"string","key$":"title"},"price":{"type":"number","format":"float","key$":"price"},"description":{"type":"string","key$":"description"},"category":{"type":"string","key$":"category"},"image":{"type":"string","format":"uri","key$":"image"}},"x-ref":"#/components/schemas/Product"},"key$":"products"}},"x-ref":"#/components/schemas/Cart","index$":0}}}},"400":{"description":"Bad request"}},"parameters":[{"name":"id","in":"path","required":true,"schema":{"type":"integer"},"index$":0}],"securitySource":"unspecified"}})
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
  
