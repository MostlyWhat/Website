import type { LanguageServiceManager } from '../LanguageServiceManager';
import { Hover, Position } from 'vscode-languageserver';
import { Document } from '../../../core/documents';
import { HoverProvider } from '../../interfaces';
export declare class HoverProviderImpl implements HoverProvider {
    private readonly lang;
    constructor(lang: LanguageServiceManager);
    doHover(document: Document, position: Position): Promise<Hover | null>;
    private getLSAndTSDoc;
}
