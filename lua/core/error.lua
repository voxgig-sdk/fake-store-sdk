-- FakeStore SDK error

local FakeStoreError = {}
FakeStoreError.__index = FakeStoreError


function FakeStoreError.new(code, msg, ctx)
  local self = setmetatable({}, FakeStoreError)
  self.is_sdk_error = true
  self.sdk = "FakeStore"
  self.code = code or ""
  self.msg = msg or ""
  self.ctx = ctx
  self.result = nil
  self.spec = nil
  return self
end


function FakeStoreError:error()
  return self.msg
end


function FakeStoreError:__tostring()
  return self.msg
end


return FakeStoreError
