import { Connection } from '@salesforce/core';
export declare const CUSTOMOBJECTS_FULLNAME = "CustomObject";
export declare class ComponentUtils {
    getComponentsPath(metadataType: string, defaultUsernameOrAlias: string, folderName?: string): Promise<string>;
    buildComponentsList(metadataType: string, componentsFile?: string, componentsPath?: string): string[];
    buildCustomObjectFieldsList(result?: string, componentsPath?: string): string[];
    fetchAndSaveMetadataComponentProperties(metadataType: string, connection: Connection, componentsPath: string, folderName?: string): Promise<string>;
    fetchAndSaveSObjectFieldsProperties(connection: Connection, componentsPath: string, folderName: string): Promise<string>;
    loadComponents(defaultOrg: string, metadataType: string, folderName?: string, forceRefresh?: boolean): Promise<string[]>;
    /**
     * Retrieves a list of all fields of the standard or custom object.
     * @param connection instance of Connection
     * @param componentsPath json file path of the component
     * @param folderName name of the custom or standard object listed under Custom Objects
     * @returns list of name of fields of the standard or custom object
     */
    fetchCustomObjectsFields(connection: Connection, componentsPath: string, folderName: string): Promise<string[]>;
    /**
     * Builds list of components from existing json file at the componentsPath
     * @param metadataType name of metadata type
     * @param componentsPath existing json file path of the component
     * @returns list of name of metadata components
     */
    fetchExistingMetadataComponents(metadataType: string, componentsPath: string): string[];
    /**
     * Retrieves a list of metadata components
     * @param metadataType name of metadata component
     * @param connection instance of connection
     * @param componentsPath json file path of the component
     * @param folderName name of the folders listed under metadata components like Email Templates, Documents, Dashboards or Reports
     * @returns a list of name of metadata components
     */
    fetchMetadataComponents(metadataType: string, connection: Connection, componentsPath: string, folderName: string | undefined): Promise<string[]>;
    /**
     * Builds a list of all fields of the standard or custom object from existing json file at the componentsPath
     * @param componentsPath existing json file path of the component
     * @returns a list of all fields of the standard or custom object
     */
    fetchExistingCustomObjectsFields(componentsPath: string): string[];
}
