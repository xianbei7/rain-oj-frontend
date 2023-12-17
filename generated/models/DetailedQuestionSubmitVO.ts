/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { JudgeResult } from './JudgeResult';
import type { UserVO } from './UserVO';

export type DetailedQuestionSubmitVO = {
    createTime?: string;
    id?: number;
    judgeResult?: JudgeResult;
    language?: string;
    questionDifficulty?: string;
    questionId?: number;
    questionNumber?: number;
    questionTitle?: string;
    status?: string;
    userVO?: UserVO;
};
