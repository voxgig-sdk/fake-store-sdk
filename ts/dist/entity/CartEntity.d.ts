import { FakeStoreEntityBase } from '../FakeStoreEntityBase';
import type { FakeStoreSDK } from '../FakeStoreSDK';
import type { Control } from '../types';
import type { Cart, CartLoadMatch, CartListMatch, CartCreateData, CartUpdateData, CartRemoveMatch } from '../FakeStoreTypes';
declare class CartEntity extends FakeStoreEntityBase<Cart> {
    constructor(client: FakeStoreSDK, entopts: any);
    make(this: CartEntity): CartEntity;
    load(this: any, reqmatch?: CartLoadMatch, ctrl?: Control): Promise<CartEntity>;
    list(this: any, reqmatch?: CartListMatch, ctrl?: Control): Promise<CartEntity[]>;
    create(this: any, reqdata?: CartCreateData, ctrl?: Control): Promise<CartEntity>;
    update(this: any, reqdata?: CartUpdateData, ctrl?: Control): Promise<CartEntity>;
    remove(this: any, reqmatch?: CartRemoveMatch, ctrl?: Control): Promise<CartEntity>;
}
export { CartEntity };
