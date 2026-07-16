# Product entity test

require "minitest/autorun"
require "json"
require_relative "../FakeStore_sdk"
require_relative "runner"

class ProductEntityTest < Minitest::Test
  def test_create_instance
    testsdk = FakeStoreSDK.test(nil, nil)
    ent = testsdk.Product(nil)
    assert !ent.nil?
  end

  # Feature #4: the entity stream(action, ...) method runs the op pipeline and
  # returns an Enumerator over result items. With the streaming feature active
  # it yields the feature's incremental output; otherwise it falls back to the
  # materialised list so stream always yields.
  def test_stream
    seed = {
      "entity" => {
        "product" => {
          "s1" => { "id" => "s1" },
          "s2" => { "id" => "s2" },
          "s3" => { "id" => "s3" },
        },
      },
    }

    # Fallback: streaming inactive -> yields the materialised list items.
    base = FakeStoreSDK.test(seed, nil)
    seen = base.Product(nil).stream("list", nil, nil).to_a
    assert_equal 3, seen.length

    # Inbound: streaming active -> yields each item from the feature.
    cfg = FakeStoreConfig.make_config
    if cfg["feature"].is_a?(Hash) && cfg["feature"].key?("streaming")
      sdk = FakeStoreSDK.test(seed, { "feature" => { "streaming" => { "active" => true } } })
      got = []
      sdk.Product(nil).stream("list", nil, nil).each do |item|
        if item.is_a?(Array)
          got.concat(item)
        else
          got << item
        end
      end
      assert_equal 3, got.length
    end
  end

  def test_basic_flow
    setup = product_basic_setup(nil)
    # Per-op sdk-test-control.json skip.
    _live = setup[:live] || false
    ["create", "list", "update", "load", "remove"].each do |_op|
      _should_skip, _reason = Runner.is_control_skipped("entityOp", "product." + _op, _live ? "live" : "unit")
      if _should_skip
        skip(_reason || "skipped via sdk-test-control.json")
        return
      end
    end
    # The basic flow consumes synthetic IDs from the fixture. In live mode
    # without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup[:synthetic_only]
      skip "live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_PRODUCT_ENTID JSON to run live"
      return
    end
    client = setup[:client]

    # CREATE
    product_ref01_ent = client.Product(nil)
    product_ref01_data = Helpers.to_map(Vs.getprop(
      Vs.getpath(setup[:data], "new.product"), "product_ref01"))

    product_ref01_data_result = product_ref01_ent.create(product_ref01_data, nil)
    product_ref01_data = Helpers.to_map(product_ref01_data_result)
    assert !product_ref01_data.nil?
    assert !product_ref01_data["id"].nil?

    # LIST
    product_ref01_match = {}

    product_ref01_list_result = product_ref01_ent.list(product_ref01_match, nil)
    assert product_ref01_list_result.is_a?(Array)

    found_item = Vs.select(
      Runner.entity_list_to_data(product_ref01_list_result),
      { "id" => product_ref01_data["id"] })
    assert !Vs.isempty(found_item)

    # UPDATE
    product_ref01_data_up0_up = {
      "id" => product_ref01_data["id"],
    }

    product_ref01_markdef_up0_name = "category"
    product_ref01_markdef_up0_value = "Mark01-product_ref01_#{setup[:now]}"
    product_ref01_data_up0_up[product_ref01_markdef_up0_name] = product_ref01_markdef_up0_value

    product_ref01_resdata_up0_result = product_ref01_ent.update(product_ref01_data_up0_up, nil)
    product_ref01_resdata_up0 = Helpers.to_map(product_ref01_resdata_up0_result)
    assert !product_ref01_resdata_up0.nil?
    assert_equal product_ref01_resdata_up0["id"], product_ref01_data_up0_up["id"]
    assert_equal product_ref01_resdata_up0[product_ref01_markdef_up0_name], product_ref01_markdef_up0_value

    # LOAD
    product_ref01_match_dt0 = {
      "id" => product_ref01_data["id"],
    }
    product_ref01_data_dt0_loaded = product_ref01_ent.load(product_ref01_match_dt0, nil)
    product_ref01_data_dt0_load_result = Helpers.to_map(product_ref01_data_dt0_loaded)
    assert !product_ref01_data_dt0_load_result.nil?
    assert_equal product_ref01_data_dt0_load_result["id"], product_ref01_data["id"]

    # REMOVE
    product_ref01_match_rm0 = {
      "id" => product_ref01_data["id"],
    }
    product_ref01_ent.remove(product_ref01_match_rm0, nil)

    # LIST
    product_ref01_match_rt0 = {}

    product_ref01_list_rt0_result = product_ref01_ent.list(product_ref01_match_rt0, nil)
    assert product_ref01_list_rt0_result.is_a?(Array)

    not_found_item = Vs.select(
      Runner.entity_list_to_data(product_ref01_list_rt0_result),
      { "id" => product_ref01_data["id"] })
    assert Vs.isempty(not_found_item)

  end
end

def product_basic_setup(extra)
  Runner.load_env_local

  entity_data_file = File.join(__dir__, "..", "..", ".sdk", "test", "entity", "product", "ProductTestData.json")
  entity_data_source = File.read(entity_data_file)
  entity_data = JSON.parse(entity_data_source)

  options = {}
  options["entity"] = entity_data["existing"]

  client = FakeStoreSDK.test(options, extra)

  # Generate idmap via transform.
  idmap = Vs.transform(
    ["product01", "product02", "product03"],
    {
      "`$PACK`" => ["", {
        "`$KEY`" => "`$COPY`",
        "`$VAL`" => ["`$FORMAT`", "upper", "`$COPY`"],
      }],
    }
  )

  # Detect ENTID env override before envOverride consumes it. When live
  # mode is on without a real override, the basic test runs against synthetic
  # IDs from the fixture and 4xx's. Surface this so the test can skip.
  entid_env_raw = ENV["FAKESTORE_TEST_PRODUCT_ENTID"]
  idmap_overridden = !entid_env_raw.nil? && entid_env_raw.strip.start_with?("{")

  env = Runner.env_override({
    "FAKESTORE_TEST_PRODUCT_ENTID" => idmap,
    "FAKESTORE_TEST_LIVE" => "FALSE",
    "FAKESTORE_TEST_EXPLAIN" => "FALSE",
  })

  idmap_resolved = Helpers.to_map(
    env["FAKESTORE_TEST_PRODUCT_ENTID"])
  if idmap_resolved.nil?
    idmap_resolved = Helpers.to_map(idmap)
  end

  if env["FAKESTORE_TEST_LIVE"] == "TRUE"
    merged_opts = Vs.merge([
      {
      },
      extra || {},
    ])
    client = FakeStoreSDK.new(Helpers.to_map(merged_opts))
  end

  live = env["FAKESTORE_TEST_LIVE"] == "TRUE"
  {
    client: client,
    data: entity_data,
    idmap: idmap_resolved,
    env: env,
    explain: env["FAKESTORE_TEST_EXPLAIN"] == "TRUE",
    live: live,
    synthetic_only: live && !idmap_overridden,
    now: (Time.now.to_f * 1000).to_i,
  }
end
