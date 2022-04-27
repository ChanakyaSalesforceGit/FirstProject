import { SfdxProjectJson } from '@salesforce/core';
import { AnyJson } from '@salesforce/ts-types';
/**
 * Class representing the local sfdx-project.json file.
 * Does not contain global values.
 */
export default class SfdxProjectConfig {
    private static instance;
    private constructor();
    private static initializeSfdxProjectConfig;
    private static handleError;
    static getInstance(): Promise<SfdxProjectJson>;
    static getValue(key: string): Promise<AnyJson | undefined>;
}
