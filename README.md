# FakeStore SDK

Free RESTful API of fake e-commerce data — products, carts, users, and login tokens — for prototyping and testing

> TypeScript, Python, PHP, Golang, Ruby, Lua SDKs, a CLI, an interactive REPL, and an MCP server for AI agents — all generated from one OpenAPI spec by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen).

## About FakeStoreAPI

[Fake Store API](https://fakestoreapi.com) is a free RESTful API that returns realistic-looking e-commerce data so you can build front-ends, demos, and tutorials without standing up a backend. The project is maintained by MohammadReza Keikavousi and the source lives on GitHub at [keikaavousi/fake-store-api](https://github.com/keikaavousi/fake-store-api).

What you get from the API:

- A catalogue of about 20 **products**, each with title, price, category, description, and image URL.
- Product **categories** you can list and filter by.
- About 20 **carts** containing a user id plus product ids and quantities.
- About 10 **users** with name, email, and address details.
- A **login** endpoint that returns a JWT-style token so you can exercise auth flows.

Operational notes: the API is public — no API key or sign-up. CORS is enabled on every endpoint. The community catalogue page lists no formal rate limit. Writes (POST/PUT/DELETE) are accepted by the API but, as with most fake-data services, they are not persisted server-side.

## Try it

**TypeScript**
```bash
npm install fake-store
```

**Python**
```bash
pip install fake-store-sdk
```

**PHP**
```bash
composer require voxgig/fake-store-sdk
```

**Golang**
```bash
go get github.com/voxgig-sdk/fake-store-sdk/go
```

**Ruby**
```bash
gem install fake-store-sdk
```

**Lua**
```bash
luarocks install fake-store-sdk
```

## 30-second quickstart

### TypeScript

```ts
import { FakeStoreSDK } from 'fake-store'

const client = new FakeStoreSDK({})

// List all carts
const carts = await client.Cart().list()
```

See the [TypeScript README](ts/README.md) for the
full guide, or scroll down for the same example in other languages.

## What's in the box

| Surface | Use it for | Path |
| --- | --- | --- |
| **SDK** (TypeScript, Python, PHP, Golang, Ruby, Lua) | App integration | `ts/` `py/` `php/` `go/` `rb/` `lua/` |
| **CLI** | Scripts, CI, ops, one-off API calls | `go-cli/` |
| **MCP server** | AI agents (Claude, Cursor, Cline) | `go-mcp/` |

## Use it from an AI agent (MCP)

The generated MCP server exposes every operation in this SDK as an
[MCP](https://modelcontextprotocol.io) tool that Claude, Cursor or Cline
can call directly. Build and register it:

```bash
cd go-mcp && go build -o fake-store-mcp .
```

Then add it to your agent's MCP config (Claude Desktop, Cursor, etc.):

```json
{
  "mcpServers": {
    "fake-store": {
      "command": "/abs/path/to/fake-store-mcp"
    }
  }
}
```

## Entities

The API exposes 4 entities:

| Entity | Description | API path |
| --- | --- | --- |
| **Cart** | Shopping carts that bundle a user id with a list of product ids and quantities; served from `/carts` and `/carts/{id}`. | `/carts` |
| **Login** | Authentication endpoint that exchanges a username and password for a JWT-style token; served from `/auth/login`. | `/auth/login` |
| **Product** | Catalogue items with title, price, category, description, and image URL; served from `/products`, `/products/{id}`, and `/products/categories`. | `/products` |
| **User** | Sample user profiles with name, email, and address fields; served from `/users` and `/users/{id}`. | `/users` |

Each entity supports the following operations where available: **load**,
**list**, **create**, **update**, and **remove**.

## Quickstart in other languages

### Python

```python
from fakestore_sdk import FakeStoreSDK

client = FakeStoreSDK({})

# List all carts
carts, err = client.Cart(None).list(None, None)

# Load a specific cart
cart, err = client.Cart(None).load(
    {"id": "example_id"}, None
)
```

### PHP

```php
<?php
require_once 'fakestore_sdk.php';

$client = new FakeStoreSDK([]);

// List all carts
[$carts, $err] = $client->Cart(null)->list(null, null);

// Load a specific cart
[$cart, $err] = $client->Cart(null)->load(
    ["id" => "example_id"], null
);
```

### Golang

```go
import sdk "github.com/voxgig-sdk/fake-store-sdk/go"

client := sdk.NewFakeStoreSDK(map[string]any{})

// List all carts
carts, err := client.Cart(nil).List(nil, nil)
```

### Ruby

```ruby
require_relative "FakeStore_sdk"

client = FakeStoreSDK.new({})

# List all carts
carts, err = client.Cart(nil).list(nil, nil)

# Load a specific cart
cart, err = client.Cart(nil).load(
  { "id" => "example_id" }, nil
)
```

### Lua

```lua
local sdk = require("fake-store_sdk")

local client = sdk.new({})

-- List all carts
local carts, err = client:Cart(nil):list(nil, nil)

-- Load a specific cart
local cart, err = client:Cart(nil):load(
  { id = "example_id" }, nil
)
```

## Unit testing in offline mode

Every SDK ships a test mode that swaps the HTTP transport for an
in-memory mock, so unit tests run offline.

### TypeScript

```ts
const client = FakeStoreSDK.test()
const result = await client.Cart().load({ id: 'test01' })
// result.ok === true, result.data contains mock data
```

### Python

```python
client = FakeStoreSDK.test(None, None)
result, err = client.Cart(None).load(
    {"id": "test01"}, None
)
```

### PHP

```php
$client = FakeStoreSDK::test(null, null);
[$result, $err] = $client->Cart(null)->load(
    ["id" => "test01"], null
);
```

### Golang

```go
client := sdk.TestSDK(nil, nil)
result, err := client.Cart(nil).Load(
    map[string]any{"id": "test01"}, nil,
)
```

### Ruby

```ruby
client = FakeStoreSDK.test(nil, nil)
result, err = client.Cart(nil).load(
  { "id" => "test01" }, nil
)
```

### Lua

```lua
local client = sdk.test(nil, nil)
local result, err = client:Cart(nil):load(
  { id = "test01" }, nil
)
```

## How it works

Every SDK call runs the same five-stage pipeline:

1. **Point** — resolve the API endpoint from the operation definition.
2. **Spec** — build the HTTP specification (URL, method, headers, body).
3. **Request** — send the HTTP request.
4. **Response** — receive and parse the response.
5. **Result** — extract the result data for the caller.

A feature hook fires at each stage (e.g. `PrePoint`, `PreSpec`,
`PreRequest`), so features can inspect or modify the pipeline without
forking the SDK.

### Features

| Feature | Purpose |
| --- | --- |
| **TestFeature** | In-memory mock transport for testing without a live server |

Pass custom features via the `extend` option at construction time.

### Direct and Prepare

For endpoints the entity model doesn't cover, use the low-level methods:

- **`direct(fetchargs)`** — build and send an HTTP request in one step.
- **`prepare(fetchargs)`** — build the request without sending it.

Both accept a map with `path`, `method`, `params`, `query`,
`headers`, and `body`. See the [How-to guides](#how-to-guides) below.

## How-to guides

### Make a direct API call

When the entity interface does not cover an endpoint, use `direct`:

**TypeScript:**
```ts
const result = await client.direct({
  path: '/api/resource/{id}',
  method: 'GET',
  params: { id: 'example' },
})
console.log(result.data)
```

**Python:**
```python
result, err = client.direct({
    "path": "/api/resource/{id}",
    "method": "GET",
    "params": {"id": "example"},
})
```

**PHP:**
```php
[$result, $err] = $client->direct([
    "path" => "/api/resource/{id}",
    "method" => "GET",
    "params" => ["id" => "example"],
]);
```

**Go:**
```go
result, err := client.Direct(map[string]any{
    "path":   "/api/resource/{id}",
    "method": "GET",
    "params": map[string]any{"id": "example"},
})
```

**Ruby:**
```ruby
result, err = client.direct({
  "path" => "/api/resource/{id}",
  "method" => "GET",
  "params" => { "id" => "example" },
})
```

**Lua:**
```lua
local result, err = client:direct({
  path = "/api/resource/{id}",
  method = "GET",
  params = { id = "example" },
})
```

## Per-language documentation

- [TypeScript](ts/README.md)
- [Python](py/README.md)
- [PHP](php/README.md)
- [Golang](go/README.md)
- [Ruby](rb/README.md)
- [Lua](lua/README.md)

## Using the FakeStoreAPI

- Upstream: [https://fakestoreapi.com](https://fakestoreapi.com)
- API docs: [https://fakestoreapi.com/docs](https://fakestoreapi.com/docs)

- No licence is published on the project homepage or community catalogue page.
- The service is provided free of charge for prototyping, testing, and teaching.
- No authentication is required and CORS is enabled on all endpoints.
- Treat the returned data as throwaway sample data; do not rely on it for production.

---

Generated from the FakeStoreAPI OpenAPI spec by [@voxgig/sdkgen](https://github.com/voxgig/sdkgen).
