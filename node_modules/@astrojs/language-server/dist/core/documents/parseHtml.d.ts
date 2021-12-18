import { HTMLDocument, Position } from 'vscode-html-languageservice';
import { Document } from './Document';
/**
 * Parses text as HTML
 */
export declare function parseHtml(text: string): HTMLDocument;
export interface AttributeContext {
    name: string;
    inValue: boolean;
    valueRange?: [number, number];
}
export declare function getAttributeContextAtPosition(document: Document, position: Position): AttributeContext | null;
