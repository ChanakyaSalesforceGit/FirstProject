import { DirectoryDiffResults, MetadataCacheResult } from './';
export declare class TimestampConflictDetector {
    private diffs;
    private static EMPTY_DIFFS;
    constructor();
    createDiffs(result?: MetadataCacheResult): DirectoryDiffResults;
    private determineConflicts;
    private createRootPaths;
}
