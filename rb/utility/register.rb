# FakeStore SDK utility registration
require_relative '../core/utility_type'
require_relative 'clean'
require_relative 'done'
require_relative 'make_error'
require_relative 'feature_add'
require_relative 'feature_hook'
require_relative 'feature_init'
require_relative 'fetcher'
require_relative 'make_fetch_def'
require_relative 'make_context'
require_relative 'make_options'
require_relative 'make_request'
require_relative 'make_response'
require_relative 'make_result'
require_relative 'make_point'
require_relative 'make_spec'
require_relative 'make_url'
require_relative 'param'
require_relative 'prepare_auth'
require_relative 'prepare_body'
require_relative 'prepare_headers'
require_relative 'prepare_method'
require_relative 'prepare_params'
require_relative 'prepare_path'
require_relative 'prepare_query'
require_relative 'result_basic'
require_relative 'result_body'
require_relative 'result_headers'
require_relative 'transform_request'
require_relative 'transform_response'

FakeStoreUtility.registrar = ->(u) {
  u.clean = FakeStoreUtilities::Clean
  u.done = FakeStoreUtilities::Done
  u.make_error = FakeStoreUtilities::MakeError
  u.feature_add = FakeStoreUtilities::FeatureAdd
  u.feature_hook = FakeStoreUtilities::FeatureHook
  u.feature_init = FakeStoreUtilities::FeatureInit
  u.fetcher = FakeStoreUtilities::Fetcher
  u.make_fetch_def = FakeStoreUtilities::MakeFetchDef
  u.make_context = FakeStoreUtilities::MakeContext
  u.make_options = FakeStoreUtilities::MakeOptions
  u.make_request = FakeStoreUtilities::MakeRequest
  u.make_response = FakeStoreUtilities::MakeResponse
  u.make_result = FakeStoreUtilities::MakeResult
  u.make_point = FakeStoreUtilities::MakePoint
  u.make_spec = FakeStoreUtilities::MakeSpec
  u.make_url = FakeStoreUtilities::MakeUrl
  u.param = FakeStoreUtilities::Param
  u.prepare_auth = FakeStoreUtilities::PrepareAuth
  u.prepare_body = FakeStoreUtilities::PrepareBody
  u.prepare_headers = FakeStoreUtilities::PrepareHeaders
  u.prepare_method = FakeStoreUtilities::PrepareMethod
  u.prepare_params = FakeStoreUtilities::PrepareParams
  u.prepare_path = FakeStoreUtilities::PreparePath
  u.prepare_query = FakeStoreUtilities::PrepareQuery
  u.result_basic = FakeStoreUtilities::ResultBasic
  u.result_body = FakeStoreUtilities::ResultBody
  u.result_headers = FakeStoreUtilities::ResultHeaders
  u.transform_request = FakeStoreUtilities::TransformRequest
  u.transform_response = FakeStoreUtilities::TransformResponse
}
