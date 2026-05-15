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

func TestLoginEntity(t *testing.T) {
	t.Run("instance", func(t *testing.T) {
		testsdk := sdk.TestSDK(nil, nil)
		ent := testsdk.Login(nil)
		if ent == nil {
			t.Fatal("expected non-nil LoginEntity")
		}
	})

	t.Run("basic", func(t *testing.T) {
		setup := loginBasicSetup(nil)
		// Per-op sdk-test-control.json skip — basic test exercises a flow
		// with multiple ops; skipping any op skips the whole flow.
		_mode := "unit"
		if setup.live {
			_mode = "live"
		}
		for _, _op := range []string{"create"} {
			if _shouldSkip, _reason := isControlSkipped("entityOp", "login." + _op, _mode); _shouldSkip {
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
			t.Skip("live entity test uses synthetic IDs from fixture — set FAKESTORE_TEST_LOGIN_ENTID JSON to run live")
			return
		}
		client := setup.client

		// CREATE
		loginRef01Ent := client.Login(nil)
		loginRef01Data := core.ToMapAny(vs.GetProp(
			vs.GetPath([]any{"new", "login"}, setup.data), "login_ref01"))

		loginRef01DataResult, err := loginRef01Ent.Create(loginRef01Data, nil)
		if err != nil {
			t.Fatalf("create failed: %v", err)
		}
		loginRef01Data = core.ToMapAny(loginRef01DataResult)
		if loginRef01Data == nil {
			t.Fatal("expected create result to be a map")
		}

	})
}

func loginBasicSetup(extra map[string]any) *entityTestSetup {
	loadEnvLocal()

	_, filename, _, _ := runtime.Caller(0)
	dir := filepath.Dir(filename)

	entityDataFile := filepath.Join(dir, "..", "..", ".sdk", "test", "entity", "login", "LoginTestData.json")

	entityDataSource, err := os.ReadFile(entityDataFile)
	if err != nil {
		panic("failed to read login test data: " + err.Error())
	}

	var entityData map[string]any
	if err := json.Unmarshal(entityDataSource, &entityData); err != nil {
		panic("failed to parse login test data: " + err.Error())
	}

	options := map[string]any{}
	options["entity"] = entityData["existing"]

	client := sdk.TestSDK(options, extra)

	// Generate idmap via transform, matching TS pattern.
	idmap := vs.Transform(
		[]any{"login01", "login02", "login03"},
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
	entidEnvRaw := os.Getenv("FAKESTORE_TEST_LOGIN_ENTID")
	idmapOverridden := entidEnvRaw != "" && strings.HasPrefix(strings.TrimSpace(entidEnvRaw), "{")

	env := envOverride(map[string]any{
		"FAKESTORE_TEST_LOGIN_ENTID": idmap,
		"FAKESTORE_TEST_LIVE":      "FALSE",
		"FAKESTORE_TEST_EXPLAIN":   "FALSE",
		"FAKESTORE_APIKEY":         "NONE",
	})

	idmapResolved := core.ToMapAny(env["FAKESTORE_TEST_LOGIN_ENTID"])
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
