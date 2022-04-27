import { CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { Observable } from 'rxjs/Observable';
import * as vscode from 'vscode';
/**
 * A centralized location for all notification functionalities.
 */
export declare class NotificationService {
    private static instance;
    static getInstance(): NotificationService;
    showErrorMessage(message: string, ...items: string[]): Thenable<string | undefined>;
    showInformationMessage(message: string, ...items: string[]): Thenable<string | undefined>;
    showWarningMessage(message: string, ...items: string[]): Thenable<string | undefined>;
    showWarningModal(message: string, ...items: string[]): Thenable<string | undefined>;
    reportCommandExecutionStatus(execution: CommandExecution, cancellationToken?: vscode.CancellationToken): void;
    reportExecutionStatus(executionName: string, observable: Observable<number | undefined>, cancellationToken?: vscode.CancellationToken): void;
    showFailedExecution(executionName: string): void;
    private showCanceledExecution;
    showSuccessfulExecution(executionName: string): Promise<void>;
    reportExecutionError(executionName: string, observable: Observable<Error | undefined>): void;
}
