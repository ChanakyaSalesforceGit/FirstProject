"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const messages_1 = require("../messages");
class TaskViewService {
    constructor() {
        this._onDidChangeTreeData = new vscode_1.EventEmitter();
        this.onDidChangeTreeData = this
            ._onDidChangeTreeData.event;
        this.tasks = [];
    }
    static getInstance() {
        if (!TaskViewService.instance) {
            TaskViewService.instance = new TaskViewService();
        }
        return TaskViewService.instance;
    }
    addCommandExecution(execution, cancellationTokenSource) {
        const task = new Task(this, execution, cancellationTokenSource);
        task.monitor();
        this.tasks.push(task);
        this._onDidChangeTreeData.fire(undefined);
        return task;
    }
    removeTask(task) {
        const index = this.tasks.indexOf(task);
        if (index !== -1) {
            this.tasks.splice(index, 1);
            this._onDidChangeTreeData.fire(undefined);
            return true;
        }
        return false;
    }
    terminateTask(task) {
        if (task) {
            if (task.cancel()) {
                this.removeTask(task);
            }
        }
        else {
            const lru = this.tasks.pop();
            if (lru) {
                this.removeTask(lru);
            }
        }
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // This is the root node
            return this.tasks;
        }
        return [];
    }
}
exports.TaskViewService = TaskViewService;
class Task extends vscode_1.TreeItem {
    constructor(taskViewProvider, execution, cancellationTokenSource) {
        super(messages_1.nls.localize('task_view_running_message', execution.command), vscode_1.TreeItemCollapsibleState.None);
        this.taskViewProvider = taskViewProvider;
        this.execution = execution;
        this.cancellationTokenSource = cancellationTokenSource;
    }
    monitor() {
        this.execution.processExitSubject.subscribe(data => {
            this.taskViewProvider.removeTask(this);
        });
        this.execution.processErrorSubject.subscribe(data => {
            this.taskViewProvider.removeTask(this);
        });
    }
    cancel() {
        if (this.cancellationTokenSource) {
            this.cancellationTokenSource.cancel();
            return true;
        }
        else {
            return false;
        }
    }
}
exports.Task = Task;
//# sourceMappingURL=taskView.js.map