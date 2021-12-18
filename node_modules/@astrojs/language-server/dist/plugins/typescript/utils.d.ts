import * as ts from 'typescript';
import { CompletionItemKind, DiagnosticSeverity, Position, Range } from 'vscode-languageserver';
import { SnapshotFragment } from './DocumentSnapshot';
export declare function scriptElementKindToCompletionItemKind(kind: ts.ScriptElementKind): CompletionItemKind;
export declare function getCommitCharactersForScriptElement(kind: ts.ScriptElementKind): string[] | undefined;
export declare function mapSeverity(category: ts.DiagnosticCategory): DiagnosticSeverity;
export declare function getScriptKindFromFileName(fileName: string): ts.ScriptKind;
export declare function getExtensionFromScriptKind(kind: ts.ScriptKind | undefined): ts.Extension;
export declare function convertRange(document: {
    positionAt: (offset: number) => Position;
}, range: {
    start?: number;
    length?: number;
}): Range;
export declare function convertToLocationRange(defDoc: SnapshotFragment, textSpan: ts.TextSpan): Range;
declare type FrameworkExt = 'astro' | 'vue' | 'jsx' | 'tsx' | 'svelte';
declare type FrameworkVirtualExt = 'ts' | 'tsx';
export declare function isVirtualFrameworkFilePath(ext: FrameworkExt, virtualExt: FrameworkVirtualExt, filePath: string): boolean;
export declare function isAstroFilePath(filePath: string): boolean;
export declare function isVirtualAstroFilePath(filePath: string): boolean;
export declare function isVirtualVueFilePath(filePath: string): boolean;
export declare function isVirtualJsxFilePath(filePath: string): boolean;
export declare function isVirtualSvelteFilePath(filePath: string): boolean;
export declare function isVirtualFilePath(filePath: string): boolean;
export declare function toVirtualAstroFilePath(filePath: string): string;
export declare function toRealAstroFilePath(filePath: string): string;
export declare function ensureRealAstroFilePath(filePath: string): string;
export declare function ensureRealFilePath(filePath: string): string;
export declare function findTsConfigPath(fileName: string, rootUris: string[]): string;
/**  */
export declare function isSubPath(uri: string, possibleSubPath: string): boolean;
/** Substitutes */
export declare function substituteWithWhitespace(result: string, start: number, end: number, oldContent: string, before: string, after: string): string;
export {};
