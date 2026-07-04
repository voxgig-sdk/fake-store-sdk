<?php
declare(strict_types=1);

// Typed models for the FakeStore SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
//
// These are documentation-grade value objects (PHP 8 typed properties),
// registered on the composer classmap autoload. The SDK boundary exchanges
// assoc-arrays; these classes name the shapes for tooling and typed callers.

/** Cart entity data model. */
class Cart
{
    public ?int $id = null;
    public ?array $product = null;
    public ?int $user_id = null;
}

/** Request payload for Cart#load. */
class CartLoadMatch
{
    public int $id;
}

/** Match filter for Cart#list (any subset of Cart fields). */
class CartListMatch
{
    public ?int $id = null;
    public ?array $product = null;
    public ?int $user_id = null;
}

/** Match filter for Cart#create (any subset of Cart fields). */
class CartCreateData
{
    public ?int $id = null;
    public ?array $product = null;
    public ?int $user_id = null;
}

/** Request payload for Cart#update. */
class CartUpdateData
{
    public int $id;
}

/** Request payload for Cart#remove. */
class CartRemoveMatch
{
    public int $id;
}

/** Login entity data model. */
class Login
{
    public ?string $password = null;
    public ?string $token = null;
    public ?string $username = null;
}

/** Match filter for Login#create (any subset of Login fields). */
class LoginCreateData
{
    public ?string $password = null;
    public ?string $token = null;
    public ?string $username = null;
}

/** Product entity data model. */
class Product
{
    public ?string $category = null;
    public ?string $description = null;
    public ?int $id = null;
    public ?string $image = null;
    public ?float $price = null;
    public ?string $title = null;
}

/** Request payload for Product#load. */
class ProductLoadMatch
{
    public int $id;
}

/** Match filter for Product#list (any subset of Product fields). */
class ProductListMatch
{
    public ?string $category = null;
    public ?string $description = null;
    public ?int $id = null;
    public ?string $image = null;
    public ?float $price = null;
    public ?string $title = null;
}

/** Match filter for Product#create (any subset of Product fields). */
class ProductCreateData
{
    public ?string $category = null;
    public ?string $description = null;
    public ?int $id = null;
    public ?string $image = null;
    public ?float $price = null;
    public ?string $title = null;
}

/** Request payload for Product#update. */
class ProductUpdateData
{
    public int $id;
}

/** Request payload for Product#remove. */
class ProductRemoveMatch
{
    public int $id;
}

/** User entity data model. */
class User
{
    public ?string $email = null;
    public ?int $id = null;
    public ?string $password = null;
    public ?string $username = null;
}

/** Request payload for User#load. */
class UserLoadMatch
{
    public int $id;
}

/** Match filter for User#list (any subset of User fields). */
class UserListMatch
{
    public ?string $email = null;
    public ?int $id = null;
    public ?string $password = null;
    public ?string $username = null;
}

/** Match filter for User#create (any subset of User fields). */
class UserCreateData
{
    public ?string $email = null;
    public ?int $id = null;
    public ?string $password = null;
    public ?string $username = null;
}

/** Request payload for User#update. */
class UserUpdateData
{
    public int $id;
}

/** Request payload for User#remove. */
class UserRemoveMatch
{
    public int $id;
}

