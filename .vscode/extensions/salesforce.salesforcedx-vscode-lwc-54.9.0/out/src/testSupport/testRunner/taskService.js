"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const channel_1 = require("../../channel");
const messages_1 = require("../../messages");
/**
 * A wrapper over vscode.Task that emits events during task lifecycle
 */
class SfdxTask {
    constructor(task) {
        this.task = task;
        this.onDidStartEventEmitter = new vscode.EventEmitter();
        this.onDidEndEventEmitter = new vscode.EventEmitter();
        this.onDidStart = this.onDidStartEventEmitter.event;
        this.onDidEnd = this.onDidEndEventEmitter.event;
    }
    notifyStartTask() {
        this.onDidStartEventEmitter.fire(this);
    }
    notifyEndTask() {
        this.onDidEndEventEmitter.fire(this);
    }
    execute() {
        return __awaiter(this, void 0, void 0, function* () {
            this.taskExecution = yield vscode.tasks.executeTask(this.task);
            return this;
        });
    }
    terminate() {
        if (this.taskExecution) {
            this.taskExecution.terminate();
        }
        this.dispose();
    }
    dispose() {
        this.onDidStartEventEmitter.dispose();
        this.onDidEndEventEmitter.dispose();
    }
}
exports.SfdxTask = SfdxTask;
/**
 * Task service for creating vscode.Task
 */
class TaskService {
    constructor() {
        this.createdTasks = new Map();
    }
    /**
     * Register task service with extension context
     * @param context extension context
     */
    registerTaskService(context) {
        const handleDidStartTask = vscode.tasks.onDidStartTask(taskStartEvent => {
            const { execution } = taskStartEvent;
            const { definition } = execution.task;
            const { sfdxTaskId } = definition;
            if (sfdxTaskId) {
                const foundTask = this.createdTasks.get(sfdxTaskId);
                if (foundTask) {
                    foundTask.notifyStartTask();
                }
            }
        }, null, context.subscriptions);
        const handleDidEndTask = vscode.tasks.onDidEndTask(taskEndEvent => {
            const { execution } = taskEndEvent;
            const { definition } = execution.task;
            const { sfdxTaskId } = definition;
            if (sfdxTaskId) {
                const foundTask = this.createdTasks.get(sfdxTaskId);
                if (foundTask) {
                    foundTask.notifyEndTask();
                    this.createdTasks.delete(sfdxTaskId);
                    foundTask.dispose();
                }
            }
        }, null, context.subscriptions);
        return vscode.Disposable.from(handleDidStartTask, handleDidEndTask);
    }
    /**
     * Create a vscode.Task instance
     * @param taskId a unique task id
     * @param taskName localized task name
     * @param taskScope task scope
     * @param cmd command line executable
     * @param args command line arguments
     */
    createTask(taskId, taskName, taskScope, cmd, args) {
        const taskDefinition = {
            type: 'sfdxLwcTest',
            sfdxTaskId: taskId
        };
        const taskSource = 'SFDX';
        // https://github.com/forcedotcom/salesforcedx-vscode/issues/2097
        // Git Bash shell doesn't handle command paths correctly.
        // Always launch with command prompt (cmd.exe) in Windows.
        const isWin32 = /^win32/.test(process.platform);
        let taskShellExecutionOptions;
        if (isWin32) {
            channel_1.channelService.appendLine(messages_1.nls.localize('task_windows_command_prompt_messaging'));
            taskShellExecutionOptions = {
                executable: 'cmd.exe',
                shellArgs: ['/d', '/c']
            };
        }
        const taskShellExecution = new vscode.ShellExecution(cmd, args, taskShellExecutionOptions);
        const task = new vscode.Task(taskDefinition, taskScope, taskName, taskSource, taskShellExecution);
        task.presentationOptions.clear = true;
        const sfdxTask = new SfdxTask(task);
        this.createdTasks.set(taskId, sfdxTask);
        return sfdxTask;
    }
}
exports.taskService = new TaskService();
//# sourceMappingURL=taskService.js.map