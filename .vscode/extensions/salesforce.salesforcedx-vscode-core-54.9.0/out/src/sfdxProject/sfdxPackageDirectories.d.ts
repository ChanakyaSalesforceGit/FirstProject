export default class SfdxPackageDirectories {
    static getPackageDirectoryPaths(): Promise<string[]>;
    static getPackageDirectoryFullPaths(): Promise<string[]>;
    static isInPackageDirectory(filePath: string): Promise<boolean>;
    static getDefaultPackageDir(): Promise<string | undefined>;
}
