package sdktest

import (
	"encoding/json"
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

func TestCartEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Cart(nil)
		if ent == nil {
			t.Fatal("expected non-nil CartEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := cartBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "cart." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_CART_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		cartRef01Ent := client.Cart(nil)
		cartRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "cart"}, setup.data), "cart_ref01"))

		cartRef01DataResult, err := cartRef01Ent.Create(cartRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		cartRef01Data = core.ToMapAny(cartRef01DataResult)
		if cartRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if cartRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		cartRef01Match := map[string]any{}

		cartRef01ListResult, err := cartRef01Ent.List(cartRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		cartRef01List, cartRef01ListOk := cartRef01ListResult.([]any)
		if !cartRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", cartRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(cartRef01List), map[string]any{"id": cartRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		cartRef01DataUp0Up := map[string]any{
			"id": cartRef01Data["id"],
		}

		cartRef01ResdataUp0Result, err := cartRef01Ent.Update(cartRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		cartRef01ResdataUp0 := core.ToMapAny(cartRef01ResdataUp0Result)
		if cartRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if cartRef01ResdataUp0["id"] != cartRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}

		// LOAD
		cartRef01MatchDt0 := map[string]any{
			"id": cartRef01Data["id"],
		}
		cartRef01DataDt0Loaded, err := cartRef01Ent.Load(cartRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		cartRef01DataDt0LoadResult := core.ToMapAny(cartRef01DataDt0Loaded)
		if cartRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if cartRef01DataDt0LoadResult["id"] != cartRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		cartRef01MatchRm0 := map[string]any{
			"id": cartRef01Data["id"],
		}
		_, err = cartRef01Ent.Remove(cartRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		cartRef01MatchRt0 := map[string]any{}

		cartRef01ListRt0Result, err := cartRef01Ent.List(cartRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		cartRef01ListRt0, cartRef01ListRt0Ok := cartRef01ListRt0Result.([]any)
		if !cartRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", cartRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(cartRef01ListRt0), map[string]any{"id": cartRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func cartBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "cart", "CartTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read cart test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse cart test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"cart01", "cart02", "cart03"},
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
	entidEnvRaw := os.Getenv("FAKESTORE_TEST_CART_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"FAKESTORE_TEST_CART_ENTID": idmap,
		"FAKESTORE_TEST_LIVE":      "FALSE",
		"FAKESTORE_TEST_EXPLAIN":   "FALSE",
		"FAKESTORE_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["FAKESTORE_TEST_CART_ENTID"])
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
