package core

var UtilityRegistrar func(u *Utility)

var NewBaseFeatureFunc func() Feature

var NewTestFeatureFunc func() Feature

var NewCartEntityFunc func(client *FakeStoreSDK, entopts map[string]any) FakeStoreEntity

var NewLoginEntityFunc func(client *FakeStoreSDK, entopts map[string]any) FakeStoreEntity

var NewProductEntityFunc func(client *FakeStoreSDK, entopts map[string]any) FakeStoreEntity

var NewUserEntityFunc func(client *FakeStoreSDK, entopts map[string]any) FakeStoreEntity

