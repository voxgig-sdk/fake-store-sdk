# FakeStore SDK utility: feature_add
module FakeStoreUtilities
  FeatureAdd = ->(ctx, f) {
    ctx.client.features << f
  }
end
