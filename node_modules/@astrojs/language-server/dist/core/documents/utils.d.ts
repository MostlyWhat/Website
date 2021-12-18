import { HTMLDocument, Node, Position } from 'vscode-html-languageservice';
export interface TagInformation {
    content: string;
    attributes: Record<string, string>;
    start: number;
    end: number;
    startPos: Position;
    endPos: Position;
    container: {
        start: number;
        end: number;
    };
}
/**
 * Gets word range at position.
 * Delimiter is by default a whitespace, but can be adjusted.
 */
export declare function getWordRangeAt(str: string, pos: number, delimiterRegex?: {
    left: RegExp;
    right: RegExp;
}): {
    start: number;
    end: number;
};
/**
 * Gets word at position.
 * Delimiter is by default a whitespace, but can be adjusted.
 */
export declare function getWordAt(str: string, pos: number, delimiterRegex?: {
    left: RegExp;
    right: RegExp;
}): string;
/**
 * Gets index of first-non-whitespace character.
 */
export declare function getFirstNonWhitespaceIndex(str: string): number;
/** checks if a position is currently inside of an expression */
export declare function isInsideExpression(html: string, tagStart: number, position: number): boolean;
/**
 * Returns if a given offset is inside of the document frontmatter
 */
export declare function isInsideFrontmatter(text: string, offset: number): boolean;
export declare function isInTag(position: Position, tagInfo: TagInformation | null): tagInfo is TagInformation;
/**
 * Get the line and character based on the offset
 * @param offset The index of the position
 * @param text The text for which the position should be retrived
 */
export declare function positionAt(offset: number, text: string): Position;
/**
 * Get the offset of the line and character position
 * @param position Line and character position
 * @param text The text for which the offset should be retrived
 */
export declare function offsetAt(position: Position, text: string): number;
export declare function walk(node: Node): Generator<Node, void, unknown>;
export declare function extractStyleTag(source: string, html?: HTMLDocument): TagInformation | null;
