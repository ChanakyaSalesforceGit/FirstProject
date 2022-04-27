import { SourceComponent } from '@salesforce/source-deploy-retrieve';
export interface ComponentDiff {
    projectPath: string;
    cachePath: string;
}
/**
 * Finds the file paths of files that differ for a component stored in two locations
 * @param projectComponent The local SourceComponent
 * @param cacheComponent The remote SourceComponent, stored in a local cache
 * @param projectRoot The common root of all files in the projectComponent
 * @param cacheRoot The common root of all files in the cacheComponent
 * @returns An array of file paths, where each element corresponds to one file that differs
 */
export declare function diffComponents(projectComponent: SourceComponent, cacheComponent: SourceComponent): ComponentDiff[];
