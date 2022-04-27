import * as vscode from 'vscode';
/**
 * A wrapper over vscode.Task that emits events during task lifecycle
 */
export declare class SfdxTask {
    private task;
    private taskExecution?;
    onDidStart: vscode.Event<SfdxTask>;
    onDidEnd: vscode.Event<SfdxTask>;
    private onDidStartEventEmitter;
    private onDidEndEventEmitter;
    constructor(task: vscode.Task);
    notifyStartTask(): void;
    notifyEndTask(): void;
    execute(): Promise<this>;
    terminate(): void;
    dispose(): void;
}
/**
 * Task service for creating vscode.Task
 */
declare class TaskService {
    private createdTasks;
    constructor();
    /**
     * Register task service with extension context
     * @param context extension context
     */
    registerTaskService(context: vscode.ExtensionContext): vscode.Disposable;
    /**
     * Create a vscode.Task instance
     * @param taskId a unique task id
     * @param taskName localized task name
     * @param taskScope task scope
     * @param cmd command line executable
     * @param args command line arguments
     */
    createTask(taskId: string, taskName: string, taskScope: vscode.WorkspaceFolder | vscode.TaskScope, cmd: string, args: Array<string | vscode.ShellQuotedString>): SfdxTask;
}
export declare const taskService: TaskService;
export {};
//# sourceMappingURL=taskService.d.ts.map