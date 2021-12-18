import type { AppCompletionList } from '../../interfaces';
import type { Document, DocumentManager } from '../../../core/documents';
import { CompletionContext, Position } from 'vscode-languageserver';
import { LanguageServiceManager as TypeScriptLanguageServiceManager } from '../../typescript/LanguageServiceManager';
export declare class CompletionProvider {
    private readonly docManager;
    private readonly tsLanguageServiceManager;
    constructor(docManager: DocumentManager, tsLanguageServiceManager: TypeScriptLanguageServiceManager);
    getCompletions(document: Document, position: Position, completionContext?: CompletionContext): Promise<AppCompletionList | null>;
    private getClientHintCompletion;
    private getComponentScriptCompletion;
    private getPropCompletions;
    private getImportedSymbol;
    private getPropType;
    private getCompletionItemForTypeMember;
    private isComponentTag;
    private isInsideFrontmatter;
}
