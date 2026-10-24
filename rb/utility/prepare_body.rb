# FakeStore SDK utility: prepare_body
require_relative 'media'
module FakeStoreUtilities
  PrepareBody = ->(ctx) {
    return nil unless ctx.op.input == "data"
    return FakeStoreUtilities.raw_body(ctx.reqdata) if FakeStoreUtilities.raw_request?(ctx.point)
    ctx.utility.transform_request.call(ctx)
  }
end
