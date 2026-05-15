<?php
declare(strict_types=1);

// FakeStore SDK utility: clean

class FakeStoreClean
{
    public static function call(FakeStoreContext $ctx, mixed $val): mixed
    {
        return $val;
    }
}
