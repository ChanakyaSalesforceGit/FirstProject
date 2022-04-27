import { CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { Observable } from 'rxjs/Observable';
import * as vscode from 'vscode';
export declare class ProgressNotification {
    static show(execution: CommandExecution, token: vscode.CancellationTokenSource, progressLocation?: vscode.ProgressLocation, progressReporter?: Observable<number>): Thenable<void>;
}
