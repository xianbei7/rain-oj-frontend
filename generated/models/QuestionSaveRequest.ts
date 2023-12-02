/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeCase } from './JudgeCase';
import type { JudgeConfig } from './JudgeConfig';

export type QuestionSaveRequest = {
    answer?: string;
    content?: string;
    difficulty?: string;
    id?: number;
    judgeCase?: Array<JudgeCase>;
    judgeConfig?: JudgeConfig;
    number?: number;
    tags?: Array<string>;
    title?: string;
    type?: string;
};
