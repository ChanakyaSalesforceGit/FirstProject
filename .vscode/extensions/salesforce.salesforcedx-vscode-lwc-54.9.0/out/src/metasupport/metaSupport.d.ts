export declare class MetaSupport {
    private static instance;
    static initializeSupport(): MetaSupport;
    /**
     * Returns path to the XSD and XML files from the extension folder.
     * TODO: use npm install to deliever these files.
     * @param targetFileName - a list of file names
     * @returns - a list of path for each file name
     */
    private getLocalFilePath;
    /**
     * A Promise to setup Redhat XML API
     * @param inputCatalogs - a list of catalog file names
     * @param inputFileAssociations - a list of dictionary specifying file associations
     * @returns - None
     */
    private setupRedhatXml;
    /**
     * This function checks the enviornment and passes relevant settings
     * to set up RedHat XML
     */
    getMetaSupport(): Promise<void>;
}
//# sourceMappingURL=metaSupport.d.ts.map