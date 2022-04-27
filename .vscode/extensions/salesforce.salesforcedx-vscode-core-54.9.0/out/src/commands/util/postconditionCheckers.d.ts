import { CancelResponse, ContinueResponse, LocalComponent, PostconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { DirectoryDiffResults } from '../../conflict';
declare type OneOrMany = LocalComponent | LocalComponent[];
declare type ContinueOrCancel = ContinueResponse<OneOrMany> | CancelResponse;
export declare class CompositePostconditionChecker<T> implements PostconditionChecker<T> {
    private readonly postcheckers;
    constructor(...postcheckers: Array<PostconditionChecker<any>>);
    check(inputs: CancelResponse | ContinueResponse<T>): Promise<CancelResponse | ContinueResponse<T>>;
}
export declare class EmptyPostChecker implements PostconditionChecker<any> {
    check(inputs: ContinueResponse<any> | CancelResponse): Promise<ContinueResponse<any> | CancelResponse>;
}
export declare class OverwriteComponentPrompt implements PostconditionChecker<OneOrMany> {
    check(inputs: ContinueOrCancel): Promise<ContinueOrCancel>;
    private componentExists;
    private getFileExtensions;
    promptOverwrite(foundComponents: LocalComponent[]): Promise<Set<LocalComponent> | undefined>;
    private buildDialogMessage;
    private buildDialogOptions;
}
export interface ConflictDetectionMessages {
    warningMessageKey: string;
    commandHint: (input: string | string[]) => string;
}
export declare class TimestampConflictChecker implements PostconditionChecker<string> {
    private isManifest;
    private messages;
    constructor(isManifest: boolean, messages: ConflictDetectionMessages);
    check(inputs: ContinueResponse<string> | CancelResponse): Promise<ContinueResponse<string> | CancelResponse>;
    handleConflicts(componentPath: string, usernameOrAlias: string, results: DirectoryDiffResults): Promise<ContinueResponse<string> | CancelResponse>;
}
export {};
