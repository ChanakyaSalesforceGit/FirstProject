import { CancelResponse, ContinueResponse, ParametersGatherer, PreconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { Uri } from 'vscode';
export declare class InternalDevWorkspaceChecker implements PreconditionChecker {
    check(): boolean;
}
export declare class FileInternalPathGatherer implements ParametersGatherer<{
    outputdir: string;
}> {
    private filePath;
    constructor(uri: Uri);
    gather(): Promise<CancelResponse | ContinueResponse<{
        outputdir: string;
    }>>;
}
