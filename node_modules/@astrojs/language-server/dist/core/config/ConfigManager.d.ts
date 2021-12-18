import { VSCodeEmmetConfig } from 'vscode-emmet-helper';
import { UserPreferences } from 'typescript';
/**
* Representation of the language server config.
*/
export interface LSConfig {
    typescript: LSTypescriptConfig;
    css: LSCSSConfig;
    html: LSHTMLConfig;
    astro: LSAstroConfig;
}
export interface LSTypescriptConfig {
    enable: boolean;
    diagnostics: {
        enable: boolean;
    };
    hover: {
        enable: boolean;
    };
    documentSymbols: {
        enable: boolean;
    };
    completions: {
        enable: boolean;
    };
    findReferences: {
        enable: boolean;
    };
    definitions: {
        enable: boolean;
    };
    codeActions: {
        enable: boolean;
    };
    rename: {
        enable: boolean;
    };
    selectionRange: {
        enable: boolean;
    };
    signatureHelp: {
        enable: boolean;
    };
    semanticTokens: {
        enable: boolean;
    };
}
export interface LSCSSConfig {
    enable: boolean;
    globals: string;
    diagnostics: {
        enable: boolean;
    };
    hover: {
        enable: boolean;
    };
    completions: {
        enable: boolean;
        emmet: boolean;
    };
    documentColors: {
        enable: boolean;
    };
    colorPresentations: {
        enable: boolean;
    };
    documentSymbols: {
        enable: boolean;
    };
    selectionRange: {
        enable: boolean;
    };
}
export interface LSHTMLConfig {
    enable: boolean;
    hover: {
        enable: boolean;
    };
    completions: {
        enable: boolean;
        emmet: boolean;
    };
    tagComplete: {
        enable: boolean;
    };
    documentSymbols: {
        enable: boolean;
    };
    renameTags: {
        enable: boolean;
    };
    linkedEditing: {
        enable: boolean;
    };
}
export declare type CompilerWarningsSettings = Record<string, 'ignore' | 'error'>;
export interface LSAstroConfig {
    enable: boolean;
    compilerWarnings: CompilerWarningsSettings;
    diagnostics: {
        enable: boolean;
    };
    format: {
        enable: boolean;
    };
    rename: {
        enable: boolean;
    };
    completions: {
        enable: boolean;
    };
    hover: {
        enable: boolean;
    };
    codeActions: {
        enable: boolean;
    };
    selectionRange: {
        enable: boolean;
    };
}
export declare type TsUserConfigLang = 'typescript' | 'javascript';
declare type DeepPartial<T> = T extends CompilerWarningsSettings ? T : {
    [P in keyof T]?: DeepPartial<T[P]>;
};
/**
 * A subset of the JS/TS VS Code settings which
 * are transformed to ts.UserPreferences.
 * It may not be available in other IDEs, that's why the keys are optional.
 */
export interface TSUserConfig {
    preferences?: TsUserPreferencesConfig;
    suggest?: TSSuggestConfig;
}
/**
 * A subset of the JS/TS VS Code settings which
 * are transformed to ts.UserPreferences.
 */
export interface TsUserPreferencesConfig {
    importModuleSpecifier: UserPreferences['importModuleSpecifierPreference'];
    quoteStyle: UserPreferences['quotePreference'];
}
/**
 * A subset of the JS/TS VS Code settings which
 * are transformed to ts.UserPreferences.
 */
export interface TSSuggestConfig {
    includeAutomaticOptionalChainCompletions: boolean | undefined;
}
export declare class ConfigManager {
    private config;
    private listeners;
    private emmetConfig;
    private tsUserPreferences;
    /**
       * Updates config.
       */
    update(config: DeepPartial<LSConfig>): void;
    /**
       * Whether or not specified config is enabled
       * @param key a string which is a path. Example: 'astro.diagnostics.enable'.
       */
    enabled(key: string): boolean;
    /**
      * Get specific config
      * @param key a string which is a path. Example: 'astro.diagnostics.enable'.
      */
    get<T>(key: string): T;
    /**
    * Register a listener which is invoked when the config changed.
    */
    onChange(callback: (config: ConfigManager) => void): void;
    updateEmmetConfig(config: VSCodeEmmetConfig): void;
    updateTsJsUserPreferences(config: Record<TsUserConfigLang, TSUserConfig>): void;
    private _updateTsUserPreferences;
    getEmmetConfig(): VSCodeEmmetConfig;
}
export {};
