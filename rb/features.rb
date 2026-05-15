# FakeStore SDK feature factory

require_relative 'feature/base_feature'
require_relative 'feature/test_feature'


module FakeStoreFeatures
  def self.make_feature(name)
    case name
    when "base"
      FakeStoreBaseFeature.new
    when "test"
      FakeStoreTestFeature.new
    else
      FakeStoreBaseFeature.new
    end
  end
end
