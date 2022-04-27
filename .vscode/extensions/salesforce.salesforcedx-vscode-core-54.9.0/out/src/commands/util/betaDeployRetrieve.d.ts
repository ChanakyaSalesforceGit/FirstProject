import { MetadataComponent } from '@salesforce/source-deploy-retrieve';
/**
 * Reformats errors thrown by beta deploy/retrieve logic.
 *
 * @param e Error to reformat
 * @returns A newly formatted error
 */
export declare function formatException(e: Error): Error;
export declare function createComponentCount(components: Iterable<MetadataComponent>): {
    type: string;
    quantity: number;
}[];
