import * as ts from 'typescript';
import type { Document, DocumentManager } from '../../core/documents';
import type { ConfigManager } from '../../core/config';
import { SnapshotManager } from './SnapshotManager';
import { DocumentSnapshot } from './DocumentSnapshot';
export declare class LanguageServiceManager {
    private readonly docManager;
    private readonly configManager;
    private readonly workspaceUris;
    private docContext;
    constructor(docManager: DocumentManager, configManager: ConfigManager, workspaceUris: string[]);
    private getWorkspaceRoot;
    private createDocument;
    getSnapshot(document: Document): Promise<DocumentSnapshot>;
    getSnapshot(pathOrDoc: string | Document): Promise<DocumentSnapshot>;
    getTypeScriptDoc(document: Document): Promise<{
        tsDoc: DocumentSnapshot;
        lang: ts.LanguageService;
    }>;
    getTypeScriptLangForPath(filePath: string): Promise<ts.LanguageService>;
    getSnapshotManager(filePath: string): Promise<SnapshotManager>;
    private getTypeScriptLanguageService;
}
