import { CancellationToken, Diagnostic } from 'vscode-languageserver';
import { Document } from '../../../core/documents';
import { DiagnosticsProvider } from '../../interfaces';
import { LanguageServiceManager } from '../LanguageServiceManager';
export declare class DiagnosticsProviderImpl implements DiagnosticsProvider {
    private readonly languageServiceManager;
    constructor(languageServiceManager: LanguageServiceManager);
    getDiagnostics(document: Document, _cancellationToken?: CancellationToken): Promise<Diagnostic[]>;
    private getLSAndTSDoc;
    private getTagBoundaries;
}
