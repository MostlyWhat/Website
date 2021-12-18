import * as ts from 'typescript';
import { TextDocumentContentChangeEvent, Position, Range } from 'vscode-languageserver';
import { Document, DocumentMapper } from '../../core/documents';
/**
 * The mapper to get from original snapshot positions to generated and vice versa.
 */
export interface SnapshotFragment extends DocumentMapper {
    positionAt(offset: number): Position;
    offsetAt(position: Position): number;
}
/**
 * An error which occured while trying to parse/preprocess the Astro file contents.
 */
export interface ParserError {
    message: string;
    range: Range;
    code: number;
}
export interface DocumentSnapshot extends ts.IScriptSnapshot {
    version: number;
    filePath: string;
    scriptKind: ts.ScriptKind;
    parserError: ParserError | null;
    positionAt(offset: number): Position;
    /**
     * Instantiates a source mapper.
     * `destroyFragment` needs to be called when
     * it's no longer needed / the class should be cleaned up
     * in order to prevent memory leaks.
     */
    getFragment(): Promise<DocumentFragmentSnapshot>;
    /**
     * Needs to be called when source mapper
     * is no longer needed / the class should be cleaned up
     * in order to prevent memory leaks.
     */
    destroyFragment(): void;
    /**
     * Convenience function for getText(0, getLength())
     */
    getFullText(): string;
}
export declare const createDocumentSnapshot: (filePath: string, currentText: string | null, createDocument?: ((_filePath: string, text: string, overrideText: boolean) => Document) | undefined) => DocumentSnapshot;
export declare class DocumentFragmentSnapshot implements Omit<DocumentSnapshot, 'getFragment' | 'destroyFragment'>, SnapshotFragment {
    private mapper;
    private parent;
    version: number;
    filePath: string;
    url: string;
    text: string;
    parserError: null;
    scriptKind: ts.ScriptKind;
    scriptInfo: null;
    constructor(mapper: any, parent: Document);
    getText(start: number, end: number): string;
    getLength(): number;
    getFullText(): string;
    getChangeRange(): undefined;
    positionAt(offset: number): import("vscode-html-languageservice").Position;
    getLineContainingOffset(offset: number): string;
    offsetAt(position: Position): number;
    getOriginalPosition(pos: Position): Position;
    getGeneratedPosition(pos: Position): Position;
    isInGenerated(pos: Position): boolean;
    getURL(): string;
}
export declare class TypeScriptDocumentSnapshot implements DocumentSnapshot {
    version: number;
    readonly filePath: string;
    private text;
    scriptKind: ts.ScriptKind;
    scriptInfo: null;
    parserError: null;
    url: string;
    constructor(version: number, filePath: string, text: string);
    getText(start: number, end: number): string;
    getLength(): number;
    getFullText(): string;
    getChangeRange(): undefined;
    positionAt(offset: number): import("vscode-html-languageservice").Position;
    offsetAt(position: Position): number;
    getFragment(): Promise<DocumentFragmentSnapshot>;
    getOriginalPosition(pos: Position): Position;
    destroyFragment(): void;
    getLineContainingOffset(offset: number): string;
    update(changes: TextDocumentContentChangeEvent[]): void;
}
