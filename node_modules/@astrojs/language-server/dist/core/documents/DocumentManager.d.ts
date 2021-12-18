import { TextDocumentContentChangeEvent, TextDocumentItem } from 'vscode-languageserver';
import { Document } from './Document';
export declare type DocumentEvent = 'documentOpen' | 'documentChange' | 'documentClose';
export declare class DocumentManager {
    private createDocument;
    private emitter;
    private openedInClient;
    private documents;
    private locked;
    private deleteCandidates;
    constructor(createDocument: (textDocument: {
        uri: string;
        text: string;
    }) => Document);
    get(uri: string): Document | undefined;
    openDocument(textDocument: TextDocumentItem & {
        overrideText: boolean;
    }): Document;
    closeDocument(uri: string): void;
    releaseDocument(uri: string): void;
    updateDocument(uri: string, changes: TextDocumentContentChangeEvent[]): void;
    markAsOpenedInClient(uri: string): void;
    getAllOpenedByClient(): [string, Document][];
    on(name: DocumentEvent, listener: (document: Document) => void): void;
    private notify;
    static newInstance(): DocumentManager;
}
