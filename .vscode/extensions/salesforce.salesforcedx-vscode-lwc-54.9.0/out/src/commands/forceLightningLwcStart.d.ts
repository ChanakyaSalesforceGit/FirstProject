import { SfdxCommandletExecutor } from '@salesforce/salesforcedx-utils-vscode/out/src/';
import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
/**
 * Hints for providing a user-friendly error message / action.
 * Hints come from the stderr output of lwc-dev-server. (We should move this to lwc-dev-server later)
 */
export declare const enum errorHints {
    SERVER_STARTUP_FALIED = "Server start up failed",
    ADDRESS_IN_USE = "EADDRINUSE",
    INACTIVE_SCRATCH_ORG = "Error authenticating to your scratch org. Make sure that it is still active"
}
export interface ForceLightningLwcStartOptions {
    /** whether to automatically open the browser after server start */
    openBrowser: boolean;
    /** component name to preview in the browser */
    componentName?: string;
}
export declare class ForceLightningLwcStartExecutor extends SfdxCommandletExecutor<{}> {
    private readonly options;
    private errorHint?;
    constructor(options?: ForceLightningLwcStartOptions);
    build(): Command;
    execute(response: ContinueResponse<{}>): void;
    private handleErrors;
}
export declare function forceLightningLwcStart(): Promise<void>;
//# sourceMappingURL=forceLightningLwcStart.d.ts.map