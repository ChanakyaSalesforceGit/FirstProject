import { SourceComponent } from '@salesforce/source-deploy-retrieve';
import { MetadataCacheResult } from './metadataCacheService';
export interface TimestampFileProperties {
    localRelPath: string;
    remoteRelPath: string;
    localLastModifiedDate?: string | undefined;
    remoteLastModifiedDate?: string | undefined;
}
export interface DirectoryDiffResults {
    different: Set<TimestampFileProperties>;
    localRoot: string;
    remoteRoot: string;
    scannedLocal?: number;
    scannedRemote?: number;
}
export interface DirectoryDiffer {
    diff(localSourcePath: string, remoteSourcePath: string): DirectoryDiffResults;
}
export declare class CommonDirDirectoryDiffer implements DirectoryDiffer {
    constructor();
    diff(localSourcePath: string, remoteSourcePath: string): DirectoryDiffResults;
    private filesDiffer;
    private listFiles;
    private walkFiles;
}
export declare function diffFolder(cache: MetadataCacheResult, username: string): Promise<void>;
/**
 * Perform file diff and execute VS Code diff comand to show in UI.
 * It matches the correspondent file in compoennt.
 * @param localFile local file
 * @param remoteComponent remote source component
 * @param defaultUsernameorAlias username/org info to show in diff
 * @returns {Promise<void>}
 */
export declare function diffOneFile(localFile: string, remoteComponent: SourceComponent, defaultUsernameorAlias: string): Promise<void>;
