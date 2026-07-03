-- User entity test

local json = require("dkjson")
local vs = require("utility.struct.struct")
local sdk = require("fake-store_sdk")
local helpers = require("core.helpers")
local runner = require("test.runner")

local _test_dir = debug.getinfo(1, "S").source:match("^@(.+/)")  or "./"

describe("UserEntity", function()
  it("should create instance", function()
    local testsdk = sdk.test(nil, nil)
    local ent = testsdk:User(nil)
    assert.is_not_nil(ent)
  end)

  it("should run basic flow", function()
    local setup = user_basic_setup(nil)
    -- Per-op sdk-test-control.json skip.
    local _live = setup.live or false
    for _, _op in ipairs({"create", "list", "update", "load", "remove"}) do
      local _should_skip, _reason = runner.is_control_skipped("entityOp", "user." .. _op, _live and "live" or "unit")
      if _should_skip then
        pending(_reason or "skipped via sdk-test-control.json")
        return
      end
    end
    -- The basic flow consumes synthetic IDs from the fixture. In live mode
    -- without an *_ENTID env override, those IDs hit the live API and 4xx.
    if setup.synthetic_only then
      pending("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_USER_ENTID JSON to run live")
      return
    end
    local client = setup.client

    -- CREATE
    local user_ref01_ent = client:User(nil)
    local user_ref01_data = helpers.to_map(vs.getprop(
      vs.getpath(setup.data, "new.user"), "user_ref01"))

    local user_ref01_data_result, err = user_ref01_ent:create(user_ref01_data, nil)
    assert.is_nil(err)
    user_ref01_data = helpers.to_map(user_ref01_data_result)
    assert.is_not_nil(user_ref01_data)
    assert.is_not_nil(user_ref01_data["id"])

    -- LIST
    local user_ref01_match = {}

    local user_ref01_list_result, err = user_ref01_ent:list(user_ref01_match, nil)
    assert.is_nil(err)
    assert.is_table(user_ref01_list_result)

    local found_item = vs.select(
      runner.entity_list_to_data(user_ref01_list_result),
      { id = user_ref01_data["id"] })
    assert.is_false(vs.isempty(found_item))

    -- UPDATE
    local user_ref01_data_up0_up = {
      id = user_ref01_data["id"],
    }

    local user_ref01_markdef_up0_name = "email"
    local user_ref01_markdef_up0_value = "Mark01-user_ref01_" .. tostring(setup.now)
    user_ref01_data_up0_up[user_ref01_markdef_up0_name] = user_ref01_markdef_up0_value

    local user_ref01_resdata_up0_result, err = user_ref01_ent:update(user_ref01_data_up0_up, nil)
    assert.is_nil(err)
    local user_ref01_resdata_up0 = helpers.to_map(user_ref01_resdata_up0_result)
    assert.is_not_nil(user_ref01_resdata_up0)
    assert.are.equal(user_ref01_resdata_up0["id"], user_ref01_data_up0_up["id"])
    assert.are.equal(user_ref01_resdata_up0[user_ref01_markdef_up0_name], user_ref01_markdef_up0_value)

    -- LOAD
    local user_ref01_match_dt0 = {
      id = user_ref01_data["id"],
    }
    local user_ref01_data_dt0_loaded, err = user_ref01_ent:load(user_ref01_match_dt0, nil)
    assert.is_nil(err)
    local user_ref01_data_dt0_load_result = helpers.to_map(user_ref01_data_dt0_loaded)
    assert.is_not_nil(user_ref01_data_dt0_load_result)
    assert.are.equal(user_ref01_data_dt0_load_result["id"], user_ref01_data["id"])

    -- REMOVE
    local user_ref01_match_rm0 = {
      id = user_ref01_data["id"],
    }
    local _, err = user_ref01_ent:remove(user_ref01_match_rm0, nil)
    assert.is_nil(err)

    -- LIST
    local user_ref01_match_rt0 = {}

    local user_ref01_list_rt0_result, err = user_ref01_ent:list(user_ref01_match_rt0, nil)
    assert.is_nil(err)
    assert.is_table(user_ref01_list_rt0_result)

    local not_found_item = vs.select(
      runner.entity_list_to_data(user_ref01_list_rt0_result),
      { id = user_ref01_data["id"] })
    assert.is_true(vs.isempty(not_found_item))

  end)
end)

function user_basic_setup(extra)
  runner.load_env_local()

  local entity_data_file = _test_dir .. "../../.sdk/test/entity/user/UserTestData.json"
  local f = io.open(entity_data_file, "r")
  if f == nil then
    error("failed to read user test data: " .. entity_data_file)
  end
  local entity_data_source = f:read("*a")
  f:close()

  local entity_data = json.decode(entity_data_source)

  local options = {}
  options["entity"] = entity_data["existing"]

  local client = sdk.test(options, extra)

  -- Generate idmap via transform.
  local idmap = vs.transform(
    { "user01", "user02", "user03" },
    {
      ["`$PACK`"] = { "", {
        ["`$KEY`"] = "`$COPY`",
        ["`$VAL`"] = { "`$FORMAT`", "upper", "`$COPY`" },
      }},
    }
  )

  -- Detect ENTID env override before envOverride consumes it. When live
  -- mode is on without a real override, the basic test runs against synthetic
  -- IDs from the fixture and 4xx's. Surface this so the test can skip.
  local entid_env_raw = os.getenv("FAKESTORE_TEST_USER_ENTID")
  local idmap_overridden = entid_env_raw ~= nil and entid_env_raw:match("^%s*{") ~= nil

  local env = runner.env_override({
    ["FAKESTORE_TEST_USER_ENTID"] = idmap,
    ["FAKESTORE_TEST_LIVE"] = "FALSE",
    ["FAKESTORE_TEST_EXPLAIN"] = "FALSE",
    ["FAKESTORE_APIKEY"] = "NONE",
  })

  local idmap_resolved = helpers.to_map(
    env["FAKESTORE_TEST_USER_ENTID"])
  if idmap_resolved == nil then
    idmap_resolved = helpers.to_map(idmap)
  end

  if env["FAKESTORE_TEST_LIVE"] == "TRUE" then
    local merged_opts = vs.merge({
      {
        apikey = env["FAKESTORE_APIKEY"],
      },
      extra or {},
    })
    client = sdk.new(helpers.to_map(merged_opts))
  end

  local live = env["FAKESTORE_TEST_LIVE"] == "TRUE"
  return {
    client = client,
    data = entity_data,
    idmap = idmap_resolved,
    env = env,
    explain = env["FAKESTORE_TEST_EXPLAIN"] == "TRUE",
    live = live,
    synthetic_only = live and not idmap_overridden,
    now = os.time() * 1000,
  }
end
