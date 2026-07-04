# FakeStore TypeScript SDK



The TypeScript SDK for the FakeStore API — a type-safe, entity-oriented client with full async/await support.

> Other languages, the CLI, and MCP server live alongside this one — see
> the [top-level README](../README.md).


## Install
This package is not yet published to npm. Install it from the GitHub
release tag (`ts/vX.Y.Z`):

- Releases: [https://github.com/voxgig-sdk/fake-store-sdk/releases](https://github.com/voxgig-sdk/fake-store-sdk/releases)


## Tutorial: your first API call

This tutorial walks through creating a client, listing entities, and
loading a specific record.

### 1. Create a client

```ts
import { FakeStoreSDK } from '@voxgig-sdk/fake-store'

const client = new FakeStoreSDK()
```

### 2. List cart records

`list()` resolves to an array of Cart objects — iterate it directly:

```ts
const carts = await client.Cart().list()

for (const cart of carts) {
  console.log(cart)
}
```

### 3. Load a cart

`load()` returns the entity directly and throws on failure:

```ts
try {
  const cart = await client.Cart().load({ id: 'example_id' })
  console.log(cart)
} catch (err) {
  console.error('load failed:', err)
}
```

### 4. Create, update, and remove

```ts
// Create — returns the created Cart
const created = await client.Cart().create({
  name: 'Example',
})

// Update — the id comes straight off the returned entity
const updated = await client.Cart().update({
  id: created.id,
  name: 'Example-Renamed',
})

// Remove
await client.Cart().remove({
  id: created.id,
})
```


## How-to guides

### Make a direct HTTP request

For endpoints not covered by entity methods:

```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})

if (result instanceof Error) {
  throw result
}
if (result.ok) {
  console.log(result.status)  // 200
  console.log(result.data)    // response body
}
```

### Prepare a request without sending it

```ts
const fetchdef = await client.prepare({
  path: '/api/resource/{id}',
  method: 'DELETE',
  params: { id: 'example' },
})

// Inspect before sending
console.log(fetchdef.url)
console.log(fetchdef.method)
console.log(fetchdef.headers)
```

### Use test mode

Create a mock client for unit testing — no server required:

```ts
const client = FakeStoreSDK.test()

const cart = await client.Cart().load({ id: 'test01' })
// cart is a bare entity populated with mock response data
console.log(cart)
```

You can also use the instance method:

```ts
const client = new FakeStoreSDK()
const testClient = client.tester()
```

### Retain entity state across calls

Entity instances remember their last match and data:

```ts
const entity = client.Cart()

// First call sets internal match
await entity.load({ id: 'example' })

// Subsequent calls reuse the stored match
const data = entity.data()
console.log(data.id) // 'example'
```

### Add custom middleware

Pass features via the `extend` option:

```ts
const logger = {
  hooks: {
    PreRequest: (ctx: any) => {
      console.log('Requesting:', ctx.spec.method, ctx.spec.path)
    },
    PreResponse: (ctx: any) => {
      console.log('Status:', ctx.out.request?.status)
    },
  },
}

const client = new FakeStoreSDK({
  extend: [logger],
})
```

### Run live tests

Create a `.env.local` file at the project root:

```
FAKE_STORE_TEST_LIVE=TRUE
```

Then run:

```bash
cd ts && npm test
```


## Reference

### FakeStoreSDK

#### Constructor

```ts
new FakeStoreSDK(options?: {
  base?: string
  prefix?: string
  suffix?: string
  feature?: Record<string, { active: boolean }>
  extend?: Feature[]
})
```

| Option | Type | Description |
| --- | --- | --- |
| `base` | `string` | Base URL of the API server. |
| `prefix` | `string` | URL path prefix prepended to all requests. |
| `suffix` | `string` | URL path suffix appended to all requests. |
| `feature` | `object` | Feature activation flags (e.g. `{ test: { active: true } }`). |
| `extend` | `Feature[]` | Additional feature instances to load. |

#### Methods

| Method | Returns | Description |
| --- | --- | --- |
| `options()` | `object` | Deep copy of current SDK options. |
| `utility()` | `Utility` | Deep copy of the SDK utility object. |
| `prepare(fetchargs?)` | `Promise<FetchDef>` | Build an HTTP request definition without sending it. |
| `direct(fetchargs?)` | `Promise<DirectResult>` | Build and send an HTTP request. |
| `Cart(data?)` | `CartEntity` | Create a Cart entity instance. |
| `Login(data?)` | `LoginEntity` | Create a Login entity instance. |
| `Product(data?)` | `ProductEntity` | Create a Product entity instance. |
| `User(data?)` | `UserEntity` | Create an User entity instance. |
| `tester(testopts?, sdkopts?)` | `FakeStoreSDK` | Create a test-mode client instance. |

#### Static methods

| Method | Returns | Description |
| --- | --- | --- |
| `FakeStoreSDK.test(testopts?, sdkopts?)` | `FakeStoreSDK` | Create a test-mode client. |

### Entity interface

All entities share the same interface.

#### Methods

| Method | Signature | Description |
| --- | --- | --- |
| `load` | `load(reqmatch?, ctrl?): Promise<Entity>` | Load a single entity by match criteria. |
| `list` | `list(reqmatch?, ctrl?): Promise<Entity[]>` | List entities matching the criteria. |
| `create` | `create(reqdata?, ctrl?): Promise<Entity>` | Create a new entity. |
| `update` | `update(reqdata?, ctrl?): Promise<Entity>` | Update an existing entity. |
| `remove` | `remove(reqmatch?, ctrl?): Promise<void>` | Remove an entity. |
| `data` | `data(data?): any` | Get or set entity data. |
| `match` | `match(match?): any` | Get or set entity match criteria. |
| `make` | `make(): Entity` | Create a new instance with the same options. |
| `client` | `client(): FakeStoreSDK` | Return the parent SDK client. |
| `entopts` | `entopts(): object` | Return a copy of the entity options. |

#### Return values

Entity operations resolve to the entity data directly — there is no
result envelope:

- `load`, `create` and `update` resolve to a single entity object.
- `list` resolves to an **array** of entity objects (iterate it directly;
  there is no `.data` and no `.ok`).
- `remove` resolves to `void`.

On a failed request these methods **throw**, so wrap calls in
`try`/`catch` to handle errors. Only `direct()` returns the result
envelope described below.

### DirectResult shape

The `direct()` method returns:

```ts
{
  ok: boolean
  status: number
  headers: object
  data: any
}
```

On error, `ok` is `false` and an `err` property contains the error.

### FetchDef shape

The `prepare()` method returns:

```ts
{
  url: string
  method: string
  headers: Record<string, string>
  body?: any
}
```

### Entities

#### Cart

| Field | Description |
| --- | --- |
| `id` |  |
| `product` |  |
| `user_id` |  |

Operations: create, list, load, remove, update.

API path: `/carts`

#### Login

| Field | Description |
| --- | --- |
| `password` |  |
| `token` |  |
| `username` |  |

Operations: create.

API path: `/auth/login`

#### Product

| Field | Description |
| --- | --- |
| `category` |  |
| `description` |  |
| `id` |  |
| `image` |  |
| `price` |  |
| `title` |  |

Operations: create, list, load, remove, update.

API path: `/products`

#### User

| Field | Description |
| --- | --- |
| `email` |  |
| `id` |  |
| `password` |  |
| `username` |  |

Operations: create, list, load, remove, update.

API path: `/users`



## Entities


### Cart

Create an instance: `const cart = client.Cart()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `id` | ``$INTEGER`` |  |
| `product` | ``$ARRAY`` |  |
| `user_id` | ``$INTEGER`` |  |

#### Example: Load

```ts
const cart = await client.Cart().load({ id: 'cart_id' })
```

#### Example: List

```ts
const carts = await client.Cart().list()
```

#### Example: Create

```ts
const cart = await client.Cart().create({
})
```


### Login

Create an instance: `const login = client.Login()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `password` | ``$STRING`` |  |
| `token` | ``$STRING`` |  |
| `username` | ``$STRING`` |  |

#### Example: Create

```ts
const login = await client.Login().create({
})
```


### Product

Create an instance: `const product = client.Product()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `category` | ``$STRING`` |  |
| `description` | ``$STRING`` |  |
| `id` | ``$INTEGER`` |  |
| `image` | ``$STRING`` |  |
| `price` | ``$NUMBER`` |  |
| `title` | ``$STRING`` |  |

#### Example: Load

```ts
const product = await client.Product().load({ id: 'product_id' })
```

#### Example: List

```ts
const products = await client.Product().list()
```

#### Example: Create

```ts
const product = await client.Product().create({
})
```


### User

Create an instance: `const user = client.User()`

#### Operations

| Method | Description |
| --- | --- |
| `create(data)` | Create a new entity with the given data. |
| `list(match)` | List entities matching the criteria. |
| `load(match)` | Load a single entity by match criteria. |
| `remove(match)` | Remove the matching entity. |
| `update(data)` | Update an existing entity. |

#### Fields

| Field | Type | Description |
| --- | --- | --- |
| `email` | ``$STRING`` |  |
| `id` | ``$INTEGER`` |  |
| `password` | ``$STRING`` |  |
| `username` | ``$STRING`` |  |

#### Example: Load

```ts
const user = await client.User().load({ id: 'user_id' })
```

#### Example: List

```ts
const users = await client.User().list()
```

#### Example: Create

```ts
const user = await client.User().create({
})
```


## Explanation

### The operation pipeline

Every entity operation (load, list, create, update, remove) follows a
six-stage pipeline. Each stage fires a feature hook before executing:

```
PrePoint → PreSpec → PreRequest → PreResponse → PreResult → PreDone
```

- **PrePoint**: Resolves which API endpoint to call based on the
  operation name and entity configuration.
- **PreSpec**: Builds the HTTP spec — URL, method, headers, body —
  from the resolved point and the caller's parameters.
- **PreRequest**: Sends the HTTP request. Features can intercept here
  to replace the transport (as TestFeature does with mocks).
- **PreResponse**: Parses the raw HTTP response.
- **PreResult**: Extracts the business data from the parsed response.
- **PreDone**: Final stage before returning to the caller. Entity
  state (match, data) is updated here.

If any stage returns an error, the pipeline short-circuits and the
error is returned to the caller.

An unexpected exception triggers the `PreUnexpected` hook before
propagating.

### Features and hooks

Features are the extension mechanism. A feature is an object with a
`hooks` map. Each hook key is a pipeline stage name, and the value is
a function that receives the context.

The SDK ships with built-in features:

- **TestFeature**: In-memory mock transport for testing without a live server

Features are initialized in order. Hooks fire in the order features
were added, so later features can override earlier ones.

### Module structure

```
fake-store/
├── src/
│   ├── FakeStoreSDK.ts        # Main SDK class
│   ├── entity/             # Entity implementations
│   ├── feature/            # Built-in features (Base, Test, Log)
│   └── utility/            # Utility functions
├── test/                   # Test suites
└── dist/                   # Compiled output
```

Import the SDK from the package root:

```ts
import { FakeStoreSDK } from '@voxgig-sdk/fake-store'
```

### Entity state

Entity instances are stateful. After a successful `load`, the entity
stores the returned data and match criteria internally. Subsequent
calls on the same instance can rely on this state.

```ts
const cart = client.Cart()
await cart.load({ id: "example_id" })

// cart.data() now returns the loaded cart data
// cart.match() returns { id: "example_id" }
```

Call `make()` to create a fresh instance with the same configuration
but no stored state.

### Direct vs entity access

The entity interface handles URL construction, parameter placement,
and response parsing automatically. Use it for standard CRUD operations.

The `direct` method gives full control over the HTTP request. Use it
for non-standard endpoints, bulk operations, or any path not modelled
as an entity. The `prepare` method is useful for debugging — it
shows exactly what `direct` would send.


## Full Reference

See [REFERENCE.md](REFERENCE.md) for complete API reference
documentation including all method signatures, entity field schemas,
and detailed usage examples.
