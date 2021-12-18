import type { SnapshotFragment, DocumentSnapshot } from '../DocumentSnapshot';
import type { LanguageServiceManager } from '../LanguageServiceManager';
import type { TextSpan } from 'typescript';
/**
 * Checks if this a section that should be completely ignored
 * because it's purely generated.
 */
export declare function isInGeneratedCode(text: string, start: number, end: number): boolean;
/**
 * Checks that this isn't a text span that should be completely ignored
 * because it's purely generated.
 */
export declare function isNoTextSpanInGeneratedCode(text: string, span: TextSpan): boolean;
export declare class SnapshotFragmentMap {
    private languageServiceManager;
    private map;
    constructor(languageServiceManager: LanguageServiceManager);
    set(fileName: string, content: {
        fragment: SnapshotFragment;
        snapshot: DocumentSnapshot;
    }): void;
    get(fileName: string): {
        fragment: SnapshotFragment;
        snapshot: DocumentSnapshot;
    } | undefined;
    getFragment(fileName: string): SnapshotFragment | undefined;
    retrieve(fileName: string): Promise<{
        fragment: SnapshotFragment;
        snapshot: DocumentSnapshot;
    }>;
    retrieveFragment(fileName: string): Promise<SnapshotFragment>;
}
