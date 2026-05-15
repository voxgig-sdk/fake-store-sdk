# ProjectName SDK exists test

import pytest
from fakestore_sdk import FakeStoreSDK


class TestExists:

    def test_should_create_test_sdk(self):
        testsdk = FakeStoreSDK.test(None, None)
        assert testsdk is not None
