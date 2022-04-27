"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const statuses_1 = require("../statuses");
const util_1 = require("../util");
const util_2 = require("./util");
class IdGatherer {
    constructor(sessionIdToUpdate) {
        this.sessionIdToUpdate = sessionIdToUpdate;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            return { type: 'CONTINUE', data: { id: this.sessionIdToUpdate } };
        });
    }
}
exports.IdGatherer = IdGatherer;
class DebuggerSessionDetachExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:record:update')
            .withDescription(messages_1.nls.localize('force_debugger_stop_text'))
            .withFlag('--sobjecttype', 'ApexDebuggerSession')
            .withFlag('--sobjectid', data ? data.id : '')
            .withFlag('--values', 'Status="Detach"')
            .withArg('--usetoolingapi')
            .withLogName('force_debugger_stop')
            .build();
    }
}
exports.DebuggerSessionDetachExecutor = DebuggerSessionDetachExecutor;
class StopActiveDebuggerSessionExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:soql:query')
            .withDescription(messages_1.nls.localize('force_debugger_query_session_text'))
            .withFlag('--query', "SELECT Id FROM ApexDebuggerSession WHERE Status = 'Active' LIMIT 1")
            .withArg('--usetoolingapi')
            .withJson()
            .withLogName('force_debugger_query_session')
            .build();
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
                cwd: util_1.getRootWorkspacePath()
            }).execute(cancellationToken);
            const resultPromise = new cli_1.CommandOutput().getCmdResult(execution);
            execution.processExitSubject.subscribe(() => {
                this.logMetric(execution.command.logName, startTime);
            });
            channels_1.channelService.streamCommandOutput(execution);
            channels_1.channelService.showChannelOutput();
            notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
            statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
            try {
                const result = yield resultPromise;
                const queryResponse = JSON.parse(result);
                if (queryResponse &&
                    queryResponse.result &&
                    queryResponse.result.size === 1) {
                    const sessionIdToUpdate = queryResponse.result.records[0].Id;
                    if (sessionIdToUpdate && sessionIdToUpdate.startsWith('07a')) {
                        const sessionDetachCommandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new IdGatherer(sessionIdToUpdate), new DebuggerSessionDetachExecutor());
                        yield sessionDetachCommandlet.run();
                    }
                }
                else {
                    notifications_1.notificationService.showInformationMessage(messages_1.nls.localize('force_debugger_stop_none_found_text'));
                }
                // tslint:disable-next-line:no-empty
            }
            catch (e) { }
            return Promise.resolve();
        });
    }
}
exports.StopActiveDebuggerSessionExecutor = StopActiveDebuggerSessionExecutor;
function forceDebuggerStop() {
    return __awaiter(this, void 0, void 0, function* () {
        const sessionStopCommandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new util_2.EmptyParametersGatherer(), new StopActiveDebuggerSessionExecutor());
        yield sessionStopCommandlet.run();
    });
}
exports.forceDebuggerStop = forceDebuggerStop;
//# sourceMappingURL=forceDebuggerStop.js.map