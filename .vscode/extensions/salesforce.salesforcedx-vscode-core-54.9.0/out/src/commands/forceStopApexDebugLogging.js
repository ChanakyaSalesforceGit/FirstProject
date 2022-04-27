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
const _1 = require(".");
const decorators_1 = require("../decorators");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
const util_2 = require("./util");
class ForceStopApexDebugLoggingExecutor extends util_2.SfdxCommandletExecutor {
    build() {
        return deleteTraceFlag();
    }
    execute(response) {
        const startTime = process.hrtime();
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const execution = new cli_1.CliCommandExecutor(this.build(), {
            cwd: util_1.getRootWorkspacePath()
        }).execute(cancellationToken);
        this.attachExecution(execution, cancellationTokenSource, cancellationToken);
        execution.processExitSubject.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            this.logMetric(execution.command.logName, startTime);
            if (data !== undefined && String(data) === '0') {
                _1.developerLogTraceFlag.turnOffLogging();
                decorators_1.hideTraceFlagExpiration();
            }
        }));
    }
}
exports.ForceStopApexDebugLoggingExecutor = ForceStopApexDebugLoggingExecutor;
function turnOffLogging() {
    return __awaiter(this, void 0, void 0, function* () {
        if (_1.developerLogTraceFlag.isActive()) {
            const execution = new cli_1.CliCommandExecutor(deleteTraceFlag(), {
                cwd: util_1.getRootWorkspacePath()
            }).execute();
            telemetry_1.telemetryService.sendCommandEvent(execution.command.logName);
            const resultPromise = new cli_1.CommandOutput().getCmdResult(execution);
            const result = yield resultPromise;
            const resultJson = JSON.parse(result);
            if (resultJson.status === 0) {
                return Promise.resolve();
            }
            else {
                return Promise.reject('Restoring the debug levels failed.');
            }
        }
    });
}
exports.turnOffLogging = turnOffLogging;
function deleteTraceFlag() {
    const nonNullTraceFlag = _1.developerLogTraceFlag.getTraceFlagId();
    return new cli_1.SfdxCommandBuilder()
        .withDescription(messages_1.nls.localize('force_stop_apex_debug_logging'))
        .withArg('force:data:record:delete')
        .withFlag('--sobjecttype', 'TraceFlag')
        .withFlag('--sobjectid', nonNullTraceFlag)
        .withArg('--usetoolingapi')
        .withLogName('force_stop_apex_debug_logging')
        .build();
}
class ActiveLogging {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            if (_1.developerLogTraceFlag.isActive()) {
                return { type: 'CONTINUE', data: {} };
            }
            return { type: 'CANCEL' };
        });
    }
}
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new ActiveLogging();
const executor = new ForceStopApexDebugLoggingExecutor();
const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, executor);
function forceStopApexDebugLogging() {
    return __awaiter(this, void 0, void 0, function* () {
        yield commandlet.run();
    });
}
exports.forceStopApexDebugLogging = forceStopApexDebugLogging;
//# sourceMappingURL=forceStopApexDebugLogging.js.map