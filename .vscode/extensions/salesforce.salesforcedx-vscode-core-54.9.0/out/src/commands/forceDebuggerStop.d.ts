import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from './util';
export declare type IdSelection = {
    id: string;
};
export declare class IdGatherer implements ParametersGatherer<IdSelection> {
    private readonly sessionIdToUpdate;
    constructor(sessionIdToUpdate: string);
    gather(): Promise<ContinueResponse<IdSelection>>;
}
export declare class DebuggerSessionDetachExecutor extends SfdxCommandletExecutor<IdSelection> {
    build(data: IdSelection): Command;
}
export declare class StopActiveDebuggerSessionExecutor extends SfdxCommandletExecutor<{}> {
    build(data: {}): Command;
    execute(response: ContinueResponse<{}>): Promise<void>;
}
export declare function forceDebuggerStop(): Promise<void>;
