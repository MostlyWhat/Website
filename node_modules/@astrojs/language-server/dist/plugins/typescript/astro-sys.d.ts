import * as ts from 'typescript';
import { DocumentSnapshot } from './DocumentSnapshot';
/**
 * This should only be accessed by TS Astro module resolution.
 */
export declare function createAstroSys(getSnapshot: (fileName: string) => DocumentSnapshot): ts.System;
