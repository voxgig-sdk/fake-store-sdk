import { FakeStoreEntityBase } from '../FakeStoreEntityBase';
import type { FakeStoreSDK } from '../FakeStoreSDK';
import type { Control } from '../types';
import type { Login, LoginCreateData } from '../FakeStoreTypes';
declare class LoginEntity extends FakeStoreEntityBase<Login> {
    constructor(client: FakeStoreSDK, entopts: any);
    make(this: LoginEntity): LoginEntity;
    create(this: any, reqdata?: LoginCreateData, ctrl?: Control): Promise<LoginEntity>;
}
export { LoginEntity };
