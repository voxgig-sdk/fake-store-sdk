<?php
declare(strict_types=1);

// FakeStore SDK utility: feature_add

class FakeStoreFeatureAdd
{
    public static function call(FakeStoreContext $ctx, mixed $f): void
    {
        $ctx->client->features[] = $f;
    }
}
