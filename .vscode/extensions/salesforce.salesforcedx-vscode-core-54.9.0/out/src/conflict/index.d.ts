import { Disposable, ExtensionContext } from 'vscode';
import { ConflictView } from './conflictView';
export { CommonDirDirectoryDiffer, diffFolder, diffOneFile, DirectoryDiffer, DirectoryDiffResults } from './directoryDiffer';
export { MetadataCacheCallback, MetadataCacheExecutor, MetadataCacheResult, MetadataCacheService, MetadataContext, PathType } from './metadataCacheService';
export { PersistentStorageService } from './persistentStorageService';
export declare const conflictView: ConflictView;
export declare function setupConflictView(extensionContext: ExtensionContext): Promise<void>;
export declare function registerConflictView(): Disposable;
