import * as vscode from 'vscode';
import { TestExecutionInfo } from '../types';
import { SfdxTask } from './taskService';
/**
 * Test Watcher class for watching Jest tests
 */
declare class TestWatcher {
    private watchedTests;
    /**
     * Start watching tests from provided test execution info
     * @param testExecutionInfo test execution info
     */
    watchTest(testExecutionInfo: TestExecutionInfo): Promise<SfdxTask | undefined>;
    /**
     * Stop watching tests from provided test execution info
     * @param testExecutionInfo test execution info
     */
    stopWatchingTest(testExecutionInfo: TestExecutionInfo): void;
    /**
     * Stop watching all tests.
     */
    stopWatchingAllTests(): void;
    /**
     * Determine if we are watching the test uri
     * @param testUri uri of the test
     */
    isWatchingTest(testUri: vscode.Uri): boolean;
    /**
     * Execute setContext command if applicable so that start/stop watching buttons
     * display appropriately in editor/title
     * @param testUri uri of the test
     */
    setWatchingContext(testUri: vscode.Uri): void;
}
export declare const testWatcher: TestWatcher;
export {};
//# sourceMappingURL=testWatcher.d.ts.map