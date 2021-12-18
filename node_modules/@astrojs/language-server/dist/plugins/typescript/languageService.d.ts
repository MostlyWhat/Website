import * as ts from 'typescript';
import { Document } from '../../core/documents';
import { SnapshotManager } from './SnapshotManager';
export interface LanguageServiceContainer {
    readonly tsconfigPath: string;
    readonly snapshotManager: SnapshotManager;
    getService(): ts.LanguageService;
    updateDocument(documentOrFilePath: Document | string): ts.IScriptSnapshot;
    deleteDocument(filePath: string): void;
}
export interface LanguageServiceDocumentContext {
    getWorkspaceRoot(fileName: string): string;
    createDocument: (fileName: string, content: string, overrideText: boolean) => Document;
}
export declare function getLanguageService(path: string, workspaceUris: string[], docContext: LanguageServiceDocumentContext): Promise<LanguageServiceContainer>;
export declare function getLanguageServiceForDocument(document: Document, workspaceUris: string[], docContext: LanguageServiceDocumentContext): Promise<ts.LanguageService>;
export declare function getLanguageServiceForPath(path: string, workspaceUris: string[], docContext: LanguageServiceDocumentContext): Promise<ts.LanguageService>;
