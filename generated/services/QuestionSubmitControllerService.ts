/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_List_string_ } from '../models/BaseResponse_List_string_';
import type { BaseResponse_List_ViewQuestionSubmitVO_ } from '../models/BaseResponse_List_ViewQuestionSubmitVO_';
import type { BaseResponse_long_ } from '../models/BaseResponse_long_';
import type { BaseResponse_Page_DetailedQuestionSubmitVO_ } from '../models/BaseResponse_Page_DetailedQuestionSubmitVO_';
import type { BaseResponse_Page_QuestionSubmitVO_ } from '../models/BaseResponse_Page_QuestionSubmitVO_';
import type { QuestionSubmitAddRequest } from '../models/QuestionSubmitAddRequest';
import type { QuestionSubmitQueryRequest } from '../models/QuestionSubmitQueryRequest';
import type { UserQuestionSubmitQueryRequest } from '../models/UserQuestionSubmitQueryRequest';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionSubmitControllerService {

    /**
     * doQuestionSubmit
     * @param questionSubmitAddRequest questionSubmitAddRequest
     * @returns BaseResponse_long_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static doQuestionSubmitUsingPost(
questionSubmitAddRequest: QuestionSubmitAddRequest,
): CancelablePromise<BaseResponse_long_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit/',
            body: questionSubmitAddRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * getQuestionSubmitLanguages
     * @returns BaseResponse_List_string_ OK
     * @throws ApiError
     */
    public static getQuestionSubmitLanguagesUsingGet(): CancelablePromise<BaseResponse_List_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/submit/get/languages',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listDetailedQuestionSubmitByPage
     * @param questionSubmitQueryRequest questionSubmitQueryRequest
     * @returns BaseResponse_Page_DetailedQuestionSubmitVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listDetailedQuestionSubmitByPageUsingPost(
questionSubmitQueryRequest: QuestionSubmitQueryRequest,
): CancelablePromise<BaseResponse_Page_DetailedQuestionSubmitVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit/list/page',
            body: questionSubmitQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listUserQuestionSubmitByPage
     * @param userQuestionSubmitQueryRequest userQuestionSubmitQueryRequest
     * @returns BaseResponse_Page_QuestionSubmitVO_ OK
     * @returns any Created
     * @throws ApiError
     */
    public static listUserQuestionSubmitByPageUsingPost(
userQuestionSubmitQueryRequest: UserQuestionSubmitQueryRequest,
): CancelablePromise<BaseResponse_Page_QuestionSubmitVO_ | any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/question/submit/list/user/page',
            body: userQuestionSubmitQueryRequest,
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

    /**
     * listMyQuestionSubmitById
     * @param questionId questionId
     * @param userId userId
     * @returns BaseResponse_List_ViewQuestionSubmitVO_ OK
     * @throws ApiError
     */
    public static listMyQuestionSubmitByIdUsingGet(
questionId?: number,
userId?: number,
): CancelablePromise<BaseResponse_List_ViewQuestionSubmitVO_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/submit/my/view/list',
            query: {
                'questionId': questionId,
                'userId': userId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
