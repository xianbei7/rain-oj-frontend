/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_int_ } from '../models/BaseResponse_int_';
import type { BaseResponse_Page_QuestionFavourVO_ } from '../models/BaseResponse_Page_QuestionFavourVO_';
import type { BaseResponse_Page_QuestionVO_ } from '../models/BaseResponse_Page_QuestionVO_';
import type { QuestionFavourQueryRequest } from '../models/QuestionFavourQueryRequest';
import type { QuestionQueryRequest } from '../models/QuestionQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionFavourControllerService {

    /**
     * doQuestionFavour
     * @param questionId questionId
     * @returns BaseResponse_int_ OK
     * @throws ApiError
     */
    public static doQuestionFavourUsingGet(
questionId?: number,
): CancelablePromise<BaseResponse_int_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/favour/',
            query: {
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listFavourQuestionByPage
     * @param questionFavourQueryRequest questionFavourQueryRequest
     * @returns BaseResponse_Page_QuestionFavourVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listFavourQuestionByPageUsingPost(
questionFavourQueryRequest: QuestionFavourQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionFavourVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/favour/list/page',
            body: questionFavourQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listMyFavourQuestionByPage
     * @param questionQueryRequest questionQueryRequest
     * @returns BaseResponse_Page_QuestionVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listMyFavourQuestionByPageUsingPost(
questionQueryRequest: QuestionQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/favour/my/list/page',
            body: questionQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
