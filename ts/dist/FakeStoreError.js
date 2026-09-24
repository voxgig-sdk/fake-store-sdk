"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.FakeStoreError = void 0;
class FakeStoreError extends Error {
    isFakeStoreError = true;
    sdk = 'FakeStore';
    code;
    ctx;
    status = -1;
    // `err.notFound` rather than a magic number at every call site.
    get notFound() { return 404 === this.status; }
    constructor(code, msg, ctx) {
        super(msg);
        this.code = code;
        this.ctx = ctx;
    }
}
exports.FakeStoreError = FakeStoreError;
//# sourceMappingURL=FakeStoreError.js.map