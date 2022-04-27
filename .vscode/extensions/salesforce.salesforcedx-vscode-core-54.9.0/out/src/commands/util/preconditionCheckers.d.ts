import { PreconditionChecker } from '@salesforce/salesforcedx-utils-vscode/src/types';
export declare class SfdxWorkspaceChecker implements PreconditionChecker {
    check(): boolean;
}
export declare class EmptyPreChecker implements PreconditionChecker {
    check(): boolean;
}
export declare class DevUsernameChecker implements PreconditionChecker {
    check(): Promise<boolean>;
}
export declare class CompositePreconditionChecker implements PreconditionChecker {
    checks: PreconditionChecker[];
    constructor(...checks: PreconditionChecker[]);
    check(): Promise<boolean>;
}
