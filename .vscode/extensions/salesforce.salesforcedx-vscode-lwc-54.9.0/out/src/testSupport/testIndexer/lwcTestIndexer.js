"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jest_editor_support_1 = require("jest-editor-support");
const vscode = require("vscode");
const constants_1 = require("../types/constants");
const jestUtils_1 = require("./jestUtils");
class LwcTestIndexer {
    constructor() {
        this.disposables = [];
        this.hasIndexedTestFiles = false;
        this.testFileInfoMap = new Map();
        this.diagnosticCollection = vscode.languages.createDiagnosticCollection('lwcTestErrors');
        this.onDidUpdateTestResultsIndexEventEmitter = new vscode.EventEmitter();
        this.onDidUpdateTestIndexEventEmitter = new vscode.EventEmitter();
        this.onDidUpdateTestResultsIndex = this
            .onDidUpdateTestResultsIndexEventEmitter.event;
        this.onDidUpdateTestIndex = this.onDidUpdateTestIndexEventEmitter.event;
    }
    /**
     * Register Test Indexer with extension context
     * @param context extension context
     */
    register(context) {
        context.subscriptions.push(this);
        // It's actually a synchronous function to start file watcher.
        // Finding test files will only happen when going into test explorer
        // Parsing test files will happen when expanding on the test group nodes,
        // or open a test file, or on watched files change
        this.configureAndIndex().catch(error => console.error(error));
    }
    dispose() {
        while (this.disposables.length) {
            const disposable = this.disposables.pop();
            if (disposable) {
                disposable.dispose();
            }
        }
    }
    /**
     * Set up file system watcher for test files change/create/delete.
     */
    configureAndIndex() {
        return __awaiter(this, void 0, void 0, function* () {
            const lwcTestWatcher = vscode.workspace.createFileSystemWatcher(constants_1.LWC_TEST_GLOB_PATTERN);
            lwcTestWatcher.onDidCreate((testUri) => __awaiter(this, void 0, void 0, function* () {
                yield this.indexTestCases(testUri);
                this.onDidUpdateTestIndexEventEmitter.fire(undefined);
            }), this, this.disposables);
            lwcTestWatcher.onDidChange((testUri) => __awaiter(this, void 0, void 0, function* () {
                yield this.indexTestCases(testUri);
                this.onDidUpdateTestIndexEventEmitter.fire(undefined);
            }), this, this.disposables);
            lwcTestWatcher.onDidDelete(testUri => {
                const { fsPath } = testUri;
                this.resetTestFileIndex(fsPath);
                this.onDidUpdateTestIndexEventEmitter.fire(undefined);
            }, this, this.disposables);
        });
    }
    /**
     * Reset test indexer
     */
    resetIndex() {
        this.hasIndexedTestFiles = false;
        this.testFileInfoMap.clear();
        this.diagnosticCollection.clear();
        this.onDidUpdateTestIndexEventEmitter.fire(undefined);
    }
    /**
     * Find test files in the workspace if needed.
     * It lazily index all test files until opening test explorer
     */
    findAllTestFileInfo() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.hasIndexedTestFiles) {
                return [...this.testFileInfoMap.values()];
            }
            return yield this.indexAllTestFiles();
        });
    }
    indexTestCases(testUri) {
        return __awaiter(this, void 0, void 0, function* () {
            // parse
            const { fsPath: testFsPath } = testUri;
            let testFileInfo = this.testFileInfoMap.get(testFsPath);
            if (!testFileInfo) {
                testFileInfo = this.indexTestFile(testFsPath);
            }
            return this.parseTestFileAndMergeTestResults(testFileInfo);
        });
    }
    /**
     * Parse and create test case information if needed.
     * It lazily parses test information, until expanding the test file or providing code lens
     * @param testUri uri of test file
     */
    findTestInfoFromLwcJestTestFile(testUri) {
        return __awaiter(this, void 0, void 0, function* () {
            // parse
            const { fsPath: testFsPath } = testUri;
            let testFileInfo = this.testFileInfoMap.get(testFsPath);
            if (!testFileInfo) {
                testFileInfo = this.indexTestFile(testFsPath);
            }
            if (testFileInfo.testCasesInfo) {
                return testFileInfo.testCasesInfo;
            }
            return this.parseTestFileAndMergeTestResults(testFileInfo);
        });
    }
    parseTestFileAndMergeTestResults(testFileInfo) {
        try {
            const { testUri } = testFileInfo;
            const { fsPath: testFsPath } = testUri;
            const parseResults = jest_editor_support_1.parse(testFsPath);
            jestUtils_1.populateAncestorTitles(parseResults);
            const itBlocks = (parseResults.itBlocksWithAncestorTitles ||
                parseResults.itBlocks);
            const testCasesInfo = itBlocks.map(itBlock => {
                const { name, nameRange, ancestorTitles } = itBlock;
                const testName = name;
                const testRange = new vscode.Range(new vscode.Position(nameRange.start.line - 1, nameRange.start.column - 1), new vscode.Position(nameRange.end.line - 1, nameRange.end.column));
                const testLocation = new vscode.Location(testUri, testRange);
                const testCaseInfo = {
                    kind: "testCase" /* TEST_CASE */,
                    testType: "lwc" /* LWC */,
                    testName,
                    testUri,
                    testLocation,
                    ancestorTitles
                };
                return testCaseInfo;
            });
            if (testFileInfo.rawTestResults) {
                this.mergeTestResults(testCasesInfo, testFileInfo.rawTestResults);
            }
            testFileInfo.testCasesInfo = testCasesInfo;
            return testCasesInfo;
        }
        catch (error) {
            console.error(error);
            testFileInfo.testCasesInfo = [];
            return [];
        }
    }
    /**
     * Find all LWC test files in the workspace by glob pattern.
     * This does not start parsing the test files.
     */
    indexAllTestFiles() {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO, infer package directory from sfdx project json
            const lwcJestTestFiles = yield vscode.workspace.findFiles(constants_1.LWC_TEST_GLOB_PATTERN, '**/node_modules/**');
            const allTestFileInfo = lwcJestTestFiles.map(lwcJestTestFile => {
                const { fsPath } = lwcJestTestFile;
                let testFileInfo = this.testFileInfoMap.get(fsPath);
                if (!testFileInfo) {
                    testFileInfo = this.indexTestFile(fsPath);
                }
                return testFileInfo;
            });
            this.hasIndexedTestFiles = true;
            return allTestFileInfo;
        });
    }
    indexTestFile(testFsPath) {
        const testUri = vscode.Uri.file(testFsPath);
        const testLocation = new vscode.Location(testUri, new vscode.Position(0, 0));
        const testFileInfo = {
            kind: "testFile" /* TEST_FILE */,
            testType: "lwc" /* LWC */,
            testUri,
            testLocation
        };
        this.testFileInfoMap.set(testFsPath, testFileInfo);
        return testFileInfo;
    }
    resetTestFileIndex(testFsPath) {
        this.testFileInfoMap.delete(testFsPath);
    }
    mergeTestResults(testCasesInfo, rawTestResults) {
        const rawTestResultsByTitle = new Map();
        rawTestResults.forEach(rawTestResult => {
            const { title } = rawTestResult;
            rawTestResultsByTitle.set(title, [
                ...(rawTestResultsByTitle.get(title) || []),
                rawTestResult
            ]);
        });
        testCasesInfo.forEach(testCaseInfo => {
            const { testName, ancestorTitles: testCaseAncestorTitles } = testCaseInfo;
            const rawTestResultsOfTestName = rawTestResultsByTitle.get(testName);
            if (rawTestResultsOfTestName) {
                const matchedRawTestResults = rawTestResultsOfTestName.filter(rawTestResultOfTestName => {
                    const { title, ancestorTitles } = rawTestResultOfTestName;
                    // match ancestor titles if possible
                    const isMatched = testCaseAncestorTitles
                        ? testName === title &&
                            JSON.stringify(testCaseAncestorTitles) ===
                                JSON.stringify(ancestorTitles)
                        : testName === title;
                    return isMatched;
                });
                if (matchedRawTestResults && matchedRawTestResults.length > 0) {
                    testCaseInfo.testResult = {
                        status: matchedRawTestResults[0].status
                    };
                }
            }
        });
    }
    /**
     * Update and merge Jest test results with test locations.
     * Upon finishing update, it emits an event to update the test explorer.
     * @param testResults test result JSON object provided by test result watcher
     */
    updateTestResults(testResults) {
        testResults.testResults.forEach(testResult => {
            const { name, status: testFileStatus, assertionResults } = testResult;
            const testFsPath = vscode.Uri.file(name).fsPath;
            let testFileInfo = this.testFileInfoMap.get(testFsPath);
            if (!testFileInfo) {
                // If testFileInfo not found index it by fsPath.
                // it should be handled by file watcher on creating file, but just in case.
                testFileInfo = this.indexTestFile(testFsPath);
            }
            let testFileResultStatus = 3 /* UNKNOWN */;
            if (testFileStatus === 'passed') {
                testFileResultStatus = 0 /* PASSED */;
            }
            else if (testFileStatus === 'failed') {
                testFileResultStatus = 1 /* FAILED */;
            }
            testFileInfo.testResult = {
                status: testFileResultStatus
            };
            const testUri = vscode.Uri.file(testFsPath);
            const diagnostics = assertionResults.reduce((diagnosticsResult, assertionResult) => {
                const { failureMessages, location } = assertionResult;
                if (failureMessages && failureMessages.length > 0) {
                    const failureMessage = jestUtils_1.sanitizeFailureMessage(failureMessages[0]);
                    const failurePosition = jestUtils_1.extractPositionFromFailureMessage(testFsPath, failureMessage) ||
                        new vscode.Position(location.line - 1, location.column - 1);
                    const diagnostic = new vscode.Diagnostic(new vscode.Range(failurePosition, failurePosition), failureMessage);
                    diagnosticsResult.push(diagnostic);
                }
                return diagnosticsResult;
            }, []);
            this.diagnosticCollection.set(testUri, diagnostics);
            // Generate test results
            const rawTestResults = assertionResults.map(assertionResult => {
                const { title, status, ancestorTitles } = assertionResult;
                let testResultStatus;
                if (status === 'passed') {
                    testResultStatus = 0 /* PASSED */;
                }
                else if (status === 'failed') {
                    testResultStatus = 1 /* FAILED */;
                }
                else {
                    testResultStatus = 2 /* SKIPPED */;
                }
                const testCaseInfo = {
                    title,
                    status: testResultStatus,
                    ancestorTitles
                };
                return testCaseInfo;
            });
            // Set raw test results
            testFileInfo.rawTestResults = rawTestResults;
            const testCasesInfo = testFileInfo.testCasesInfo;
            if (testCasesInfo) {
                // Merge if test case info is available,
                // If it's not available at the moment, merging will happen on parsing the test file
                this.mergeTestResults(testCasesInfo, rawTestResults);
            }
        });
        // Update Test Explorer View
        this.onDidUpdateTestResultsIndexEventEmitter.fire(undefined);
    }
}
exports.lwcTestIndexer = new LwcTestIndexer();
//# sourceMappingURL=lwcTestIndexer.js.map