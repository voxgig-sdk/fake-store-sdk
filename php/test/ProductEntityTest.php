<?php
declare(strict_types=1);

// Product entity test

require_once __DIR__ . '/../fakestore_sdk.php';
require_once __DIR__ . '/Runner.php';

use PHPUnit\Framework\TestCase;
use Voxgig\Struct\Struct as Vs;

class ProductEntityTest extends TestCase
{
    public function test_create_instance(): void
    {
        $testsdk = FakeStoreSDK::test(null, null);
        $ent = $testsdk->Product(null);
        $this->assertNotNull($ent);
    }

    public function test_basic_flow(): void
    {
        $setup = product_basic_setup(null);
        // Per-op sdk-test-control.json skip.
        $_live = !empty($setup["live"]);
        foreach (["create", "list", "update", "load", "remove"] as $_op) {
            [$_shouldSkip, $_reason] = Runner::is_control_skipped("entityOp", "product." . $_op, $_live ? "live" : "unit");
            if ($_shouldSkip) {
                $this->markTestSkipped($_reason ?? "skipped via sdk-test-control.json");
                return;
            }
        }
        // The basic flow consumes synthetic IDs from the fixture. In live mode
        // without an *_ENTID env override, those IDs hit the live API and 4xx.
        if (!empty($setup["synthetic_only"])) {
            $this->markTestSkipped("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_PRODUCT_ENTID JSON to run live");
            return;
        }
        $client = $setup["client"];

        // CREATE
        $product_ref01_ent = $client->Product(null);
        $product_ref01_data = Helpers::to_map(Vs::getprop(
            Vs::getpath($setup["data"], "new.product"), "product_ref01"));

        [$product_ref01_data_result, $err] = $product_ref01_ent->create($product_ref01_data, null);
        $this->assertNull($err);
        $product_ref01_data = Helpers::to_map($product_ref01_data_result);
        $this->assertNotNull($product_ref01_data);
        $this->assertNotNull($product_ref01_data["id"]);

        // LIST
        $product_ref01_match = [];

        [$product_ref01_list_result, $err] = $product_ref01_ent->list($product_ref01_match, null);
        $this->assertNull($err);
        $this->assertIsArray($product_ref01_list_result);

        $found_item = sdk_select(
            Runner::entity_list_to_data($product_ref01_list_result),
            ["id" => $product_ref01_data["id"]]);
        $this->assertNotEmpty($found_item);

        // UPDATE
        $product_ref01_data_up0_up = [
            "id" => $product_ref01_data["id"],
        ];

        $product_ref01_markdef_up0_name = "category";
        $product_ref01_markdef_up0_value = "Mark01-product_ref01_" . $setup["now"];
        $product_ref01_data_up0_up[$product_ref01_markdef_up0_name] = $product_ref01_markdef_up0_value;

        [$product_ref01_resdata_up0_result, $err] = $product_ref01_ent->update($product_ref01_data_up0_up, null);
        $this->assertNull($err);
        $product_ref01_resdata_up0 = Helpers::to_map($product_ref01_resdata_up0_result);
        $this->assertNotNull($product_ref01_resdata_up0);
        $this->assertEquals($product_ref01_resdata_up0["id"], $product_ref01_data_up0_up["id"]);
        $this->assertEquals($product_ref01_resdata_up0[$product_ref01_markdef_up0_name], $product_ref01_markdef_up0_value);

        // LOAD
        $product_ref01_match_dt0 = [
            "id" => $product_ref01_data["id"],
        ];
        [$product_ref01_data_dt0_loaded, $err] = $product_ref01_ent->load($product_ref01_match_dt0, null);
        $this->assertNull($err);
        $product_ref01_data_dt0_load_result = Helpers::to_map($product_ref01_data_dt0_loaded);
        $this->assertNotNull($product_ref01_data_dt0_load_result);
        $this->assertEquals($product_ref01_data_dt0_load_result["id"], $product_ref01_data["id"]);

        // REMOVE
        $product_ref01_match_rm0 = [
            "id" => $product_ref01_data["id"],
        ];
        [$_, $err] = $product_ref01_ent->remove($product_ref01_match_rm0, null);
        $this->assertNull($err);

        // LIST
        $product_ref01_match_rt0 = [];

        [$product_ref01_list_rt0_result, $err] = $product_ref01_ent->list($product_ref01_match_rt0, null);
        $this->assertNull($err);
        $this->assertIsArray($product_ref01_list_rt0_result);

        $not_found_item = sdk_select(
            Runner::entity_list_to_data($product_ref01_list_rt0_result),
            ["id" => $product_ref01_data["id"]]);
        $this->assertEmpty($not_found_item);

    }
}

function product_basic_setup($extra)
{
    Runner::load_env_local();

    $entity_data_file = __DIR__ . '/../../.sdk/test/entity/product/ProductTestData.json';
    $entity_data_source = file_get_contents($entity_data_file);
    $entity_data = json_decode($entity_data_source, true);

    $options = [];
    $options["entity"] = $entity_data["existing"];

    $client = FakeStoreSDK::test($options, $extra);

    // Generate idmap.
    $idmap = [];
    foreach (["product01", "product02", "product03"] as $k) {
        $idmap[$k] = strtoupper($k);
    }

    // Detect ENTID env override before envOverride consumes it. When live
    // mode is on without a real override, the basic test runs against synthetic
    // IDs from the fixture and 4xx's. Surface this so the test can skip.
    $entid_env_raw = getenv("FAKESTORE_TEST_PRODUCT_ENTID");
    $idmap_overridden = $entid_env_raw !== false && str_starts_with(trim($entid_env_raw), "{");

    $env = Runner::env_override([
        "FAKESTORE_TEST_PRODUCT_ENTID" => $idmap,
        "FAKESTORE_TEST_LIVE" => "FALSE",
        "FAKESTORE_TEST_EXPLAIN" => "FALSE",
        "FAKESTORE_APIKEY" => "NONE",
    ]);

    $idmap_resolved = Helpers::to_map(
        $env["FAKESTORE_TEST_PRODUCT_ENTID"]);
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
