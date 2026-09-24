

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


describe('LoginEntity', async () => {

  // Per-test live pacing. Delay is read from sdk-test-control.json's
  // `test.live.delayMs`; only sleeps when FAKE_STORE_TEST_LIVE=TRUE.
  afterEach(liveDelay('FAKE_STORE_TEST_LIVE'))

  test('instance', async () => {
    const testsdk = FakeStoreSDK.test()
    const ent = testsdk.Login()
    assert(null != ent)
  })


  test('basic', async (t) => {

    const live = 'TRUE' === process.env.FAKE_STORE_TEST_LIVE
    for (const op of ['create']) {
      if (!live && maybeSkipControl(t, 'entityOp', 'login.' + op, live)) return
    }

    
    const setup = basicSetup()
    if (setup.live) {
      return runLiveEntity(setup, {"active":true,"alias":{"field":{}},"fields":{"password":{"a":true,"h":"Password","n":"password","r":false,"t":"`$STRING`","key$":"password","index$":0},"token":{"a":true,"h":"Token","n":"token","r":false,"t":"`$STRING`","key$":"token","index$":1},"username":{"a":true,"h":"Username","n":"username","r":false,"t":"`$STRING`","key$":"username","index$":2}},"name":"login","op":{"create":{"input":"data","name":"create","points":[{"a":true,"co":{"id":"POST /auth/login","source":"openapi3","version":2},"g":{},"k":"http","m":"POST","o":"/auth/login","q":{},"r":{},"s":[{"lit":"auth"},{"lit":"login"}],"t":{"req":"`reqdata`","res":"`body`"},"index$":0}],"key$":"create"}},"relations":{"ancestors":[]},"key$":"login","name__orig":"login","Name":"Login","name_":"login","name-":"login","NAME":"LOGIN","index$":1}, {"active":true,"entity":"login","key$":"BasicLoginFlow","kind":"basic","name":"BasicLoginFlow","param":{},"step":[{"a":true,"d":{},"i":{"ref":"login_ref01"},"m":{},"o":"create","s":[],"v":[],"index$":0}]}, 'Login', {"POST /auth/login":{"protocol":"http","operationId":"loginUser","requestBody":{"required":true,"content":{"application/json":{"schema":{"type":"object","properties":{"username":{"type":"string","key$":"username"},"password":{"type":"string","key$":"password"}},"x-ref":"#/components/schemas/Login","index$":1}}}},"responses":{"200":{"description":"Login successful","content":{"application/json":{"schema":{"type":"object","properties":{"token":{"type":"string","key$":"token"}},"x-ref":"#/components/schemas/LoginResponse","index$":0}}}},"400":{"description":"Bad request"}},"parameters":[],"securitySource":"unspecified"}})
    }
    const client = setup.client
    const struct = setup.struct

    const isempty = struct.isempty
    const select = struct.select


    // CREATE
    const login_ref01_ent = client.Login()
    let login_ref01_data = setup.data.new.login['login_ref01']

    login_ref01_data = (await login_ref01_ent.create(login_ref01_data)).data()
    assert(null != login_ref01_data)


  })
})



function basicSetup(extra?: any) {
  // TODO: fix test def options
  const options: any = {} // null

  // TODO: needs test utility to resolve path
  const entityDataFile =
    Path.resolve(__dirname, 
      '../../../../.sdk/test/entity/login/LoginTestData.json')

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
    ['login01','login02','login03'],
    {
      '`$PACK`': ['', {
        '`$KEY`': '`$COPY`',
        '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
      }]
    })

  const env = envOverride({
    'FAKE_STORE_TEST_LOGIN_ENTID': idmap,
    'FAKE_STORE_TEST_LIVE': 'FALSE',
    'FAKE_STORE_TEST_EXPLAIN': 'FALSE',
  })

  idmap = env['FAKE_STORE_TEST_LOGIN_ENTID']

  const live = 'TRUE' === env.FAKE_STORE_TEST_LIVE

  const transport = createLiveTransport()
  if (live) {
    const rawIds = process.env['FAKE_STORE_TEST_LOGIN_ENTID']
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
  
