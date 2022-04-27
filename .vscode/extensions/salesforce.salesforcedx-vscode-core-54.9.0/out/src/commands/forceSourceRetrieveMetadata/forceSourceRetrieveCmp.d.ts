import { ContinueResponse, LocalComponent } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { ComponentSet, RetrieveResult } from '@salesforce/source-deploy-retrieve';
import { RetrieveMetadataTrigger } from '.';
import { RetrieveExecutor } from '../baseDeployRetrieve';
export declare class LibraryRetrieveSourcePathExecutor extends RetrieveExecutor<LocalComponent[]> {
    private openAfterRetrieve;
    constructor(openAfterRetrieve?: boolean);
    protected getComponents(response: ContinueResponse<LocalComponent[]>): Promise<ComponentSet>;
    protected postOperation(result: RetrieveResult | undefined): Promise<void>;
    private findResources;
    private openResources;
}
export declare function forceSourceRetrieveCmp(trigger: RetrieveMetadataTrigger, openAfterRetrieve?: boolean): Promise<void>;
