-- Typed models for the FakeStore SDK (LuaLS annotations).
--
-- GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
-- params (op.<name>.points[].args.params[]). Field/param types come from the
-- canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
-- @voxgig/apidef VALID_CANON). Annotations only — no runtime effect. Do not
-- edit by hand.

---@class Cart
---@field id? number
---@field product? table
---@field user_id? number

---@class CartLoadMatch
---@field id number

---@class CartListMatch
---@field id? number
---@field product? table
---@field user_id? number

---@class CartCreateData
---@field id? number
---@field product? table
---@field user_id? number

---@class CartUpdateData
---@field id number

---@class CartRemoveMatch
---@field id number

---@class Login
---@field password? string
---@field token? string
---@field username? string

---@class LoginCreateData
---@field password? string
---@field token? string
---@field username? string

---@class Product
---@field category? string
---@field description? string
---@field id? number
---@field image? string
---@field price? number
---@field title? string

---@class ProductLoadMatch
---@field id number

---@class ProductListMatch
---@field category? string
---@field description? string
---@field id? number
---@field image? string
---@field price? number
---@field title? string

---@class ProductCreateData
---@field category? string
---@field description? string
---@field id? number
---@field image? string
---@field price? number
---@field title? string

---@class ProductUpdateData
---@field id number

---@class ProductRemoveMatch
---@field id number

---@class User
---@field email? string
---@field id? number
---@field password? string
---@field username? string

---@class UserLoadMatch
---@field id number

---@class UserListMatch
---@field email? string
---@field id? number
---@field password? string
---@field username? string

---@class UserCreateData
---@field email? string
---@field id? number
---@field password? string
---@field username? string

---@class UserUpdateData
---@field id number

---@class UserRemoveMatch
---@field id number

local M = {}

return M
