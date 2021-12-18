import type { CancellationToken, CompletionContext, CompletionItem, DefinitionLink, Diagnostic, Location, Position, SignatureHelp, SignatureHelpContext, TextDocumentIdentifier, WorkspaceEdit } from 'vscode-languageserver';
import type { DocumentManager } from '../core/documents';
import type * as d from './interfaces';
import { CompletionList } from 'vscode-languageserver';
import { Hover, FoldingRange } from 'vscode-languageserver-types';
interface PluginHostConfig {
    filterIncompleteCompletions: boolean;
    definitionLinkSupport: boolean;
}
export declare class PluginHost {
    private documentsManager;
    private plugins;
    private pluginHostConfig;
    constructor(documentsManager: DocumentManager);
    initialize(pluginHostConfig: PluginHostConfig): void;
    register(plugin: d.Plugin): void;
    getCompletions(textDocument: TextDocumentIdentifier, position: Position, completionContext?: CompletionContext): Promise<CompletionList>;
    getDiagnostics(textDocument: TextDocumentIdentifier): Promise<Diagnostic[]>;
    resolveCompletion(textDocument: TextDocumentIdentifier, completionItem: d.AppCompletionItem): Promise<CompletionItem>;
    doHover(textDocument: TextDocumentIdentifier, position: Position): Promise<Hover | null>;
    doTagComplete(textDocument: TextDocumentIdentifier, position: Position): Promise<string | null>;
    getFoldingRanges(textDocument: TextDocumentIdentifier): Promise<FoldingRange[] | null>;
    getDefinitions(textDocument: TextDocumentIdentifier, position: Position): Promise<DefinitionLink[] | Location[]>;
    rename(textDocument: TextDocumentIdentifier, position: Position, newName: string): Promise<WorkspaceEdit | null>;
    getSignatureHelp(textDocument: TextDocumentIdentifier, position: Position, context: SignatureHelpContext | undefined, cancellationToken: CancellationToken): Promise<SignatureHelp | null>;
    onWatchFileChanges(onWatchFileChangesParams: any[]): void;
    private getDocument;
    private execute;
    private tryExecutePlugin;
}
export {};
