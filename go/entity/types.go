// Typed models for the FakeStore SDK.
//
// GENERATED from the API model: main.kit.entity.<e>.fields[] and per-op
// params (op.<name>.points[].args.params[]). Field/param types come from the
// canonical type sentinels via @voxgig/sdkgen canonToType (source of truth:
// @voxgig/apidef VALID_CANON). Do not edit by hand.
package entity

import (
	"encoding/json"

	"github.com/voxgig-sdk/fake-store-sdk/go/core"
)

// Cart is the typed data model for the cart entity.
type Cart struct {
	Id *int `json:"id,omitempty"`
	Products *[]any `json:"products,omitempty"`
	UserId *int `json:"userId,omitempty"`
}

// CartLoadMatch is the typed request payload for Cart.LoadTyped.
type CartLoadMatch struct {
	Id int `json:"id"`
}

// CartListMatch is the typed request payload for Cart.ListTyped.
type CartListMatch struct {
	Id *int `json:"id,omitempty"`
	Products *[]any `json:"products,omitempty"`
	UserId *int `json:"userId,omitempty"`
}

// CartCreateData is the typed request payload for Cart.CreateTyped.
type CartCreateData struct {
	Id *int `json:"id,omitempty"`
	Products *[]any `json:"products,omitempty"`
	UserId *int `json:"userId,omitempty"`
}

// CartUpdateData is the typed request payload for Cart.UpdateTyped.
type CartUpdateData struct {
	Id int `json:"id"`
	Products *[]any `json:"products,omitempty"`
	UserId *int `json:"userId,omitempty"`
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

// LoginCreateData is the typed request payload for Login.CreateTyped.
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

// ProductListMatch is the typed request payload for Product.ListTyped.
type ProductListMatch struct {
	Category *string `json:"category,omitempty"`
	Description *string `json:"description,omitempty"`
	Id *int `json:"id,omitempty"`
	Image *string `json:"image,omitempty"`
	Price *float64 `json:"price,omitempty"`
	Title *string `json:"title,omitempty"`
}

// ProductCreateData is the typed request payload for Product.CreateTyped.
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
	Category *string `json:"category,omitempty"`
	Description *string `json:"description,omitempty"`
	Image *string `json:"image,omitempty"`
	Price *float64 `json:"price,omitempty"`
	Title *string `json:"title,omitempty"`
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

// UserListMatch is the typed request payload for User.ListTyped.
type UserListMatch struct {
	Email *string `json:"email,omitempty"`
	Id *int `json:"id,omitempty"`
	Password *string `json:"password,omitempty"`
	Username *string `json:"username,omitempty"`
}

// UserCreateData is the typed request payload for User.CreateTyped.
type UserCreateData struct {
	Email *string `json:"email,omitempty"`
	Id *int `json:"id,omitempty"`
	Password *string `json:"password,omitempty"`
	Username *string `json:"username,omitempty"`
}

// UserUpdateData is the typed request payload for User.UpdateTyped.
type UserUpdateData struct {
	Id int `json:"id"`
	Email *string `json:"email,omitempty"`
	Password *string `json:"password,omitempty"`
	Username *string `json:"username,omitempty"`
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

// entityData unwraps an entity to its data map.
//
// Operations resolve to the ENTITY, not the raw data (see AGENTS.md), and an
// entity's fields are UNEXPORTED — marshalling one directly yields `{}`, so
// every typed accessor would silently hand back a zero-valued struct. The
// typed boundary therefore takes the data hop first.
func entityData(v any) any {
	if ent, ok := v.(core.Entity); ok {
		return ent.Data()
	}
	return v
}

// typedFrom decodes a runtime value (an entity, or the map[string]any the op
// pipeline produced) into a typed model T via a JSON round-trip. On any error
// it returns the zero value of T; the op's own (value, error) tuple carries
// the real error.
func typedFrom[T any](v any) T {
	var out T
	v = entityData(v)
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

// typedSliceFrom decodes a runtime list value into a typed slice []T via a
// JSON round-trip, for list ops. `list` resolves to a slice of ENTITY
// instances, so each element takes the data hop.
func typedSliceFrom[T any](v any) []T {
	var out []T
	if v == nil {
		return out
	}
	if list, ok := v.([]any); ok {
		unwrapped := make([]any, 0, len(list))
		for _, item := range list {
			unwrapped = append(unwrapped, entityData(item))
		}
		v = unwrapped
	}
	b, err := json.Marshal(v)
	if err != nil {
		return out
	}
	_ = json.Unmarshal(b, &out)
	return out
}
