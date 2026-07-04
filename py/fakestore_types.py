# Typed models for the FakeStore SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Field/param types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Do not edit by hand.

from __future__ import annotations

from dataclasses import dataclass
from typing import Optional, Any


@dataclass
class Cart:
    id: Optional[int] = None
    product: Optional[list] = None
    user_id: Optional[int] = None


@dataclass
class CartLoadMatch:
    id: int


@dataclass
class CartListMatch:
    id: Optional[int] = None
    product: Optional[list] = None
    user_id: Optional[int] = None


@dataclass
class CartCreateData:
    id: Optional[int] = None
    product: Optional[list] = None
    user_id: Optional[int] = None


@dataclass
class CartUpdateData:
    id: int


@dataclass
class CartRemoveMatch:
    id: int


@dataclass
class Login:
    password: Optional[str] = None
    token: Optional[str] = None
    username: Optional[str] = None


@dataclass
class LoginCreateData:
    password: Optional[str] = None
    token: Optional[str] = None
    username: Optional[str] = None


@dataclass
class Product:
    category: Optional[str] = None
    description: Optional[str] = None
    id: Optional[int] = None
    image: Optional[str] = None
    price: Optional[float] = None
    title: Optional[str] = None


@dataclass
class ProductLoadMatch:
    id: int


@dataclass
class ProductListMatch:
    category: Optional[str] = None
    description: Optional[str] = None
    id: Optional[int] = None
    image: Optional[str] = None
    price: Optional[float] = None
    title: Optional[str] = None


@dataclass
class ProductCreateData:
    category: Optional[str] = None
    description: Optional[str] = None
    id: Optional[int] = None
    image: Optional[str] = None
    price: Optional[float] = None
    title: Optional[str] = None


@dataclass
class ProductUpdateData:
    id: int


@dataclass
class ProductRemoveMatch:
    id: int


@dataclass
class User:
    email: Optional[str] = None
    id: Optional[int] = None
    password: Optional[str] = None
    username: Optional[str] = None


@dataclass
class UserLoadMatch:
    id: int


@dataclass
class UserListMatch:
    email: Optional[str] = None
    id: Optional[int] = None
    password: Optional[str] = None
    username: Optional[str] = None


@dataclass
class UserCreateData:
    email: Optional[str] = None
    id: Optional[int] = None
    password: Optional[str] = None
    username: Optional[str] = None


@dataclass
class UserUpdateData:
    id: int


@dataclass
class UserRemoveMatch:
    id: int

