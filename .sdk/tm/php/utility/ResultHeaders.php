<?php
declare(strict_types=1);

// FakeStore SDK utility: result_headers

class FakeStoreResultHeaders
{
    public static function call(FakeStoreContext $ctx): ?FakeStoreResult
    {
        $response = $ctx->response;
        $result = $ctx->result;
        if ($result) {
            if ($response && is_array($response->headers)) {
                $result->headers = $response->headers;
            } else {
                $result->headers = [];
            }
        }
        return $result;
    }
}
