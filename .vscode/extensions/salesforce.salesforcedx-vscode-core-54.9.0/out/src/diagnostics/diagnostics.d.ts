import { ForceSourceDeployErrorResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DeployResult } from '@salesforce/source-deploy-retrieve';
import * as vscode from 'vscode';
export declare function getRange(lineNumber: string, columnNumber: string): vscode.Range;
export declare function handleDiagnosticErrors(errors: ForceSourceDeployErrorResponse, workspacePath: string, sourcePathOrPaths: string, errorCollection: vscode.DiagnosticCollection): vscode.DiagnosticCollection;
export declare function handleDeployDiagnostics(deployResult: DeployResult, errorCollection: vscode.DiagnosticCollection): vscode.DiagnosticCollection;
