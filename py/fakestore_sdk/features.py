# FakeStore SDK feature factory

from fakestore_sdk.feature.base_feature import FakeStoreBaseFeature
from fakestore_sdk.feature.ratelimit_feature import FakeStoreRatelimitFeature
from fakestore_sdk.feature.retry_feature import FakeStoreRetryFeature
from fakestore_sdk.feature.test_feature import FakeStoreTestFeature
from fakestore_sdk.feature.timeout_feature import FakeStoreTimeoutFeature


_FEATURES = {
    "base": lambda: FakeStoreBaseFeature(),
    "ratelimit": lambda: FakeStoreRatelimitFeature(),
    "retry": lambda: FakeStoreRetryFeature(),
    "test": lambda: FakeStoreTestFeature(),
    "timeout": lambda: FakeStoreTimeoutFeature(),
}


def _make_feature(name):
    factory = _FEATURES.get(name)
    if factory is not None:
        return factory()
    return _FEATURES["base"]()


# True when this SDK was generated with the named feature class - the
# constructor's tolerance for extend-carried features reads this (an
# active name with no generated class must not become a BaseFeature
# stray when an extend instance carries it).
def _has_feature(name):
    return name in _FEATURES
