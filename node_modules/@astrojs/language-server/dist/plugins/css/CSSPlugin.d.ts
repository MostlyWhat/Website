import type { CompletionsProvider } from '../interfaces';
import type { Document, DocumentManager } from '../../core/documents';
import type { ConfigManager } from '../../core/config';
import { CompletionContext, CompletionList, Position } from 'vscode-languageserver';
export declare class CSSPlugin implements CompletionsProvider {
    private docManager;
    private configManager;
    private documents;
    private triggerCharacters;
    pluginName: string;
    constructor(docManager: DocumentManager, configManager: ConfigManager);
    getCompletions(document: Document, position: Position, completionContext?: CompletionContext): CompletionList | null;
    private getCompletionsInternal;
    private inStyleAttributeWithoutInterpolation;
    private getCSSDoc;
    private isInsideFrontmatter;
}
