import { LocalComponent } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
export { RetrieveDescriberFactory } from './describers';
export { forceSourceRetrieveCmp } from './forceSourceRetrieveCmp';
/**
 * Provides information for force.source.retrieve.component execution
 */
export interface RetrieveDescriber {
    /**
     * Builds the force:source:retrieve metadata argument
     * @param data optional data to use while building the argument
     * @returns parameter for metadata argument (-m)
     */
    buildMetadataArg(data?: LocalComponent[]): string;
    /**
     * Gather list of components to be retrieved
     * @returns local representations of components
     */
    gatherOutputLocations(): Promise<LocalComponent[]>;
}
/**
 * An object capable of triggering the force:source:retrieve metadata command
 */
export interface RetrieveMetadataTrigger {
    /**
     * The RetrieveDescriber to use for the retrieve execution
     */
    describer(): RetrieveDescriber;
}
