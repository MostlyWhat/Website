import { Position, Range } from 'vscode-languageserver';
import { Node } from 'vscode-html-languageservice';
/** Normalizes a document URI */
export declare function normalizeUri(uri: string): string;
/** Turns a URL into a normalized FS Path */
export declare function urlToPath(stringUrl: string): string | null;
/** Converts a path to a URL */
export declare function pathToUrl(path: string): string;
/**
 *
 * The language service is case insensitive, and would provide
 * hover info for Svelte components like `Option` which have
 * the same name like a html tag.
 */
export declare function isPossibleComponent(node: Node): boolean;
/**
 *
 * The language service is case insensitive, and would provide
 * hover info for Svelte components like `Option` which have
 * the same name like a html tag.
 */
export declare function isPossibleClientComponent(node: Node): boolean;
/** Flattens an array */
export declare function flatten<T>(arr: T[][]): T[];
/** Clamps a number between min and max */
export declare function clamp(num: number, min: number, max: number): number;
export declare function isNotNullOrUndefined<T>(val: T | undefined | null): val is T;
/** Checks if a position is inside range */
export declare function isInRange(positionToTest: Position, range: Range): boolean;
/**  */
export declare function isBeforeOrEqualToPosition(position: Position, positionToTest: Position): boolean;
/**
 * Debounces a function but cancels previous invocation only if
 * a second function determines it should.
 *
 * @param fn The function with it's argument
 * @param determineIfSame The function which determines if the previous invocation should be canceld or not
 * @param miliseconds Number of miliseconds to debounce
 */
export declare function debounceSameArg<T>(fn: (arg: T) => void, shouldCancelPrevious: (newArg: T, prevArg?: T) => boolean, miliseconds: number): (arg: T) => void;
/**
 * Debounces a function but also waits at minimum the specified number of miliseconds until
 * the next invocation. This avoids needless calls when a synchronous call (like diagnostics)
 * took too long and the whole timeout of the next call was eaten up already.
 *
 * @param fn The function with it's argument
 * @param miliseconds Number of miliseconds to debounce/throttle
 */
export declare function debounceThrottle<T extends (...args: any) => void>(fn: T, miliseconds: number): T;
