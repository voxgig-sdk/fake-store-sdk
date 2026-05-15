package core

type FakeStoreError struct {
	IsFakeStoreError bool
	Sdk              string
	Code             string
	Msg              string
	Ctx              *Context
	Result           any
	Spec             any
}

func NewFakeStoreError(code string, msg string, ctx *Context) *FakeStoreError {
	return &FakeStoreError{
		IsFakeStoreError: true,
		Sdk:              "FakeStore",
		Code:             code,
		Msg:              msg,
		Ctx:              ctx,
	}
}

func (e *FakeStoreError) Error() string {
	return e.Msg
}
