// Typed models for the FakeStore SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import "encoding/json"

// Cart is the typed data model for the cart entity.
type Cart struct {
	Id *int `json:"id,omitempty"`
	Product *[]any `json:"product,omitempty"`
	UserId *int `json:"user_id,omitempty"`
}

// CartLoadMatch is the typed request payload for Cart.LoadTyped.
type CartLoadMatch struct {
	Id int `json:"id"`
}

// CartListMatch mirrors the cart fields as an all-optional match
// filter (Go analog of Partial<Cart>).
type CartListMatch struct {
	Id *int `json:"id,omitempty"`
	Product *[]any `json:"product,omitempty"`
	UserId *int `json:"user_id,omitempty"`
}

// CartCreateData mirrors the cart fields as an all-optional match
// filter (Go analog of Partial<Cart>).
type CartCreateData struct {
	Id *int `json:"id,omitempty"`
	Product *[]any `json:"product,omitempty"`
	UserId *int `json:"user_id,omitempty"`
}

// CartUpdateData is the typed request payload for Cart.UpdateTyped.
type CartUpdateData struct {
	Id int `json:"id"`
}

// CartRemoveMatch is the typed request payload for Cart.RemoveTyped.
type CartRemoveMatch struct {
	Id int `json:"id"`
}

// Login is the typed data model for the login entity.
type Login struct {
	Password *string `json:"password,omitempty"`
	Token *string `json:"token,omitempty"`
	Username *string `json:"username,omitempty"`
}

// LoginCreateData mirrors the login fields as an all-optional match
// filter (Go analog of Partial<Login>).
type LoginCreateData struct {
	Password *string `json:"password,omitempty"`
	Token *string `json:"token,omitempty"`
	Username *string `json:"username,omitempty"`
}

// Product is the typed data model for the product entity.
type Product struct {
	Category *string `json:"category,omitempty"`
	Description *string `json:"description,omitempty"`
	Id *int `json:"id,omitempty"`
	Image *string `json:"image,omitempty"`
	Price *float64 `json:"price,omitempty"`
	Title *string `json:"title,omitempty"`
}

// ProductLoadMatch is the typed request payload for Product.LoadTyped.
type ProductLoadMatch struct {
	Id int `json:"id"`
}

// ProductListMatch mirrors the product fields as an all-optional match
// filter (Go analog of Partial<Product>).
type ProductListMatch struct {
	Category *string `json:"category,omitempty"`
	Description *string `json:"description,omitempty"`
	Id *int `json:"id,omitempty"`
	Image *string `json:"image,omitempty"`
	Price *float64 `json:"price,omitempty"`
	Title *string `json:"title,omitempty"`
}

// ProductCreateData mirrors the product fields as an all-optional match
// filter (Go analog of Partial<Product>).
type ProductCreateData struct {
	Category *string `json:"category,omitempty"`
	Description *string `json:"description,omitempty"`
	Id *int `json:"id,omitempty"`
	Image *string `json:"image,omitempty"`
	Price *float64 `json:"price,omitempty"`
	Title *string `json:"title,omitempty"`
}

// ProductUpdateData is the typed request payload for Product.UpdateTyped.
type ProductUpdateData struct {
	Id int `json:"id"`
}

// ProductRemoveMatch is the typed request payload for Product.RemoveTyped.
type ProductRemoveMatch struct {
	Id int `json:"id"`
}

// User is the typed data model for the user entity.
type User struct {
	Email *string `json:"email,omitempty"`
	Id *int `json:"id,omitempty"`
	Password *string `json:"password,omitempty"`
	Username *string `json:"username,omitempty"`
}

// UserLoadMatch is the typed request payload for User.LoadTyped.
type UserLoadMatch struct {
	Id int `json:"id"`
}

// UserListMatch mirrors the user fields as an all-optional match
// filter (Go analog of Partial<User>).
type UserListMatch struct {
	Email *string `json:"email,omitempty"`
	Id *int `json:"id,omitempty"`
	Password *string `json:"password,omitempty"`
	Username *string `json:"username,omitempty"`
}

// UserCreateData mirrors the user fields as an all-optional match
// filter (Go analog of Partial<User>).
type UserCreateData struct {
	Email *string `json:"email,omitempty"`
	Id *int `json:"id,omitempty"`
	Password *string `json:"password,omitempty"`
	Username *string `json:"username,omitempty"`
}

// UserUpdateData is the typed request payload for User.UpdateTyped.
type UserUpdateData struct {
	Id int `json:"id"`
}

// UserRemoveMatch is the typed request payload for User.RemoveTyped.
type UserRemoveMatch struct {
	Id int `json:"id"`
}

// asMap turns a typed request/data struct into the map[string]any the
// runtime op pipeline consumes, honouring the json tags above.
func asMap(v any) map[string]any {
	out := map[string]any{}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedFrom decodes a runtime value (a map[string]any produced by the op
// pipeline) into a typed model T via a JSON round-trip. On any error it
// returns the zero value of T; the op's own (value, error) tuple carries the
// real error.
func typedFrom[T any](v any) T {
	var out T
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}

// typedSliceFrom decodes a runtime list value ([]any of maps) into a typed
// slice []T via a JSON round-trip, for list ops.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
