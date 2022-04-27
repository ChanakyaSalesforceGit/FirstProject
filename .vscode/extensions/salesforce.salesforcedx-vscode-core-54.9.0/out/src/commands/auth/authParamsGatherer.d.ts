import * as vscode from 'vscode';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
export declare const DEFAULT_ALIAS = "vscodeOrg";
export declare const PRODUCTION_URL = "https://login.salesforce.com";
export declare const SANDBOX_URL = "https://test.salesforce.com";
export declare const INSTANCE_URL_PLACEHOLDER = "https://na35.salesforce.com";
export interface AuthParams {
    alias: string;
    loginUrl: string;
}
export interface AccessTokenParams {
    alias: string;
    instanceUrl: string;
    accessToken: string;
}
export declare class OrgTypeItem implements vscode.QuickPickItem {
    label: string;
    detail: string;
    constructor(localizeLabel: string, localizeDetail: string);
}
export declare class AuthParamsGatherer implements ParametersGatherer<AuthParams> {
    readonly orgTypes: {
        project: OrgTypeItem;
        production: OrgTypeItem;
        sandbox: OrgTypeItem;
        custom: OrgTypeItem;
    };
    static readonly validateUrl: (url: string) => string | null;
    getProjectLoginUrl(): Promise<string | undefined>;
    getQuickPickItems(): Promise<vscode.QuickPickItem[]>;
    gather(): Promise<CancelResponse | ContinueResponse<AuthParams>>;
}
export declare class AccessTokenParamsGatherer implements ParametersGatherer<AccessTokenParams> {
    gather(): Promise<CancelResponse | ContinueResponse<AccessTokenParams>>;
}
export declare class ScratchOrgLogoutParamsGatherer implements ParametersGatherer<string> {
    readonly username: string;
    readonly alias?: string | undefined;
    constructor(username: string, alias?: string | undefined);
    gather(): Promise<CancelResponse | ContinueResponse<string>>;
}
