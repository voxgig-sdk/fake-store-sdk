<?php
declare(strict_types=1);

// FakeStore SDK utility: result_body

class FakeStoreResultBody
{
    public static function call(FakeStoreContext $ctx): ?FakeStoreResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result && $response && $response->json_func && $response->body) {
            $result->body = ($response->json_func)();
        }
        return $result;
    }
}
