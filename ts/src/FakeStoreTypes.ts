// Typed models for the FakeStore SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.

export interface Cart {
  id?: number
  product?: any[]
  user_id?: number
}

export interface CartLoadMatch {
  id: number
}

export type CartListMatch = Partial<Cart>

export type CartCreateData = Partial<Cart>

export interface CartUpdateData {
  id: number
}

export interface CartRemoveMatch {
  id: number
}

export interface Login {
  password?: string
  token?: string
  username?: string
}

export type LoginCreateData = Partial<Login>

export interface Product {
  category?: string
  description?: string
  id?: number
  image?: string
  price?: number
  title?: string
}

export interface ProductLoadMatch {
  id: number
}

export type ProductListMatch = Partial<Product>

export type ProductCreateData = Partial<Product>

export interface ProductUpdateData {
  id: number
}

export interface ProductRemoveMatch {
  id: number
}

export interface User {
  email?: string
  id?: number
  password?: string
  username?: string
}

export interface UserLoadMatch {
  id: number
}

export type UserListMatch = Partial<User>

export type UserCreateData = Partial<User>

export interface UserUpdateData {
  id: number
}

export interface UserRemoveMatch {
  id: number
}

