import { TestExecutionInfo } from '../types';
/**
 * Run an LWC Jest test from provided test execution info
 * @param testExecutionInfo test execution info
 */
export declare function forceLwcTestRun(testExecutionInfo: TestExecutionInfo): Promise<import("../testRunner/taskService").SfdxTask | undefined>;
/**
 * Run an individual test case
 * @param data a test explorer node or information provided by code lens
 */
export declare function forceLwcTestCaseRun(data: {
    testExecutionInfo: TestExecutionInfo;
}): Promise<import("../testRunner/taskService").SfdxTask | undefined>;
/**
 * Run a test file
 * @param data a test explorer node
 */
export declare function forceLwcTestFileRun(data: {
    testExecutionInfo: TestExecutionInfo;
}): Promise<import("../testRunner/taskService").SfdxTask | undefined>;
/**
 * Run all tests in the workspace folder
 */
export declare function forceLwcTestRunAllTests(): Promise<import("../testRunner/taskService").SfdxTask | undefined> | undefined;
/**
 * Run the test of currently focused editor
 */
export declare function forceLwcTestRunActiveTextEditorTest(): Promise<import("../testRunner/taskService").SfdxTask | undefined> | undefined;
//# sourceMappingURL=forceLwcTestRunAction.d.ts.map