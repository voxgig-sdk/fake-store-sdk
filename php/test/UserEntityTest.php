<?php
declare(strict_types=1);

// User entity test

require_once __DIR__ . '/../fakestore_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class UserEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = FakeStoreSDK::test(null, null);
        $ent = $testsdk->User(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = user_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "list", "update", "load", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "user." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_USER_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $user_ref01_ent = $client->User(null);
        $user_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.user"), "user_ref01"));

        [$user_ref01_data_result, $err] = $user_ref01_ent->create($user_ref01_data, null);
        $this->assertNull($err);
        $user_ref01_data = Helpers::to_map($user_ref01_data_result);
        $this->assertNotNull($user_ref01_data);
        $this->assertNotNull($user_ref01_data["id"]);

        // LIST
        $user_ref01_match = [];

        [$user_ref01_list_result, $err] = $user_ref01_ent->list($user_ref01_match, null);
        $this->assertNull($err);
        $this->assertIsArray($user_ref01_list_result);

        $found_item = sdk_select(
            Runner::entity_list_to_data($user_ref01_list_result),
            ["id" => $user_ref01_data["id"]]);
        $this->assertNotEmpty($found_item);

        // UPDATE
        $user_ref01_data_up0_up = [
            "id" => $user_ref01_data["id"],
        ];

        $user_ref01_markdef_up0_name = "email";
        $user_ref01_markdef_up0_value = "Mark01-user_ref01_" . $setup["now"];
        $user_ref01_data_up0_up[$user_ref01_markdef_up0_name] = $user_ref01_markdef_up0_value;

        [$user_ref01_resdata_up0_result, $err] = $user_ref01_ent->update($user_ref01_data_up0_up, null);
        $this->assertNull($err);
        $user_ref01_resdata_up0 = Helpers::to_map($user_ref01_resdata_up0_result);
        $this->assertNotNull($user_ref01_resdata_up0);
        $this->assertEquals($user_ref01_resdata_up0["id"], $user_ref01_data_up0_up["id"]);
        $this->assertEquals($user_ref01_resdata_up0[$user_ref01_markdef_up0_name], $user_ref01_markdef_up0_value);

        // LOAD
        $user_ref01_match_dt0 = [
            "id" => $user_ref01_data["id"],
        ];
        [$user_ref01_data_dt0_loaded, $err] = $user_ref01_ent->load($user_ref01_match_dt0, null);
        $this->assertNull($err);
        $user_ref01_data_dt0_load_result = Helpers::to_map($user_ref01_data_dt0_loaded);
        $this->assertNotNull($user_ref01_data_dt0_load_result);
        $this->assertEquals($user_ref01_data_dt0_load_result["id"], $user_ref01_data["id"]);

        // REMOVE
        $user_ref01_match_rm0 = [
            "id" => $user_ref01_data["id"],
        ];
        [$_, $err] = $user_ref01_ent->remove($user_ref01_match_rm0, null);
        $this->assertNull($err);

        // LIST
        $user_ref01_match_rt0 = [];

        [$user_ref01_list_rt0_result, $err] = $user_ref01_ent->list($user_ref01_match_rt0, null);
        $this->assertNull($err);
        $this->assertIsArray($user_ref01_list_rt0_result);

        $not_found_item = sdk_select(
            Runner::entity_list_to_data($user_ref01_list_rt0_result),
            ["id" => $user_ref01_data["id"]]);
        $this->assertEmpty($not_found_item);

    }
}

function user_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/user/UserTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = FakeStoreSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["user01", "user02", "user03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("FAKESTORE_TEST_USER_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "FAKESTORE_TEST_USER_ENTID" => $idmap,
        "FAKESTORE_TEST_LIVE" => "FALSE",
        "FAKESTORE_TEST_EXPLAIN" => "FALSE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["FAKESTORE_TEST_USER_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["FAKESTORE_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
            ],
            $extra ?? [],
        ]);
        $client = new FakeStoreSDK(Helpers::to_map($merged_opts));
    }

    $live = $env["FAKESTORE_TEST_LIVE"] === "TRUE";
    return [
        "client" => $client,
        "data" => $entity_data,
        "idmap" => $idmap_resolved,
        "env" => $env,
        "explain" => $env["FAKESTORE_TEST_EXPLAIN"] === "TRUE",
        "live" => $live,
        "synthetic_only" => $live && !$idmap_overridden,
        "now" => (int)(microtime(true) * 1000),
    ];
}
