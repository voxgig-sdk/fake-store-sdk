# frozen_string_literal: true

# Typed models for the FakeStore SDK.
#
# GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
# params (op.<name>.points[].args.params[]). Member types come from the
# canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
# @voxgig/apidef VALID_CANON). Ruby types are unenforced; these YARD
# annotations document the shapes. Do not edit by hand.

# Cart entity data model.
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] product
#   @return [Array, nil]
#
# @!attribute [rw] user_id
#   @return [Integer, nil]
Cart = Struct.new(
  :id,
  :product,
  :user_id,
  keyword_init: true
)

# Request payload for Cart#load.
#
# @!attribute [rw] id
#   @return [Integer]
CartLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Cart#list.
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] product
#   @return [Array, nil]
#
# @!attribute [rw] user_id
#   @return [Integer, nil]
CartListMatch = Struct.new(
  :id,
  :product,
  :user_id,
  keyword_init: true
)

# Request payload for Cart#create.
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] product
#   @return [Array, nil]
#
# @!attribute [rw] user_id
#   @return [Integer, nil]
CartCreateData = Struct.new(
  :id,
  :product,
  :user_id,
  keyword_init: true
)

# Request payload for Cart#update.
#
# @!attribute [rw] id
#   @return [Integer]
CartUpdateData = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Cart#remove.
#
# @!attribute [rw] id
#   @return [Integer]
CartRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

# Login entity data model.
#
# @!attribute [rw] password
#   @return [String, nil]
#
# @!attribute [rw] token
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String, nil]
Login = Struct.new(
  :password,
  :token,
  :username,
  keyword_init: true
)

# Request payload for Login#create.
#
# @!attribute [rw] password
#   @return [String, nil]
#
# @!attribute [rw] token
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String, nil]
LoginCreateData = Struct.new(
  :password,
  :token,
  :username,
  keyword_init: true
)

# Product entity data model.
#
# @!attribute [rw] category
#   @return [String, nil]
#
# @!attribute [rw] description
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] image
#   @return [String, nil]
#
# @!attribute [rw] price
#   @return [Float, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
Product = Struct.new(
  :category,
  :description,
  :id,
  :image,
  :price,
  :title,
  keyword_init: true
)

# Request payload for Product#load.
#
# @!attribute [rw] id
#   @return [Integer]
ProductLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Product#list.
#
# @!attribute [rw] category
#   @return [String, nil]
#
# @!attribute [rw] description
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] image
#   @return [String, nil]
#
# @!attribute [rw] price
#   @return [Float, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
ProductListMatch = Struct.new(
  :category,
  :description,
  :id,
  :image,
  :price,
  :title,
  keyword_init: true
)

# Request payload for Product#create.
#
# @!attribute [rw] category
#   @return [String, nil]
#
# @!attribute [rw] description
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] image
#   @return [String, nil]
#
# @!attribute [rw] price
#   @return [Float, nil]
#
# @!attribute [rw] title
#   @return [String, nil]
ProductCreateData = Struct.new(
  :category,
  :description,
  :id,
  :image,
  :price,
  :title,
  keyword_init: true
)

# Request payload for Product#update.
#
# @!attribute [rw] id
#   @return [Integer]
ProductUpdateData = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for Product#remove.
#
# @!attribute [rw] id
#   @return [Integer]
ProductRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

# User entity data model.
#
# @!attribute [rw] email
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] password
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String, nil]
User = Struct.new(
  :email,
  :id,
  :password,
  :username,
  keyword_init: true
)

# Request payload for User#load.
#
# @!attribute [rw] id
#   @return [Integer]
UserLoadMatch = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for User#list.
#
# @!attribute [rw] email
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] password
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String, nil]
UserListMatch = Struct.new(
  :email,
  :id,
  :password,
  :username,
  keyword_init: true
)

# Request payload for User#create.
#
# @!attribute [rw] email
#   @return [String, nil]
#
# @!attribute [rw] id
#   @return [Integer, nil]
#
# @!attribute [rw] password
#   @return [String, nil]
#
# @!attribute [rw] username
#   @return [String, nil]
UserCreateData = Struct.new(
  :email,
  :id,
  :password,
  :username,
  keyword_init: true
)

# Request payload for User#update.
#
# @!attribute [rw] id
#   @return [Integer]
UserUpdateData = Struct.new(
  :id,
  keyword_init: true
)

# Request payload for User#remove.
#
# @!attribute [rw] id
#   @return [Integer]
UserRemoveMatch = Struct.new(
  :id,
  keyword_init: true
)

