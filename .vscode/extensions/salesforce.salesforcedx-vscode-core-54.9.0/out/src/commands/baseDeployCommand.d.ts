import { ForceDeployResultParser } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import * as vscode from 'vscode';
import { SfdxCommandletExecutor } from './util/sfdxCommandlet';
export declare enum DeployType {
    Deploy = "deploy",
    Push = "push"
}
export declare abstract class BaseDeployExecutor extends SfdxCommandletExecutor<string> {
    static errorCollection: vscode.DiagnosticCollection;
    execute(response: ContinueResponse<string>): void;
    protected abstract getDeployType(): DeployType;
    outputResult(parser: ForceDeployResultParser): void;
}
