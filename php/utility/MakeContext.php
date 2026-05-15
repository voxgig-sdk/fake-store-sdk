<?php
declare(strict_types=1);

// FakeStore SDK utility: make_context

require_once __DIR__ . '/../core/Context.php';

class FakeStoreMakeContext
{
    public static function call(array $ctxmap, ?FakeStoreContext $basectx): FakeStoreContext
    {
        return new FakeStoreContext($ctxmap, $basectx);
    }
}
