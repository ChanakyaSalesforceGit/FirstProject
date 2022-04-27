import * as vscode from 'vscode';
import { MetadataCacheResult } from '../conflict';
export declare function forceSourceDiff(sourceUri?: vscode.Uri): Promise<void>;
export declare function forceSourceFolderDiff(explorerPath: vscode.Uri): Promise<void>;
export declare function handleCacheResults(username: string, cache?: MetadataCacheResult): Promise<void>;
