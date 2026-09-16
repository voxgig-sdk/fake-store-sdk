"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_path_1 = __importDefault(require("node:path"));
const Fs = __importStar(require("node:fs"));
const node_test_1 = require("node:test");
const node_assert_1 = __importDefault(require("node:assert"));
const live_runner_1 = require("../../live-runner");
const live_entity_1 = require("../../live-entity");
const __1 = require("../../..");
const utility_1 = require("../../utility");
// AFTER the imports on purpose: TypeScript hoists `import` above any
// statement in the emitted CommonJS, so a loader placed above them would
// run only after every imported module had already been evaluated - and
// anything reading process.env at module scope would miss these values.
(0, utility_1.loadEnvLocal)(__dirname + '/../../../.env.local');
(0, node_test_1.describe)('ProductEntity', async () => {
    // Per-test live pacing. Delay is read from sdk-test-control.json's
    // `test.live.delayMs`; only sleeps when FAKE_STORE_TEST_LIVE=TRUE.
    (0, node_test_1.afterEach)((0, utility_1.liveDelay)('FAKE_STORE_TEST_LIVE'));
    (0, node_test_1.test)('instance', async () => {
        const testsdk = __1.FakeStoreSDK.test();
        const ent = testsdk.Product();
        (0, node_assert_1.default)(null != ent);
    });
    (0, node_test_1.test)('basic', async (t) => {
        const live = 'TRUE' === process.env.FAKE_STORE_TEST_LIVE;
        for (const op of ['create', 'list', 'update', 'load', 'remove']) {
            if (!live && (0, utility_1.maybeSkipControl)(t, 'entityOp', 'product.' + op, live))
                return;
        }
        const setup = basicSetup();
        if (setup.live) {
            return (0, live_entity_1.runLiveEntity)(setup, { "active": true, "alias": { "field": {} }, "fields": [{ "active": true, "name": "category", "req": false, "type": "`$STRING`", "index$": 0 }, { "active": true, "name": "description", "req": false, "type": "`$STRING`", "index$": 1 }, { "active": true, "name": "id", "req": false, "type": "`$INTEGER`", "index$": 2 }, { "active": true, "format": "uri", "name": "image", "req": false, "type": "`$STRING`", "index$": 3 }, { "active": true, "format": "float", "name": "price", "req": false, "type": "`$NUMBER`", "index$": 4 }, { "active": true, "name": "title", "req": false, "type": "`$STRING`", "index$": 5 }], "id": { "field": "id", "name": "id" }, "name": "product", "op": { "create": { "input": "data", "name": "create", "points": [{ "active": true, "args": {}, "contract": { "id": "POST /products", "json": "{\"operationId\":\"addProduct\",\"parameters\":[],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"201\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Product created successfully\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "POST", "orig": "/products", "segments": [{ "lit": "products" }], "select": {}, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "create" }, "list": { "input": "data", "name": "list", "points": [{ "active": true, "args": {}, "contract": { "id": "GET /products", "json": "{\"operationId\":\"getAllProducts\",\"parameters\":[],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"items\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"},\"type\":\"array\"}}},\"description\":\"Success\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/products", "segments": [{ "lit": "products" }], "select": {}, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "list" }, "load": { "input": "data", "name": "load", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$INTEGER`", "index$": 0 }] }, "contract": { "id": "GET /products/{id}", "json": "{\"operationId\":\"getProductById\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"integer\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Success\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "GET", "orig": "/products/{id}", "segments": [{ "lit": "products" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "load" }, "remove": { "input": "data", "name": "remove", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$INTEGER`", "index$": 0 }] }, "contract": { "id": "DELETE /products/{id}", "json": "{\"operationId\":\"deleteProduct\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"integer\"}}],\"protocol\":\"http\",\"responses\":{\"200\":{\"description\":\"Product deleted successfully\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "DELETE", "orig": "/products/{id}", "segments": [{ "lit": "products" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "remove" }, "update": { "input": "data", "name": "update", "points": [{ "active": true, "args": { "params": [{ "active": true, "kind": "param", "name": "id", "orig": "id", "reqd": true, "type": "`$INTEGER`", "index$": 0 }] }, "contract": { "id": "PUT /products/{id}", "json": "{\"operationId\":\"updateProduct\",\"parameters\":[{\"in\":\"path\",\"name\":\"id\",\"required\":true,\"schema\":{\"type\":\"integer\"}}],\"protocol\":\"http\",\"requestBody\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"required\":true},\"responses\":{\"200\":{\"content\":{\"application/json\":{\"schema\":{\"properties\":{\"category\":{\"type\":\"string\"},\"description\":{\"type\":\"string\"},\"id\":{\"type\":\"integer\"},\"image\":{\"format\":\"uri\",\"type\":\"string\"},\"price\":{\"format\":\"float\",\"type\":\"number\"},\"title\":{\"type\":\"string\"}},\"type\":\"object\"}}},\"description\":\"Product updated successfully\"},\"400\":{\"description\":\"Bad request\"}},\"securitySource\":\"unspecified\"}", "source": "openapi3", "version": 1 }, "kind": "http", "method": "PUT", "orig": "/products/{id}", "segments": [{ "lit": "products" }, { "var": "id" }], "select": { "exist": ["id"] }, "transform": { "req": "`reqdata`", "res": "`body`" }, "index$": 0 }], "key$": "update" } }, "relations": { "ancestors": [] }, "key$": "product", "name__orig": "product", "Name": "Product", "name_": "product", "name-": "product", "NAME": "PRODUCT", "index$": 2 }, { "active": true, "entity": "product", "key$": "BasicProductFlow", "kind": "basic", "name": "BasicProductFlow", "param": {}, "step": [{ "active": true, "data": {}, "input": { "ref": "product_ref01" }, "match": {}, "op": "create", "spec": [], "valid": [], "index$": 0 }, { "active": true, "data": {}, "input": {}, "match": {}, "op": "list", "spec": [], "valid": [{ "apply": "ItemExists", "def": { "ref": "product_ref01" } }], "index$": 1 }, { "active": true, "data": {}, "input": { "ref": "product_ref01", "srcdatavar": "product_ref01_data", "suffix": "_up0", "textfield": "category" }, "match": {}, "op": "update", "spec": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-product_ref01" } }], "valid": [], "index$": 2 }, { "active": true, "data": {}, "input": { "ref": "product_ref01", "srcdatavar": "product_ref01_data", "suffix": "_dt0" }, "match": { "id": "product01" }, "op": "load", "spec": [], "valid": [{ "apply": "TextFieldMark", "def": { "mark": "Mark01-product_ref01" } }], "index$": 3 }, { "active": true, "data": {}, "input": { "ref": "product_ref01", "suffix": "_rm0" }, "match": { "id": "product01" }, "op": "remove", "spec": [], "valid": [], "index$": 4 }, { "active": true, "data": {}, "input": { "suffix": "_rt0" }, "match": {}, "op": "list", "spec": [], "valid": [{ "apply": "ItemNotExists", "def": { "ref": "product_ref01" } }], "index$": 5 }] }, 'Product');
        }
        const client = setup.client;
        const struct = setup.struct;
        const isempty = struct.isempty;
        const select = struct.select;
        // CREATE
        const product_ref01_ent = client.Product();
        let product_ref01_data = setup.data.new.product['product_ref01'];
        product_ref01_data = (await product_ref01_ent.create(product_ref01_data)).data();
        (0, node_assert_1.default)(null != product_ref01_data.id);
        // LIST
        const product_ref01_match = {};
        const product_ref01_list = (await product_ref01_ent.list(product_ref01_match)).map((e) => e.data());
        (0, node_assert_1.default)(!isempty(select(product_ref01_list, { id: product_ref01_data.id })));
        // UPDATE
        const product_ref01_data_up0 = {};
        product_ref01_data_up0.id = product_ref01_data.id;
        const product_ref01_markdef_up0 = { name: 'category', value: 'Mark01-product_ref01_' + setup.now };
        product_ref01_data_up0[product_ref01_markdef_up0.name] = product_ref01_markdef_up0.value;
        const product_ref01_resdata_up0 = (await product_ref01_ent.update(product_ref01_data_up0)).data();
        (0, node_assert_1.default)(product_ref01_resdata_up0.id === product_ref01_data_up0.id);
        (0, node_assert_1.default)(product_ref01_resdata_up0[product_ref01_markdef_up0.name] === product_ref01_markdef_up0.value);
        // LOAD
        const product_ref01_match_dt0 = {};
        product_ref01_match_dt0.id = product_ref01_data.id;
        const product_ref01_data_dt0 = (await product_ref01_ent.load(product_ref01_match_dt0)).data();
        (0, node_assert_1.default)(product_ref01_data_dt0.id === product_ref01_data.id);
        // REMOVE
        const product_ref01_match_rm0 = { id: product_ref01_data.id };
        await product_ref01_ent.remove(product_ref01_match_rm0);
        // LIST
        const product_ref01_match_rt0 = {};
        const product_ref01_list_rt0 = (await product_ref01_ent.list(product_ref01_match_rt0)).map((e) => e.data());
        (0, node_assert_1.default)(isempty(select(product_ref01_list_rt0, { id: product_ref01_data.id })));
    });
});
function basicSetup(extra) {
    // TODO: fix test def options
    const options = {}; // null
    // TODO: needs test utility to resolve path
    const entityDataFile = node_path_1.default.resolve(__dirname, '../../../../.sdk/test/entity/product/ProductTestData.json');
    // TODO: file ready util needed?
    const entityDataSource = Fs.readFileSync(entityDataFile).toString('utf8');
    // TODO: need a xlang JSON parse utility in voxgig/struct with better error msgs
    const entityData = JSON.parse(entityDataSource);
    options.entity = entityData.existing;
    let client = __1.FakeStoreSDK.test(options, extra);
    const struct = client.utility().struct;
    const merge = struct.merge;
    const transform = struct.transform;
    let idmap = transform(['product01', 'product02', 'product03'], {
        '`$PACK`': ['', {
                '`$KEY`': '`$COPY`',
                '`$VAL`': ['`$FORMAT`', 'upper', '`$COPY`']
            }]
    });
    const env = (0, utility_1.envOverride)({
        'FAKE_STORE_TEST_PRODUCT_ENTID': idmap,
        'FAKE_STORE_TEST_LIVE': 'FALSE',
        'FAKE_STORE_TEST_EXPLAIN': 'FALSE',
    });
    idmap = env['FAKE_STORE_TEST_PRODUCT_ENTID'];
    const live = 'TRUE' === env.FAKE_STORE_TEST_LIVE;
    const transport = (0, live_runner_1.createLiveTransport)();
    if (live) {
        const rawIds = process.env['FAKE_STORE_TEST_PRODUCT_ENTID'];
        idmap = rawIds && rawIds.trim() ? JSON.parse(rawIds) : {};
        if (!idmap || Array.isArray(idmap) || typeof idmap !== 'object') {
            throw new Error('Live ENTID must be a JSON object');
        }
        client = new __1.FakeStoreSDK(merge([
            // FIRST, so the generated fields below win: sdk-test-control.json's
            // test.client.options adds to the live client, it does not redirect it.
            (0, utility_1.liveClientOptions)(),
            {},
            // 'extra || {}', not a bare 'extra': struct.merge returns UNDEFINED when the
            // last entry is undefined, and basicSetup is normally called with no
            // argument at all - so a bare 'extra' silently discarded the apikey
            // and server values above and handed the SDK undefined. Harmless
            // while there was nothing in that object; not harmless now.
            extra || {},
            { system: { fetch: transport.fetch } }
        ]));
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
    };
    return setup;
}
//# sourceMappingURL=ProductEntity.test.js.map