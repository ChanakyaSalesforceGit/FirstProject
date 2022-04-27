import * as vscode from 'vscode';
declare enum PreviewPlatformType {
    Desktop = 1,
    Android = 2,
    iOS = 3
}
export declare const enum PlatformName {
    Desktop = "Desktop",
    Android = "Android",
    iOS = "iOS"
}
interface PreviewQuickPickItem extends vscode.QuickPickItem {
    label: string;
    detail: string;
    alwaysShow: boolean;
    picked: boolean;
    id: PreviewPlatformType;
    defaultTargetName: string;
    platformName: keyof typeof PlatformName;
}
export interface DeviceQuickPickItem extends vscode.QuickPickItem {
    name: string;
}
export declare const platformOptions: PreviewQuickPickItem[];
export declare function forceLightningLwcPreview(sourceUri: vscode.Uri): Promise<void>;
/**
 * Given a path, it recursively goes through that directory and upwards, until it finds
 * a config file named sfdx-project.json and returns the path to the folder containg it.
 *
 * @param startPath starting path to search for the config file.
 * @returns the path to the folder containing the config file, or undefined if config file not found
 */
export declare function getProjectRootDirectory(startPath: string): string | undefined;
/**
 * Given a path to a directory, returns a path that is one level up.
 *
 * @param directory path to a directory
 * @returns path to a directory that is one level up, or undefined if cannot go one level up.
 */
export declare function directoryLevelUp(directory: string): string | undefined;
export {};
//# sourceMappingURL=forceLightningLwcPreview.d.ts.map