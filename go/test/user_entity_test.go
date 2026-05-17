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

	sdk "github.com/voxgig-sdk/fake-store-sdk/go"
	"github.com/voxgig-sdk/fake-store-sdk/go/core"

	vs "github.com/voxgig-sdk/fake-store-sdk/go/utility/struct"
)

func TestUserEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.User(nil)
		if ent == nil {
			t.Fatal("expected non-nil UserEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := userBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create", "list", "update", "load", "remove"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "user." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_USER_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		userRef01Ent := client.User(nil)
		userRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "user"}, setup.data), "user_ref01"))

		userRef01DataResult, err := userRef01Ent.Create(userRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		userRef01Data = core.ToMapAny(userRef01DataResult)
		if userRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}
		if userRef01Data["id"] == nil {
			t.Fatal("expected created entity to have an id")
		}

		// LIST
		userRef01Match := map[string]any{}

		userRef01ListResult, err := userRef01Ent.List(userRef01Match, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		userRef01List, userRef01ListOk := userRef01ListResult.([]any)
		if !userRef01ListOk {
			t.Fatalf("expected list result to be an array, got %T", userRef01ListResult)
		}

		foundItem := vs.Select(entityListToData(userRef01List), map[string]any{"id": userRef01Data["id"]})
		if vs.IsEmpty(foundItem) {
			t.Fatal("expected to find created entity in list")
		}

		// UPDATE
		userRef01DataUp0Up := map[string]any{
			"id": userRef01Data["id"],
		}

		userRef01MarkdefUp0Name := "email"
		userRef01MarkdefUp0Value := fmt.Sprintf("Mark01-user_ref01_%d", setup.now)
		userRef01DataUp0Up[userRef01MarkdefUp0Name] = userRef01MarkdefUp0Value

		userRef01ResdataUp0Result, err := userRef01Ent.Update(userRef01DataUp0Up, nil)
		if err != nil {
			t.Fatalf("update failed: %v", err)
		}
		userRef01ResdataUp0 := core.ToMapAny(userRef01ResdataUp0Result)
		if userRef01ResdataUp0 == nil {
			t.Fatal("expected update result to be a map")
		}
		if userRef01ResdataUp0["id"] != userRef01DataUp0Up["id"] {
			t.Fatal("expected update result id to match")
		}
		if userRef01ResdataUp0[userRef01MarkdefUp0Name] != userRef01MarkdefUp0Value {
			t.Fatalf("expected %s to be updated, got %v", userRef01MarkdefUp0Name, userRef01ResdataUp0[userRef01MarkdefUp0Name])
		}

		// LOAD
		userRef01MatchDt0 := map[string]any{
			"id": userRef01Data["id"],
		}
		userRef01DataDt0Loaded, err := userRef01Ent.Load(userRef01MatchDt0, nil)
		if err != nil {
			t.Fatalf("load failed: %v", err)
		}
		userRef01DataDt0LoadResult := core.ToMapAny(userRef01DataDt0Loaded)
		if userRef01DataDt0LoadResult == nil {
			t.Fatal("expected load result to be a map")
		}
		if userRef01DataDt0LoadResult["id"] != userRef01Data["id"] {
			t.Fatal("expected load result id to match")
		}

		// REMOVE
		userRef01MatchRm0 := map[string]any{
			"id": userRef01Data["id"],
		}
		_, err = userRef01Ent.Remove(userRef01MatchRm0, nil)
		if err != nil {
			t.Fatalf("remove failed: %v", err)
		}

		// LIST
		userRef01MatchRt0 := map[string]any{}

		userRef01ListRt0Result, err := userRef01Ent.List(userRef01MatchRt0, nil)
		if err != nil {
			t.Fatalf("list failed: %v", err)
		}
		userRef01ListRt0, userRef01ListRt0Ok := userRef01ListRt0Result.([]any)
		if !userRef01ListRt0Ok {
			t.Fatalf("expected list result to be an array, got %T", userRef01ListRt0Result)
		}

		notFoundItem := vs.Select(entityListToData(userRef01ListRt0), map[string]any{"id": userRef01Data["id"]})
		if !vs.IsEmpty(notFoundItem) {
			t.Fatal("expected removed entity to not be in list")
		}

	})
}

func userBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "user", "UserTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read user test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse user test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"user01", "user02", "user03"},
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
	entidEnvRaw := os.Getenv("FAKESTORE_TEST_USER_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"FAKESTORE_TEST_USER_ENTID": idmap,
		"FAKESTORE_TEST_LIVE":      "FALSE",
		"FAKESTORE_TEST_EXPLAIN":   "FALSE",
		"FAKESTORE_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["FAKESTORE_TEST_USER_ENTID"])
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
