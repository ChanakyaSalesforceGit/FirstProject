import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { FileSelection, SfdxCommandletExecutor } from './util';
export declare const DEFAULT_ALIAS = "vscodeScratchOrg";
export declare const DEFAULT_EXPIRATION_DAYS = "7";
export declare class ForceOrgCreateExecutor extends SfdxCommandletExecutor<AliasAndFileSelection> {
    build(data: AliasAndFileSelection): Command;
    execute(response: ContinueResponse<AliasAndFileSelection>): void;
}
export declare class AliasGatherer implements ParametersGatherer<Alias> {
    gather(): Promise<CancelResponse | ContinueResponse<Alias>>;
}
export interface Alias {
    alias: string;
    expirationDays: string;
}
export declare type AliasAndFileSelection = Alias & FileSelection;
export declare function forceOrgCreate(): Promise<void>;
