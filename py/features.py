# FakeStore SDK feature factory

from feature.base_feature import FakeStoreBaseFeature
from feature.test_feature import FakeStoreTestFeature


def _make_feature(name):
    features = {
        "base": lambda: FakeStoreBaseFeature(),
        "test": lambda: FakeStoreTestFeature(),
    }
    factory = features.get(name)
    if factory is not None:
        return factory()
    return features["base"]()
