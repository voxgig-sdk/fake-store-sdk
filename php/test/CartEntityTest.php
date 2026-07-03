<?php
declare(strict_types=1);

// Cart entity test

require_once __DIR__ . '/../fakestore_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class CartEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = FakeStoreSDK::test(null, null);
        $ent = $testsdk->Cart(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = cart_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "list", "update", "load", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "cart." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_CART_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $cart_ref01_ent = $client->Cart(null);
        $cart_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.cart"), "cart_ref01"));

        [$cart_ref01_data_result, $err] = $cart_ref01_ent->create($cart_ref01_data, null);
        $this->assertNull($err);
        $cart_ref01_data = Helpers::to_map($cart_ref01_data_result);
        $this->assertNotNull($cart_ref01_data);
        $this->assertNotNull($cart_ref01_data["id"]);

        // LIST
        $cart_ref01_match = [];

        [$cart_ref01_list_result, $err] = $cart_ref01_ent->list($cart_ref01_match, null);
        $this->assertNull($err);
        $this->assertIsArray($cart_ref01_list_result);

        $found_item = sdk_select(
            Runner::entity_list_to_data($cart_ref01_list_result),
            ["id" => $cart_ref01_data["id"]]);
        $this->assertNotEmpty($found_item);

        // UPDATE
        $cart_ref01_data_up0_up = [
            "id" => $cart_ref01_data["id"],
        ];

        [$cart_ref01_resdata_up0_result, $err] = $cart_ref01_ent->update($cart_ref01_data_up0_up, null);
        $this->assertNull($err);
        $cart_ref01_resdata_up0 = Helpers::to_map($cart_ref01_resdata_up0_result);
        $this->assertNotNull($cart_ref01_resdata_up0);
        $this->assertEquals($cart_ref01_resdata_up0["id"], $cart_ref01_data_up0_up["id"]);

        // LOAD
        $cart_ref01_match_dt0 = [
            "id" => $cart_ref01_data["id"],
        ];
        [$cart_ref01_data_dt0_loaded, $err] = $cart_ref01_ent->load($cart_ref01_match_dt0, null);
        $this->assertNull($err);
        $cart_ref01_data_dt0_load_result = Helpers::to_map($cart_ref01_data_dt0_loaded);
        $this->assertNotNull($cart_ref01_data_dt0_load_result);
        $this->assertEquals($cart_ref01_data_dt0_load_result["id"], $cart_ref01_data["id"]);

        // REMOVE
        $cart_ref01_match_rm0 = [
            "id" => $cart_ref01_data["id"],
        ];
        [$_, $err] = $cart_ref01_ent->remove($cart_ref01_match_rm0, null);
        $this->assertNull($err);

        // LIST
        $cart_ref01_match_rt0 = [];

        [$cart_ref01_list_rt0_result, $err] = $cart_ref01_ent->list($cart_ref01_match_rt0, null);
        $this->assertNull($err);
        $this->assertIsArray($cart_ref01_list_rt0_result);

        $not_found_item = sdk_select(
            Runner::entity_list_to_data($cart_ref01_list_rt0_result),
            ["id" => $cart_ref01_data["id"]]);
        $this->assertEmpty($not_found_item);

    }
}

function cart_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/cart/CartTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = FakeStoreSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["cart01", "cart02", "cart03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("FAKESTORE_TEST_CART_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "FAKESTORE_TEST_CART_ENTID" => $idmap,
        "FAKESTORE_TEST_LIVE" => "FALSE",
        "FAKESTORE_TEST_EXPLAIN" => "FALSE",
        "FAKESTORE_APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["FAKESTORE_TEST_CART_ENTID"]);
    if ($idmap_resolved === null) {
        $idmap_resolved = Helpers::to_map($idmap);
    }

    if ($env["FAKESTORE_TEST_LIVE"] === "TRUE") {
        $merged_opts = Vs::merge([
            [
                "apikey" => $env["FAKESTORE_APIKEY"],
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
