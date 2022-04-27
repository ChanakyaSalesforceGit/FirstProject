import { Command, CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from './util';
export declare class ForceStartApexDebugLoggingExecutor extends SfdxCommandletExecutor<{}> {
    private cancellationTokenSource;
    private cancellationToken;
    build(): Command;
    attachSubExecution(execution: CommandExecution): void;
    execute(response: ContinueResponse<{}>): Promise<void>;
    private subExecute;
}
export declare function getUserId(projectPath: string): Promise<string>;
export declare class ForceQueryUser extends SfdxCommandletExecutor<{}> {
    private username;
    constructor(username: string);
    build(): Command;
}
export declare class CreateDebugLevel extends SfdxCommandletExecutor<{}> {
    readonly developerName: string;
    build(): Command;
}
export declare class CreateTraceFlag extends SfdxCommandletExecutor<{}> {
    private userId;
    constructor(userId: string);
    build(): Command;
}
export declare class UpdateDebugLevelsExecutor extends SfdxCommandletExecutor<{}> {
    build(): Command;
}
export declare class UpdateTraceFlagsExecutor extends SfdxCommandletExecutor<{}> {
    build(): Command;
}
export declare class ForceQueryTraceFlag extends SfdxCommandletExecutor<{}> {
    build(userId: string): Command;
}
export declare function forceStartApexDebugLogging(): Promise<void>;
