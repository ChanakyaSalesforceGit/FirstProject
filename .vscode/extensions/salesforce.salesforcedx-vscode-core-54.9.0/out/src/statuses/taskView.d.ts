import { CommandExecution } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancellationTokenSource, Event, TreeDataProvider, TreeItem, TreeItemCollapsibleState } from 'vscode';
export declare class TaskViewService implements TreeDataProvider<Task> {
    private static instance;
    private readonly tasks;
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: Event<Task | undefined>;
    constructor();
    static getInstance(): TaskViewService;
    addCommandExecution(execution: CommandExecution, cancellationTokenSource?: CancellationTokenSource): Task;
    removeTask(task: Task): boolean;
    terminateTask(task?: Task): void;
    getTreeItem(element: Task): TreeItem;
    getChildren(element?: Task): Task[];
}
export declare class Task extends TreeItem {
    readonly label?: string;
    readonly collapsibleState?: TreeItemCollapsibleState;
    private readonly taskViewProvider;
    private readonly execution;
    private readonly cancellationTokenSource?;
    constructor(taskViewProvider: TaskViewService, execution: CommandExecution, cancellationTokenSource?: CancellationTokenSource);
    monitor(): void;
    cancel(): boolean;
}
