# FakeStore SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/ratelimit_feature'
require_relative 'feature/retry_feature'
require_relative 'feature/test_feature'
require_relative 'feature/timeout_feature'


module FakeStoreFeatures
  def self.make_feature(name)
    case name
    when "base"
      FakeStoreBaseFeature.new
    when "ratelimit"
      FakeStoreRatelimitFeature.new
    when "retry"
      FakeStoreRetryFeature.new
    when "test"
      FakeStoreTestFeature.new
    when "timeout"
      FakeStoreTimeoutFeature.new
    else
      FakeStoreBaseFeature.new
    end
  end
end
