export declare type MetadataObject = {
    directoryName: string;
    inFolder: boolean;
    metaFile: boolean;
    suffix?: string;
    xmlName: string;
    label: string;
};
export declare class TypeUtils {
    static readonly FOLDER_TYPES: Set<string>;
    static readonly UNSUPPORTED_TYPES: Set<string>;
    getTypesFolder(usernameOrAlias: string): Promise<string>;
    buildTypesList(metadataFile?: any, metadataTypesPath?: string): MetadataObject[];
    loadTypes(defaultOrg: string, forceRefresh?: boolean): Promise<MetadataObject[]>;
    getFolderForType(metadataType: string): string;
}
