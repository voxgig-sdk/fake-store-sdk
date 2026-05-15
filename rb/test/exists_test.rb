# FakeStore SDK exists test

require "minitest/autorun"
require_relative "../FakeStore_sdk"

class ExistsTest < Minitest::Test
  def test_create_test_sdk
    testsdk = FakeStoreSDK.test(nil, nil)
    assert !testsdk.nil?
  end
end
