/**
 * Executes sfdx run:function --url http://localhost:8080 --payload=@functions/MyFunction/payload.json
 */
import { Uri } from 'vscode';
import { LibraryCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
export declare class ForceFunctionInvoke extends LibraryCommandletExecutor<string> {
    constructor(debug?: boolean);
    run(response: ContinueResponse<string>): Promise<boolean>;
}
export declare function forceFunctionInvoke(sourceUri: Uri): Promise<void>;
export declare function forceFunctionDebugInvoke(sourceUri: Uri): Promise<void>;
