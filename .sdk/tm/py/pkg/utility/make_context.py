# FakeStore SDK utility: make_context

from projectname_sdk.core.context import FakeStoreContext


def make_context_util(ctxmap, basectx):
    return FakeStoreContext(ctxmap, basectx)
