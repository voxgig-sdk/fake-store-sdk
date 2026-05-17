package voxgigfakestoresdk

import (
	"github.com/voxgig-sdk/fake-store-sdk/go/core"
	"github.com/voxgig-sdk/fake-store-sdk/go/entity"
	"github.com/voxgig-sdk/fake-store-sdk/go/feature"
	_ "github.com/voxgig-sdk/fake-store-sdk/go/utility"
)

// Type aliases preserve external API.
type FakeStoreSDK = core.FakeStoreSDK
type Context = core.Context
type Utility = core.Utility
type Feature = core.Feature
type Entity = core.Entity
type FakeStoreEntity = core.FakeStoreEntity
type FetcherFunc = core.FetcherFunc
type Spec = core.Spec
type Result = core.Result
type Response = core.Response
type Operation = core.Operation
type Control = core.Control
type FakeStoreError = core.FakeStoreError

// BaseFeature from feature package.
type BaseFeature = feature.BaseFeature

func init() {
	core.NewBaseFeatureFunc = func() core.Feature {
		return feature.NewBaseFeature()
	}
	core.NewTestFeatureFunc = func() core.Feature {
		return feature.NewTestFeature()
	}
	core.NewCartEntityFunc = func(client *core.FakeStoreSDK, entopts map[string]any) core.FakeStoreEntity {
		return entity.NewCartEntity(client, entopts)
	}
	core.NewLoginEntityFunc = func(client *core.FakeStoreSDK, entopts map[string]any) core.FakeStoreEntity {
		return entity.NewLoginEntity(client, entopts)
	}
	core.NewProductEntityFunc = func(client *core.FakeStoreSDK, entopts map[string]any) core.FakeStoreEntity {
		return entity.NewProductEntity(client, entopts)
	}
	core.NewUserEntityFunc = func(client *core.FakeStoreSDK, entopts map[string]any) core.FakeStoreEntity {
		return entity.NewUserEntity(client, entopts)
	}
}

// Constructor re-exports.
var NewFakeStoreSDK = core.NewFakeStoreSDK
var TestSDK = core.TestSDK
var NewContext = core.NewContext
var NewSpec = core.NewSpec
var NewResult = core.NewResult
var NewResponse = core.NewResponse
var NewOperation = core.NewOperation
var MakeConfig = core.MakeConfig
var NewBaseFeature = feature.NewBaseFeature
var NewTestFeature = feature.NewTestFeature
