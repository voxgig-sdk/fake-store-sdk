
import { Context } from './Context'


class FakeStoreError extends Error {

  isFakeStoreError = true

  sdk = 'FakeStore'

  code: string
  ctx: Context

  constructor(code: string, msg: string, ctx: Context) {
    super(msg)
    this.code = code
    this.ctx = ctx
  }

}

export {
  FakeStoreError
}

