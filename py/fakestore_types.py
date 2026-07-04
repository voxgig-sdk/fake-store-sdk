# Typed models for the FakeStore SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.
#
# These are TypedDicts, not dataclasses: the SDK ops return/accept plain dicts
# at runtime, and a TypedDict IS a dict shape, so the types match the runtime.
# Optional (req:false) keys are modelled as TypedDict key-optionality
# (total=False), split into a required base + total=False subclass when a type
# has both required and optional keys.

from __future__ import annotations

from typing import TypedDict, Any


class Cart(TypedDict, total=False):
    id: int
    product: list
    user_id: int


class CartLoadMatch(TypedDict):
    id: int


class CartListMatch(TypedDict, total=False):
    id: int
    product: list
    user_id: int


class CartCreateData(TypedDict, total=False):
    id: int
    product: list
    user_id: int


class CartUpdateData(TypedDict):
    id: int


class CartRemoveMatch(TypedDict):
    id: int


class Login(TypedDict, total=False):
    password: str
    token: str
    username: str


class LoginCreateData(TypedDict, total=False):
    password: str
    token: str
    username: str


class Product(TypedDict, total=False):
    category: str
    description: str
    id: int
    image: str
    price: float
    title: str


class ProductLoadMatch(TypedDict):
    id: int


class ProductListMatch(TypedDict, total=False):
    category: str
    description: str
    id: int
    image: str
    price: float
    title: str


class ProductCreateData(TypedDict, total=False):
    category: str
    description: str
    id: int
    image: str
    price: float
    title: str


class ProductUpdateData(TypedDict):
    id: int


class ProductRemoveMatch(TypedDict):
    id: int


class User(TypedDict, total=False):
    email: str
    id: int
    password: str
    username: str


class UserLoadMatch(TypedDict):
    id: int


class UserListMatch(TypedDict, total=False):
    email: str
    id: int
    password: str
    username: str


class UserCreateData(TypedDict, total=False):
    email: str
    id: int
    password: str
    username: str


class UserUpdateData(TypedDict):
    id: int


class UserRemoveMatch(TypedDict):
    id: int
