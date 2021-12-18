import { DefinitionLink } from 'vscode-languageserver';
import type { Document, DocumentManager } from '../../core/documents';
import type { ConfigManager } from '../../core/config';
import type { CompletionsProvider, AppCompletionList, FoldingRangeProvider } from '../interfaces';
import { CompletionContext, Position, FoldingRange } from 'vscode-languageserver';
export declare class AstroPlugin implements CompletionsProvider, FoldingRangeProvider {
    private readonly configManager;
    private readonly tsLanguageServiceManager;
    private readonly completionProvider;
    pluginName: string;
    constructor(docManager: DocumentManager, configManager: ConfigManager, workspaceUris: string[]);
    getCompletions(document: Document, position: Position, completionContext?: CompletionContext): Promise<AppCompletionList | null>;
    getFoldingRanges(document: Document): Promise<FoldingRange[]>;
    getDefinitions(document: Document, position: Position): Promise<DefinitionLink[]>;
    private isInsideFrontmatter;
    private isComponentTag;
    private getDefinitionsForComponentName;
    private getImportSpecifierForIdentifier;
}
