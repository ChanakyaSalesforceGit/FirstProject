import { Measurements, Properties, TelemetryData } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { Command, CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse, ParametersGatherer, PreconditionChecker } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
import { EmptyPostChecker } from '.';
export declare enum CommandVersion {
    Beta = "beta",
    Legacy = "legacy",
    Default = "beta"
}
export interface FlagParameter<T> {
    flag?: T;
    commandVersion?: CommandVersion;
}
export interface CommandParams {
    readonly command: string;
    description: Record<string, string>;
    logName: Record<string, string>;
}
export interface CommandletExecutor<T> {
    execute(response: ContinueResponse<T>): void;
    readonly onDidFinishExecution?: vscode.Event<[number, number]>;
}
export declare abstract class SfdxCommandletExecutor<T> implements CommandletExecutor<T> {
    protected showChannelOutput: boolean;
    protected executionCwd: string;
    protected onDidFinishExecutionEventEmitter: vscode.EventEmitter<[number, number]>;
    readonly onDidFinishExecution: vscode.Event<[number, number]>;
    protected attachExecution(execution: CommandExecution, cancellationTokenSource: vscode.CancellationTokenSource, cancellationToken: vscode.CancellationToken): void;
    logMetric(logName: string | undefined, hrstart: [number, number], properties?: Properties, measurements?: Measurements): void;
    execute(response: ContinueResponse<T>): void;
    protected getTelemetryData(success: boolean, response: ContinueResponse<T>, output: string): TelemetryData | undefined;
    abstract build(data: T): Command;
}
export declare class SfdxCommandlet<T> {
    private readonly prechecker;
    private readonly postchecker;
    private readonly gatherer;
    private readonly executor;
    readonly onDidFinishExecution?: vscode.Event<[number, number]>;
    constructor(checker: PreconditionChecker, gatherer: ParametersGatherer<T>, executor: CommandletExecutor<T>, postchecker?: EmptyPostChecker);
    run(): Promise<void>;
}
