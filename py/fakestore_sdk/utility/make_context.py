# FakeStore SDK utility: make_context

from fakestore_sdk.core.context import FakeStoreContext


def make_context_util(ctxmap, basectx):
    return FakeStoreContext(ctxmap, basectx)
