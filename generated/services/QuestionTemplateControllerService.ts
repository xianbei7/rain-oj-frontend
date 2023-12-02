/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BaseResponse_string_ } from '../models/BaseResponse_string_';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class QuestionTemplateControllerService {

    /**
     * getQuestionTemplate
     * @param language language
     * @param questionId questionId
     * @returns BaseResponse_string_ OK
     * @throws ApiError
     */
    public static getQuestionTemplateUsingGet(
language?: string,
questionId?: number,
): CancelablePromise<BaseResponse_string_> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/question/template/',
            query: {
                'language': language,
                'questionId': questionId,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
            },
        });
    }

}
