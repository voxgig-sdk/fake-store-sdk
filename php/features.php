<?php
declare(strict_types=1);

// FakeStore SDK feature factory

require_once __DIR__ . '/feature/BaseFeature.php';
require_once __DIR__ . '/feature/TestFeature.php';


class FakeStoreFeatures
{
    public static function make_feature(string $name)
    {
        switch ($name) {
            case "base":
                return new FakeStoreBaseFeature();
            case "test":
                return new FakeStoreTestFeature();
            default:
                return new FakeStoreBaseFeature();
        }
    }
}
