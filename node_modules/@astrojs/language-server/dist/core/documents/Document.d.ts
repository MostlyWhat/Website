import type { TagInformation } from './utils';
import { Position } from 'vscode-languageserver';
import { TextDocument } from 'vscode-languageserver-textdocument';
import { HTMLDocument } from 'vscode-html-languageservice';
import { AstroDocument } from './parseAstro';
export declare class Document implements TextDocument {
    uri: string;
    private content;
    languageId: string;
    version: number;
    html: HTMLDocument;
    astro: AstroDocument;
    styleInfo: TagInformation | null;
    constructor(uri: string, text: string);
    private updateDocInfo;
    setText(text: string): void;
    /**
     * Update the text between two positions.
     * @param text The new text slice
     * @param start Start offset of the new text
     * @param end End offset of the new text
     */
    update(text: string, start: number, end: number): void;
    getText(): string;
    /**
     * Get the line and character based on the offset
     * @param offset The index of the position
     */
    positionAt(offset: number): Position;
    /**
     * Get the index of the line and character position
     * @param position Line and character position
     */
    offsetAt(position: Position): number;
    getLineUntilOffset(offset: number): string;
    private getLineOffsets;
    /**
     * Get the length of the document's content
     */
    getTextLength(): number;
    /**
     * Returns the file path if the url scheme is file
     */
    getFilePath(): string | null;
    /**
     * Get URL file path.
     */
    getURL(): string;
    get lines(): string[];
    get lineCount(): number;
}
