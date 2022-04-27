import * as vscode from 'vscode';
import { TestCaseInfo, TestExecutionInfo } from '../types';
/**
 * Create a VS Code debug configuration for LWC Jest tests.
 * @param command LWC test runner executable
 * @param args CLI arguments
 * @param cwd current working directory
 */
export declare function getDebugConfiguration(command: string, args: string[], cwd: string): vscode.DebugConfiguration;
/**
 * Start a debug session with provided test execution information
 * @param testExecutionInfo test execution information
 */
export declare function forceLwcTestDebug(testExecutionInfo: TestExecutionInfo): Promise<void>;
/**
 * Debug an individual test case
 * @param data a test explorer node or information provided by code lens
 */
export declare function forceLwcTestCaseDebug(data: {
    testExecutionInfo: TestCaseInfo;
}): Promise<void>;
/**
 * Debug a test file
 * @param data a test explorer node
 */
export declare function forceLwcTestFileDebug(data: {
    testExecutionInfo: TestExecutionInfo;
}): Promise<void>;
/**
 * Debug the test of currently focused editor
 */
export declare function forceLwcTestDebugActiveTextEditorTest(): Promise<void>;
/**
 * Log the start time of debug session
 * @param session debug session
 */
export declare function handleDidStartDebugSession(session: vscode.DebugSession): void;
/**
 * Send telemetry event if applicable when debug session ends
 * @param session debug session
 */
export declare function handleDidTerminateDebugSession(session: vscode.DebugSession): void;
//# sourceMappingURL=forceLwcTestDebugAction.d.ts.map