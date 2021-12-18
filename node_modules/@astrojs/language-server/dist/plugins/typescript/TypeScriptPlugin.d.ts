import type { ConfigManager } from '../../core/config';
import type { CompletionsProvider, AppCompletionItem, AppCompletionList } from '../interfaces';
import type { CancellationToken, Diagnostic, Hover, SignatureHelp, SignatureHelpContext, WorkspaceEdit } from 'vscode-languageserver';
import { Document, DocumentManager } from '../../core/documents';
import { CompletionContext, DefinitionLink, Position } from 'vscode-languageserver';
import { SnapshotManager } from './SnapshotManager';
import { CompletionEntryWithIdentifer } from './features/CompletionsProvider';
export declare class TypeScriptPlugin implements CompletionsProvider {
    private readonly docManager;
    private readonly configManager;
    private readonly languageServiceManager;
    pluginName: string;
    private readonly completionProvider;
    private readonly hoverProvider;
    private readonly signatureHelpProvider;
    private readonly diagnosticsProvider;
    constructor(docManager: DocumentManager, configManager: ConfigManager, workspaceUris: string[]);
    doHover(document: Document, position: Position): Promise<Hover | null>;
    rename(document: Document, position: Position, newName: string): Promise<WorkspaceEdit | null>;
    getCompletions(document: Document, position: Position, completionContext?: CompletionContext): Promise<AppCompletionList<CompletionEntryWithIdentifer> | null>;
    resolveCompletion(document: Document, completionItem: AppCompletionItem<CompletionEntryWithIdentifer>): Promise<AppCompletionItem<CompletionEntryWithIdentifer>>;
    getDefinitions(document: Document, position: Position): Promise<DefinitionLink[]>;
    getDiagnostics(document: Document, cancellationToken?: CancellationToken): Promise<Diagnostic[]>;
    onWatchFileChanges(onWatchFileChangesParams: any[]): Promise<void>;
    getSignatureHelp(document: Document, position: Position, context: SignatureHelpContext | undefined, cancellationToken?: CancellationToken): Promise<SignatureHelp | null>;
    /**
     *
     * @internal
     */
    getSnapshotManager(fileName: string): Promise<SnapshotManager>;
    private goToDefinitionFoundOnlyAlias;
    private getGoToDefinitionRefsForImportSpecifier;
    private featureEnabled;
}
