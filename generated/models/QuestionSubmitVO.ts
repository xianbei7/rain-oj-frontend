/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeResult } from './JudgeResult';
import type { QuestionVO } from './QuestionVO';
import type { UserVO } from './UserVO';

export type QuestionSubmitVO = {
    code?: string;
    id?: number;
    judgeResult?: JudgeResult;
    language?: string;
    questionId?: number;
    questionVO?: QuestionVO;
    status?: number;
    userId?: number;
    userVO?: UserVO;
};
