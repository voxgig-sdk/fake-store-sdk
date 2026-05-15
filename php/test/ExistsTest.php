<?php
declare(strict_types=1);

// FakeStore SDK exists test

require_once __DIR__ . '/../fakestore_sdk.php';

use PHPUnit\Framework\TestCase;

class ExistsTest extends TestCase
{
    public function test_create_test_sdk(): void
    {
        $testsdk = FakeStoreSDK::test(null, null);
        $this->assertNotNull($testsdk);
    }
}
