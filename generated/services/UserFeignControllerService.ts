/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LambdaQueryWrapper_User_ } from '../models/LambdaQueryWrapper_User_';
import type { User } from '../models/User';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserFeignControllerService {

    /**
     * getById
     * @param userId userId
     * @returns User OK
     * @throws ApiError
     */
    public static getByIdUsingGet(
userId: number,
): CancelablePromise<User> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/user/feign/get/id',
            query: {
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listByIds
     * @param ids ids
     * @returns User OK
     * @returns any Created
     * @throws ApiError
     */
    public static listByIdsUsingPost(
ids: Array<number>,
): CancelablePromise<Array<User> | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feign/get/ids',
            body: ids,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * list
     * @param lambdaQueryWrapper lambdaQueryWrapper
     * @returns User OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUsingPost(
lambdaQueryWrapper: LambdaQueryWrapper_User_,
): CancelablePromise<Array<User> | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/user/feign/get/list',
            body: lambdaQueryWrapper,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
