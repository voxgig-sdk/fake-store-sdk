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

export interface CartListMatch {
  id?: number
  product?: any[]
  user_id?: number
}

export interface CartCreateData {
  id?: number
  product?: any[]
  user_id?: number
}

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

export interface LoginCreateData {
  password?: string
  token?: string
  username?: string
}

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

export interface ProductListMatch {
  category?: string
  description?: string
  id?: number
  image?: string
  price?: number
  title?: string
}

export interface ProductCreateData {
  category?: string
  description?: string
  id?: number
  image?: string
  price?: number
  title?: string
}

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

export interface UserListMatch {
  email?: string
  id?: number
  password?: string
  username?: string
}

export interface UserCreateData {
  email?: string
  id?: number
  password?: string
  username?: string
}

export interface UserUpdateData {
  id: number
}

export interface UserRemoveMatch {
  id: number
}

