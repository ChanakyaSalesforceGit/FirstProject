import { Command, OrgOpenSuccessResult } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from './util';
export declare class ForceOrgOpenContainerExecutor extends SfdxCommandletExecutor<{}> {
    build(data: {}): Command;
    buildUserMessageWith(orgData: OrgOpenSuccessResult): string;
    execute(response: ContinueResponse<string>): void;
}
export declare class ForceOrgOpenExecutor extends SfdxCommandletExecutor<{}> {
    protected showChannelOutput: boolean;
    build(data: {}): Command;
}
export declare function getExecutor(): SfdxCommandletExecutor<{}>;
export declare function forceOrgOpen(): Promise<void>;
