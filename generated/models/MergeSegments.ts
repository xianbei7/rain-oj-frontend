/* generated using openapi-typescript-codegen -- do no edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ISqlSegment } from './ISqlSegment';

export type MergeSegments = {
    groupBy?: Array<ISqlSegment>;
    having?: Array<ISqlSegment>;
    normal?: Array<ISqlSegment>;
    orderBy?: Array<ISqlSegment>;
    sqlSegment?: string;
};
