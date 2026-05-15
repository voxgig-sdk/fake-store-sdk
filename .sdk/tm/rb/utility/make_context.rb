# FakeStore SDK utility: make_context
require_relative '../core/context'
module FakeStoreUtilities
  MakeContext = ->(ctxmap, basectx) {
    FakeStoreContext.new(ctxmap, basectx)
  }
end
