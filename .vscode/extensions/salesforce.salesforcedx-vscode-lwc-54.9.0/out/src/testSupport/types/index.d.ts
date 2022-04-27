import { Location, Uri } from 'vscode';
/**
 * Test type is 'lwc' for all LWC Jest tests.
 * The enum is created for future extensibility.
 */
export declare const enum TestType {
    LWC = "lwc"
}
/**
 * Test result statuses are presented with
 * different colors in the test explorer.
 */
export declare const enum TestResultStatus {
    PASSED = 0,
    FAILED = 1,
    SKIPPED = 2,
    UNKNOWN = 3
}
/**
 * Test Result interface contains the test result status.
 * For now, failure messages are stored in DiagnosticCollection instead of here.
 */
export interface TestResult {
    status: TestResultStatus;
}
/**
 * The discriminant enum for the TestExecutionInfo discriminated union.
 */
export declare const enum TestInfoKind {
    TEST_CASE = "testCase",
    TEST_FILE = "testFile",
    TEST_DIRECTORY = "testDirectory"
}
/**
 * Raw Test Results generated from Jest output.
 * The title and ancestorTitles will be used to match and merge with the existing test cases
 * created by test file parser.
 */
export interface RawTestResult {
    title: string;
    ancestorTitles?: string[];
    status: TestResultStatus;
}
/**
 * Test File Information.
 * It contains the test's URI, location (The beginning of the documentation by default),
 * test results and associated test cases information.
 */
export interface TestFileInfo {
    kind: TestInfoKind.TEST_FILE;
    testType: TestType;
    testUri: Uri;
    testLocation?: Location;
    testResult?: TestResult;
    testCasesInfo?: TestCaseInfo[];
    rawTestResults?: RawTestResult[];
}
/**
 * Test Case Information.
 * It contains the test case's URI, location, and
 * test name and ancestor titles, which are used for matching with test results.
 */
export interface TestCaseInfo {
    kind: TestInfoKind.TEST_CASE;
    testType: TestType;
    testUri: Uri;
    testLocation?: Location;
    testResult?: TestResult;
    testName: string;
    ancestorTitles?: string[];
}
/**
 * Test Directory Information.
 * It contains the test directory Uri.
 */
export interface TestDirectoryInfo {
    kind: TestInfoKind.TEST_DIRECTORY;
    testType: TestType;
    testUri: Uri;
    testResult?: TestResult;
}
/**
 * Test Execution Information.
 */
export declare type TestExecutionInfo = TestCaseInfo | TestFileInfo | TestDirectoryInfo;
/**
 * Top level Jest output JSON object shape
 */
export interface LwcJestTestResults {
    numFailedTestSuites: number;
    numFailedTests: number;
    numPassedTestSuites: number;
    numPassedTests: number;
    numPendingTestSuites: number;
    numPendingTests: number;
    numRuntimeErrorTestSuites: number;
    numTotalTestSuites: number;
    numTotalTests: number;
    testResults: LwcJestTestFileResult[];
}
/**
 * Jest Test Assertion Result status.
 * - 'passed' transforms to TestResultStatus.PASSED
 * - 'failed' transforms to TestResultStatus.FAILED
 * - All other statuses tranform to TestResultStatus.SKIPPED
 */
declare type LwcJestTestResultStatus = 'passed' | 'failed' | 'pending' | 'skipped' | 'pending' | 'todo' | 'disabled';
/**
 * Jest Test File Result
 */
export interface LwcJestTestFileResult {
    status: 'passed' | 'failed';
    startTime: number;
    endTime: number;
    name: string;
    assertionResults: LwcJestTestAssertionResult[];
}
/**
 * Jest Test Assertion Result
 */
export interface LwcJestTestAssertionResult {
    status: LwcJestTestResultStatus;
    title: string;
    ancestorTitles: string[];
    failureMessages: string[];
    fullName: string;
    location: {
        column: number;
        line: number;
    };
}
export {};
//# sourceMappingURL=index.d.ts.map