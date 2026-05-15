package = "voxgig-sdk-fake-store"
version = "0.0-1"
source = {
  url = "git://github.com/voxgig-sdk/fake-store-sdk.git"
}
description = {
  summary = "FakeStore SDK for Lua",
  license = "MIT"
}
dependencies = {
  "lua >= 5.3",
  "dkjson >= 2.5",
  "dkjson >= 2.5",
}
build = {
  type = "builtin",
  modules = {
    ["fake-store_sdk"] = "fake-store_sdk.lua",
    ["config"] = "config.lua",
    ["features"] = "features.lua",
  }
}
