import * as vscode from 'vscode';
import { TestExecutionInfo } from '../types';
/**
 * Test result watcher to watch for creating/updating test results,
 * and update test indexer.
 */
declare class TestResultsWatcher implements vscode.Disposable {
    private fileSystemWatchers;
    private disposables;
    /**
     * Register test result watcher with extension context
     * @param context extension context
     */
    register(context: vscode.ExtensionContext): void;
    /**
     * Determine the test result output folder. It should be under
     * .sfdx/tools/testresults/lwc of the workspace folder of the test
     * @param workspaceFolder workspace folder of the test
     * @param testExecutionInfo test execution info
     */
    getTempFolder(workspaceFolder: vscode.WorkspaceFolder, testExecutionInfo: TestExecutionInfo): string;
    /**
     * Start file watchers for test results if needed.
     * The file watchers will read test result file and update test indexer.
     * @param outputFilePath Jest test results output path
     */
    watchTestResults(outputFilePath: string): void;
    private updateTestResultsFromTestResultsJson;
    dispose(): void;
}
export declare const testResultsWatcher: TestResultsWatcher;
export {};
//# sourceMappingURL=testResultsWatcher.d.ts.map