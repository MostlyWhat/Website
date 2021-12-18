import { CompletionsProvider, FoldingRangeProvider } from '../interfaces';
import { FoldingRange } from 'vscode-html-languageservice';
import { CompletionList, Position } from 'vscode-languageserver';
import type { Document, DocumentManager } from '../../core/documents';
import type { ConfigManager } from '../../core/config';
export declare class HTMLPlugin implements CompletionsProvider, FoldingRangeProvider {
    private lang;
    private documents;
    private styleScriptTemplate;
    private configManager;
    pluginName: string;
    constructor(docManager: DocumentManager, configManager: ConfigManager);
    getCompletions(document: Document, position: Position): CompletionList | null;
    getFoldingRanges(document: Document): FoldingRange[] | null;
    doTagComplete(document: Document, position: Position): string | null;
    /**
     * The HTML language service uses newer types which clash
     * without the stable ones. Transform to the stable types.
     */
    private toCompletionItems;
    private getLangCompletions;
    private isInsideExpression;
    private isInsideFrontmatter;
    private isComponentTag;
}
