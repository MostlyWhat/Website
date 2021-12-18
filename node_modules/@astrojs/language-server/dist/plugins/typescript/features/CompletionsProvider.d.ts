import type { CompletionContext, Position, TextDocumentIdentifier } from 'vscode-languageserver';
import type { LanguageServiceManager } from '../LanguageServiceManager';
import { Document } from '../../../core/documents';
import * as ts from 'typescript';
import { AppCompletionItem, AppCompletionList, CompletionsProvider } from '../../interfaces';
export interface CompletionEntryWithIdentifer extends ts.CompletionEntry, TextDocumentIdentifier {
    position: Position;
}
export declare class CompletionsProviderImpl implements CompletionsProvider<CompletionEntryWithIdentifer> {
    private lang;
    constructor(lang: LanguageServiceManager);
    getCompletions(document: Document, position: Position, _completionContext?: CompletionContext): Promise<AppCompletionList<CompletionEntryWithIdentifer> | null>;
    resolveCompletion(document: Document, completionItem: AppCompletionItem<CompletionEntryWithIdentifer>): Promise<AppCompletionItem<CompletionEntryWithIdentifer>>;
    private toCompletionItem;
    private getCompletionDocument;
}
