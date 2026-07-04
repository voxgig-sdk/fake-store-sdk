# User entity test

import json
import os
import time

import pytest

from utility.voxgig_struct import voxgig_struct as vs
from fakestore_sdk import FakeStoreSDK
from core import helpers

_TEST_DIR = os.path.dirname(os.path.abspath(__file__))
from test import runner


class TestUserEntity:

    def test_should_create_instance(self):
        testsdk = FakeStoreSDK.test(None, None)
        ent = testsdk.User(None)
        assert ent is not None

    def test_should_run_basic_flow(self):
        setup = _user_basic_setup(None)
        # Per-op sdk-test-control.json skip — basic test exercises a flow with
        # multiple ops; skipping any one skips the whole flow (steps depend
        # on each other).
        _live = setup.get("live", False)
        for _op in ["create", "list", "update", "load", "remove"]:
            _skip, _reason = runner.is_control_skipped("entityOp", "user." + _op, "live" if _live else "unit")
            if _skip:
                pytest.skip(_reason or "skipped via sdk-test-control.json")
                return
        # The basic flow consumes synthetic IDs from the fixture. In live mode
        # without an *_ENTID env override, those IDs hit the live API and 4xx.
        if setup.get("synthetic_only"):
            pytest.skip("live entity test uses synthetic IDs from fixture — "
                        "set FAKESTORE_TEST_USER_ENTID JSON to run live")
        client = setup["client"]

        # CREATE
        user_ref01_ent = client.User(None)
        user_ref01_data = helpers.to_map(vs.getprop(
            vs.getpath(setup["data"], "new.user"), "user_ref01"))

        user_ref01_data = helpers.to_map(user_ref01_ent.create(user_ref01_data, None))
        assert user_ref01_data is not None
        assert user_ref01_data["id"] is not None

        # LIST
        user_ref01_match = {}

        user_ref01_list_result = user_ref01_ent.list(user_ref01_match, None)
        assert isinstance(user_ref01_list_result, list)

        found_item = vs.select(
            runner.entity_list_to_data(user_ref01_list_result),
            {"id": user_ref01_data["id"]})
        assert not vs.isempty(found_item)

        # UPDATE
        user_ref01_data_up0_up = {
            "id": user_ref01_data["id"],
        }

        user_ref01_markdef_up0_name = "email"
        user_ref01_markdef_up0_value = "Mark01-user_ref01_" + str(setup["now"])
        user_ref01_data_up0_up[user_ref01_markdef_up0_name] = user_ref01_markdef_up0_value

        user_ref01_resdata_up0 = helpers.to_map(user_ref01_ent.update(user_ref01_data_up0_up, None))
        assert user_ref01_resdata_up0 is not None
        assert user_ref01_resdata_up0["id"] == user_ref01_data_up0_up["id"]
        assert user_ref01_resdata_up0[user_ref01_markdef_up0_name] == user_ref01_markdef_up0_value

        # LOAD
        user_ref01_match_dt0 = {
            "id": user_ref01_data["id"],
        }
        user_ref01_data_dt0_loaded = user_ref01_ent.load(user_ref01_match_dt0, None)
        user_ref01_data_dt0_load_result = helpers.to_map(user_ref01_data_dt0_loaded)
        assert user_ref01_data_dt0_load_result is not None
        assert user_ref01_data_dt0_load_result["id"] == user_ref01_data["id"]

        # REMOVE
        user_ref01_match_rm0 = {
            "id": user_ref01_data["id"],
        }
        user_ref01_ent.remove(user_ref01_match_rm0, None)

        # LIST
        user_ref01_match_rt0 = {}

        user_ref01_list_rt0_result = user_ref01_ent.list(user_ref01_match_rt0, None)
        assert isinstance(user_ref01_list_rt0_result, list)

        not_found_item = vs.select(
            runner.entity_list_to_data(user_ref01_list_rt0_result),
            {"id": user_ref01_data["id"]})
        assert vs.isempty(not_found_item)



def _user_basic_setup(extra):
    runner.load_env_local()

    entity_data_file = os.path.join(_TEST_DIR, "../../.sdk/test/entity/user/UserTestData.json")
    with open(entity_data_file, "r") as f:
        entity_data_source = f.read()

    entity_data = json.loads(entity_data_source)

    options = {}
    options["entity"] = entity_data.get("existing")

    client = FakeStoreSDK.test(options, extra)

    # Generate idmap via transform.
    idmap = vs.transform(
        ["user01", "user02", "user03"],
        {
            "`$PACK`": ["", {
                "`$KEY`": "`$COPY`",
                "`$VAL`": ["`$FORMAT`", "upper", "`$COPY`"],
            }],
        }
    )

    # Detect ENTID env override before envOverride consumes it. When live
    # mode is on without a real override, the basic test runs against synthetic
    # IDs from the fixture and 4xx's. We surface this so the test can skip.
    _entid_env_raw = os.environ.get(
        "FAKESTORE_TEST_USER_ENTID")
    _idmap_overridden = _entid_env_raw is not None and _entid_env_raw.strip().startswith("{")

    env = runner.env_override({
        "FAKESTORE_TEST_USER_ENTID": idmap,
        "FAKESTORE_TEST_LIVE": "FALSE",
        "FAKESTORE_TEST_EXPLAIN": "FALSE",
    })

    idmap_resolved = helpers.to_map(
        env.get("FAKESTORE_TEST_USER_ENTID"))
    if idmap_resolved is None:
        idmap_resolved = helpers.to_map(idmap)

    if env.get("FAKESTORE_TEST_LIVE") == "TRUE":
        merged_opts = vs.merge([
            {
            },
            extra or {},
        ])
        client = FakeStoreSDK(helpers.to_map(merged_opts))

    _live = env.get("FAKESTORE_TEST_LIVE") == "TRUE"
    return {
        "client": client,
        "data": entity_data,
        "idmap": idmap_resolved,
        "env": env,
        "explain": env.get("FAKESTORE_TEST_EXPLAIN") == "TRUE",
        "live": _live,
        "synthetic_only": _live and not _idmap_overridden,
        "now": int(time.time() * 1000),
    }
