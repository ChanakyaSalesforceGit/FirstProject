import * as vscode from 'vscode';
import { TestExecutionInfo } from '../types';
import { SfdxTask } from './taskService';
export declare const enum TestRunType {
    RUN = "run",
    DEBUG = "debug",
    WATCH = "watch"
}
/**
 * Returns relative path for Jest runTestsByPath on Windows
 * or absolute path on other systems
 * @param cwd
 * @param testFsPath
 */
export declare function normalizeRunTestsByPath(cwd: string, testFsPath: string): string;
declare type JestExecutionInfo = {
    jestArgs: string[];
    jestOutputFilePath: string;
};
/**
 * Test Runner class for running/debugging/watching Jest tests.
 */
export declare class TestRunner {
    private testExecutionInfo;
    private testRunType;
    private testRunId;
    private logName?;
    /**
     * Create a test runner from test execution info.
     * @param testExecutionInfo Test Execution information
     * @param testRunType Run, Watch or Debug
     * @param logName Telemetry log name. If specified we will send command telemetry event when task finishes
     */
    constructor(testExecutionInfo: TestExecutionInfo, testRunType: TestRunType, logName?: string);
    /**
     * Deterine jest command line arguments and output file path.
     * @param workspaceFolder workspace folder of the test
     */
    getJestExecutionInfo(workspaceFolder: vscode.WorkspaceFolder): JestExecutionInfo | undefined;
    /**
     * Generate shell execution info necessary for task execution
     */
    getShellExecutionInfo(): {
        workspaceFolder: vscode.WorkspaceFolder;
        command: string;
        args: string[];
        testResultFsPath: string;
    } | undefined;
    /**
     * Start watching test results if needed
     * @param testResultFsPath test result file path
     */
    startWatchingTestResults(testResultFsPath: string): void;
    private getTaskName;
    /**
     * Create and start a task for test execution.
     * Returns the task wrapper on task creation if successful.
     */
    executeAsSfdxTask(): Promise<SfdxTask | undefined>;
}
export {};
//# sourceMappingURL=testRunner.d.ts.map