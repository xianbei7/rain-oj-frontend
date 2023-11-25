/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeConfig } from './JudgeConfig';
import type { UserVO } from './UserVO';

export type QuestionVO = {
    acceptedNum?: number;
    content?: string;
    createTime?: string;
    difficulty?: string;
    favourNum?: number;
    hasFavour?: boolean;
    hasThumb?: boolean;
    id?: number;
    judgeConfig?: JudgeConfig;
    number?: number;
    submitNum?: number;
    tags?: Array<string>;
    thumbNum?: number;
    title?: string;
    userId?: number;
    userVO?: UserVO;
};
