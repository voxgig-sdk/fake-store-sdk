<?php
declare(strict_types=1);

// FakeStore SDK utility: prepare_body

class FakeStorePrepareBody
{
    public static function call(FakeStoreContext $ctx): mixed
    {
        if ($ctx->op->input === 'data') {
            return ($ctx->utility->transform_request)($ctx);
        }
        return null;
    }
}
