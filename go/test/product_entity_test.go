package sdktest

import (
	"encoding/json"
	"fmt"
	"os"
	"path/filepath"
	"runtime"
	"strings"
	"testing"
	"time"

	sdk "github.com/voxgig-sdk/fake-store-sdk"
	"github.com/voxgig-sdk/fake-store-sdk/core"

	vs "github.com/voxgig/struct"
)

func TestProductEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Product(nil)
		if ent == nil {
			t.Fatal("expected non-nil ProductEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := productBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "product." + _op, _mode); _shouldSkip {
				if _reason == "" {
					_reason = "skipped via sdk-test-control.json"
				}
				t.Skip(_reason)
				return
			}
		}
		// The basic flow consumes synthetic IDs from the fixture. In live mode
		// without an *_ENTID env override, those IDs hit the live API and 4xx.
		if setup.syntheticOnly {
			t.Skip("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_PRODUCT_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		productRef01Ent := client.Product(nil)
		productRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "product"}, setup.data), "product_ref01"))

		productRef01DataResult, err := productRef01Ent.Create(productRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		productRef01Data = core.ToMapAny(productRef01DataResult)
		if productRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if productRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		productRef01Match := map[string]any{}

		productRef01ListResult, err := productRef01Ent.List(productRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		productRef01List, productRef01ListOk := productRef01ListResult.([]any)
		if !productRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", productRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(productRef01List), map[string]any{"id": productRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		productRef01DataUp0Up := map[string]any{
			"id": productRef01Data["id"],
		}

		productRef01MarkdefUp0Name := "category"
		productRef01MarkdefUp0Value := fmt.Sprintf("Mark01-product_ref01_%d", setup.now)
		productRef01DataUp0Up[productRef01MarkdefUp0Name] = productRef01MarkdefUp0Value

		productRef01ResdataUp0Result, err := productRef01Ent.Update(productRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		productRef01ResdataUp0 := core.ToMapAny(productRef01ResdataUp0Result)
		if productRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if productRef01ResdataUp0["id"] != productRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if productRef01ResdataUp0[productRef01MarkdefUp0Name] != productRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", productRef01MarkdefUp0Name, productRef01ResdataUp0[productRef01MarkdefUp0Name])
		}

		// LOAD
		productRef01MatchDt0 := map[string]any{
			"id": productRef01Data["id"],
		}
		productRef01DataDt0Loaded, err := productRef01Ent.Load(productRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		productRef01DataDt0LoadResult := core.ToMapAny(productRef01DataDt0Loaded)
		if productRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if productRef01DataDt0LoadResult["id"] != productRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		productRef01MatchRm0 := map[string]any{
			"id": productRef01Data["id"],
		}
		_, err = productRef01Ent.Remove(productRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		productRef01MatchRt0 := map[string]any{}

		productRef01ListRt0Result, err := productRef01Ent.List(productRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		productRef01ListRt0, productRef01ListRt0Ok := productRef01ListRt0Result.([]any)
		if !productRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", productRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(productRef01ListRt0), map[string]any{"id": productRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func productBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "product", "ProductTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read product test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse product test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"product01", "product02", "product03"},
		map[string]any{
			"`$PACK`": []any{"", map[string]any{
				"`$KEY`": "`$COPY`",
				"`$VAL`": []any{"`$FORMAT`", "upper", "`$COPY`"},
			}},
		},
	)

	// Detect ENTID env override before envOverride consumes it. When live
	// mode is on without a real override, the basic test runs against synthetic
	// IDs from the fixture and 4xx's. Surface this so the test can skip.
	entidEnvRaw := os.Getenv("FAKESTORE_TEST_PRODUCT_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"FAKESTORE_TEST_PRODUCT_ENTID": idmap,
		"FAKESTORE_TEST_LIVE":      "FALSE",
		"FAKESTORE_TEST_EXPLAIN":   "FALSE",
		"FAKESTORE_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["FAKESTORE_TEST_PRODUCT_ENTID"])
	if idmapResolved == nil {
		idmapResolved = core.ToMapAny(idmap)
	}

	if env["FAKESTORE_TEST_LIVE"] == "TRUE" {
		mergedOpts := vs.Merge([]any{
			map[string]any{
				"apikey": env["FAKESTORE_APIKEY"],
			},
			extra,
		})
		client = sdk.NewFakeStoreSDK(core.ToMapAny(mergedOpts))
	}

	live := env["FAKESTORE_TEST_LIVE"] == "TRUE"
	return &entityTestSetup{
		client:        client,
		data:          entityData,
		idmap:         idmapResolved,
		env:           env,
		explain:       env["FAKESTORE_TEST_EXPLAIN"] == "TRUE",
		live:          live,
		syntheticOnly: live && !idmapOverridden,
		now:           time.Now().UnixMilli(),
	}
}
