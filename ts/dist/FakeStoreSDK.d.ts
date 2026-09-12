import { CartEntity } from './entity/CartEntity';
import { LoginEntity } from './entity/LoginEntity';
import { ProductEntity } from './entity/ProductEntity';
import { UserEntity } from './entity/UserEntity';
export type * from './FakeStoreTypes';
import { inspect } from 'node:util';
import type { Context, Feature } from './types';
import { config } from './Config';
import { FakeStoreEntityBase } from './FakeStoreEntityBase';
import { Utility } from './utility/Utility';
import { BaseFeature } from './feature/base/BaseFeature';
declare const stdutil: Utility;
declare class FakeStoreSDK {
    _mode: string;
    _options: any;
    _utility: Utility;
    _features: Feature[];
    _rootctx: Context;
    constructor(options?: any);
    options(): any;
    utility(): any;
    prepare(fetchargs?: any): Promise<any>;
    direct(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    _rawRequest(fetchargs?: any): Promise<Error | {
        ok: boolean;
        status: number;
        headers: any;
        data: any;
        err?: undefined;
    } | {
        ok: boolean;
        err: any;
        status?: undefined;
        headers?: undefined;
        data?: undefined;
    }>;
    graphql(query: string, variables?: any, ctrl?: any): Promise<any>;
    Cart(entopts?: Record<string, any>): CartEntity;
    Login(entopts?: Record<string, any>): LoginEntity;
    Product(entopts?: Record<string, any>): ProductEntity;
    User(entopts?: Record<string, any>): UserEntity;
    static test(testoptsarg?: any, sdkoptsarg?: any): FakeStoreSDK;
    tester(testopts?: any, sdkopts?: any): FakeStoreSDK;
    toJSON(): {
        name: string;
    };
    toString(): string;
    [inspect.custom](): string;
}
declare const SDK: typeof FakeStoreSDK;
export { stdutil, config, BaseFeature, FakeStoreEntityBase, FakeStoreSDK, SDK, };
