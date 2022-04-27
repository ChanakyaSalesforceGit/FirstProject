import { Indexer } from '@salesforce/lightning-lsp-common';
import * as vscode from 'vscode';
import { LwcJestTestResults, TestCaseInfo, TestFileInfo } from '../types';
declare class LwcTestIndexer implements Indexer, vscode.Disposable {
    private disposables;
    private hasIndexedTestFiles;
    private testFileInfoMap;
    private diagnosticCollection;
    private onDidUpdateTestResultsIndexEventEmitter;
    private onDidUpdateTestIndexEventEmitter;
    onDidUpdateTestResultsIndex: vscode.Event<undefined>;
    onDidUpdateTestIndex: vscode.Event<undefined>;
    /**
     * Register Test Indexer with extension context
     * @param context extension context
     */
    register(context: vscode.ExtensionContext): void;
    dispose(): void;
    /**
     * Set up file system watcher for test files change/create/delete.
     */
    configureAndIndex(): Promise<void>;
    /**
     * Reset test indexer
     */
    resetIndex(): void;
    /**
     * Find test files in the workspace if needed.
     * It lazily index all test files until opening test explorer
     */
    findAllTestFileInfo(): Promise<TestFileInfo[]>;
    indexTestCases(testUri: vscode.Uri): Promise<TestCaseInfo[]>;
    /**
     * Parse and create test case information if needed.
     * It lazily parses test information, until expanding the test file or providing code lens
     * @param testUri uri of test file
     */
    findTestInfoFromLwcJestTestFile(testUri: vscode.Uri): Promise<TestCaseInfo[]>;
    private parseTestFileAndMergeTestResults;
    /**
     * Find all LWC test files in the workspace by glob pattern.
     * This does not start parsing the test files.
     */
    private indexAllTestFiles;
    private indexTestFile;
    private resetTestFileIndex;
    private mergeTestResults;
    /**
     * Update and merge Jest test results with test locations.
     * Upon finishing update, it emits an event to update the test explorer.
     * @param testResults test result JSON object provided by test result watcher
     */
    updateTestResults(testResults: LwcJestTestResults): void;
}
export declare const lwcTestIndexer: LwcTestIndexer;
export {};
//# sourceMappingURL=lwcTestIndexer.d.ts.map