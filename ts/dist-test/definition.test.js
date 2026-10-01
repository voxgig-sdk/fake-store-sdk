"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const node_test_1 = require("node:test");
const __1 = require("..");
const definition_runner_1 = require("./definition-runner");
const utility_1 = require("./utility");
// Generated from the API definition, not from the model this SDK was built
// from: the route, the declared query parameters, the credential the security
// scheme names, and the definition's own response example.
const PLAN = [
    {
        "entity": "cart",
        "accessor": "Cart",
        "op": "create",
        "method": "POST",
        "path": "/carts",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 201,
        "sample": {
            "id": 1,
            "userId": 1,
            "products": [
                {
                    "id": 1,
                    "title": "x",
                    "price": 1,
                    "description": "x",
                    "category": "x",
                    "image": "x"
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "cart",
        "accessor": "Cart",
        "op": "list",
        "method": "GET",
        "path": "/carts",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": [
            {
                "id": 1,
                "userId": 1,
                "products": [
                    {
                        "id": 1,
                        "title": "x",
                        "price": 1,
                        "description": "x",
                        "category": "x",
                        "image": "x"
                    }
                ]
            }
        ],
        "idField": "id"
    },
    {
        "entity": "cart",
        "accessor": "Cart",
        "op": "load",
        "method": "GET",
        "path": "/carts/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "id": 1,
            "userId": 1,
            "products": [
                {
                    "id": 1,
                    "title": "x",
                    "price": 1,
                    "description": "x",
                    "category": "x",
                    "image": "x"
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "cart",
        "accessor": "Cart",
        "op": "remove",
        "method": "DELETE",
        "path": "/carts/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": null,
        "idField": "id"
    },
    {
        "entity": "cart",
        "accessor": "Cart",
        "op": "update",
        "method": "PUT",
        "path": "/carts/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "id": 1,
            "userId": 1,
            "products": [
                {
                    "id": 1,
                    "title": "x",
                    "price": 1,
                    "description": "x",
                    "category": "x",
                    "image": "x"
                }
            ]
        },
        "idField": "id"
    },
    {
        "entity": "login",
        "accessor": "Login",
        "op": "create",
        "method": "POST",
        "path": "/auth/login",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "token": "x"
        },
        "idField": "id"
    },
    {
        "entity": "product",
        "accessor": "Product",
        "op": "create",
        "method": "POST",
        "path": "/products",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 201,
        "sample": {
            "id": 1,
            "title": "x",
            "price": 1,
            "description": "x",
            "category": "x",
            "image": "x"
        },
        "idField": "id"
    },
    {
        "entity": "product",
        "accessor": "Product",
        "op": "list",
        "method": "GET",
        "path": "/products",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": [
            {
                "id": 1,
                "title": "x",
                "price": 1,
                "description": "x",
                "category": "x",
                "image": "x"
            }
        ],
        "idField": "id"
    },
    {
        "entity": "product",
        "accessor": "Product",
        "op": "load",
        "method": "GET",
        "path": "/products/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "id": 1,
            "title": "x",
            "price": 1,
            "description": "x",
            "category": "x",
            "image": "x"
        },
        "idField": "id"
    },
    {
        "entity": "product",
        "accessor": "Product",
        "op": "remove",
        "method": "DELETE",
        "path": "/products/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": null,
        "idField": "id"
    },
    {
        "entity": "product",
        "accessor": "Product",
        "op": "update",
        "method": "PUT",
        "path": "/products/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "id": 1,
            "title": "x",
            "price": 1,
            "description": "x",
            "category": "x",
            "image": "x"
        },
        "idField": "id"
    },
    {
        "entity": "user",
        "accessor": "User",
        "op": "create",
        "method": "POST",
        "path": "/users",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 201,
        "sample": {
            "id": 1,
            "username": "x",
            "email": "x",
            "password": "x"
        },
        "idField": "id"
    },
    {
        "entity": "user",
        "accessor": "User",
        "op": "list",
        "method": "GET",
        "path": "/users",
        "args": [],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": [
            {
                "id": 1,
                "username": "x",
                "email": "x",
                "password": "x"
            }
        ],
        "idField": "id"
    },
    {
        "entity": "user",
        "accessor": "User",
        "op": "load",
        "method": "GET",
        "path": "/users/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "id": 1,
            "username": "x",
            "email": "x",
            "password": "x"
        },
        "idField": "id"
    },
    {
        "entity": "user",
        "accessor": "User",
        "op": "remove",
        "method": "DELETE",
        "path": "/users/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": null,
        "idField": "id"
    },
    {
        "entity": "user",
        "accessor": "User",
        "op": "update",
        "method": "PUT",
        "path": "/users/{id}",
        "args": [
            {
                "name": "id",
                "wire": "id",
                "value": "p1"
            }
        ],
        "select": {},
        "headers": [],
        "query": [],
        "auth": null,
        "status": 200,
        "sample": {
            "id": 1,
            "username": "x",
            "email": "x",
            "password": "x"
        },
        "idField": "id"
    }
];
(0, node_test_1.describe)('definition', () => {
    for (const point of PLAN) {
        (0, node_test_1.test)(point.entity + '.' + point.op + ' ' + point.method + ' ' + point.path, async (t) => {
            const control = (0, utility_1.isControlSkipped)('entityOp', point.entity + '.' + point.op, 'definition');
            if (control.skip) {
                t.skip(control.reason || 'skipped via sdk-test-control.json');
                return;
            }
            await (0, definition_runner_1.runDefinitionPoint)(__1.SDK, point);
        });
    }
});
//# sourceMappingURL=definition.test.js.map