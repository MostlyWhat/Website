import { TextDocumentContentChangeEvent } from 'vscode-languageserver';
import { DocumentSnapshot } from './DocumentSnapshot';
export interface TsFilesSpec {
    include?: readonly string[];
    exclude?: readonly string[];
}
export declare class SnapshotManager {
    private projectFiles;
    private fileSpec;
    private workspaceRoot;
    private documents;
    private lastLogged;
    private readonly watchExtensions;
    constructor(projectFiles: string[], fileSpec: TsFilesSpec, workspaceRoot: string);
    updateProjectFiles(): void;
    updateProjectFile(fileName: string, changes?: TextDocumentContentChangeEvent[]): void;
    has(fileName: string): boolean;
    get(fileName: string): DocumentSnapshot | undefined;
    set(fileName: string, snapshot: DocumentSnapshot): Map<string, DocumentSnapshot>;
    delete(fileName: string): boolean;
    getFileNames(): string[];
    getProjectFileNames(): string[];
    private logStatistics;
}
