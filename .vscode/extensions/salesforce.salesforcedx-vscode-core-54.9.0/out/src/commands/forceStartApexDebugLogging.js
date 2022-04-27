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
const constants_1 = require("../constants");
const messages_1 = require("../messages");
const util_1 = require("../util");
const util_2 = require("./util");
const util_3 = require("util");
const context_1 = require("../context");
const telemetry_1 = require("../telemetry");
const _1 = require("./");
class ForceStartApexDebugLoggingExecutor extends util_2.SfdxCommandletExecutor {
    constructor() {
        super(...arguments);
        this.cancellationTokenSource = new vscode.CancellationTokenSource();
        this.cancellationToken = this.cancellationTokenSource.token;
    }
    build() {
        return new cli_1.CommandBuilder(messages_1.nls.localize('force_start_apex_debug_logging'))
            .withLogName('force_start_apex_debug_logging')
            .build();
    }
    attachSubExecution(execution) {
        channels_1.channelService.streamCommandOutput(execution);
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            const executionWrapper = new cli_1.CompositeCliCommandExecutor(this.build()).execute(this.cancellationToken);
            this.attachExecution(executionWrapper, this.cancellationTokenSource, this.cancellationToken);
            executionWrapper.processExitSubject.subscribe(() => {
                this.logMetric(executionWrapper.command.logName, startTime);
            });
            try {
                // query traceflag
                const userId = yield getUserId(util_1.getRootWorkspacePath());
                let resultJson = yield this.subExecute(new ForceQueryTraceFlag().build(userId));
                if (resultJson && resultJson.result && resultJson.result.totalSize >= 1) {
                    const traceflag = resultJson.result.records[0];
                    _1.developerLogTraceFlag.setTraceFlagDebugLevelInfo(traceflag.Id, traceflag.StartDate, traceflag.ExpirationDate, traceflag.DebugLevelId);
                    if (!_1.developerLogTraceFlag.isValidDebugLevelId()) {
                        throw new Error(messages_1.nls.localize('invalid_debug_level_id_error'));
                    }
                    yield this.subExecute(new UpdateDebugLevelsExecutor().build());
                    if (!_1.developerLogTraceFlag.isValidDateLength()) {
                        _1.developerLogTraceFlag.validateDates();
                        yield this.subExecute(new UpdateTraceFlagsExecutor().build());
                    }
                }
                else {
                    resultJson = yield this.subExecute(new CreateDebugLevel().build());
                    if (resultJson) {
                        const debugLevelId = resultJson.result.id;
                        _1.developerLogTraceFlag.setDebugLevelId(debugLevelId);
                        _1.developerLogTraceFlag.validateDates();
                        resultJson = yield this.subExecute(new CreateTraceFlag(userId).build());
                        _1.developerLogTraceFlag.setTraceFlagId(resultJson.result.id);
                    }
                }
                _1.developerLogTraceFlag.turnOnLogging();
                executionWrapper.successfulExit();
            }
            catch (e) {
                executionWrapper.failureExit(e);
            }
        });
    }
    subExecute(command) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.cancellationToken.isCancellationRequested) {
                const execution = new cli_1.CliCommandExecutor(command, {
                    cwd: util_1.getRootWorkspacePath()
                }).execute(this.cancellationToken);
                this.attachSubExecution(execution);
                const resultPromise = new cli_1.CommandOutput().getCmdResult(execution);
                const result = yield resultPromise;
                return JSON.parse(result);
            }
        });
    }
}
exports.ForceStartApexDebugLoggingExecutor = ForceStartApexDebugLoggingExecutor;
function getUserId(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const defaultUsernameOrAlias = yield context_1.getDefaultUsernameOrAlias();
        if (util_3.isNullOrUndefined(defaultUsernameOrAlias)) {
            const err = messages_1.nls.localize('error_no_default_username');
            telemetry_1.telemetryService.sendException('replay_debugger_undefined_username', err);
            throw new Error(err);
        }
        const username = yield util_1.OrgAuthInfo.getUsername(defaultUsernameOrAlias);
        if (util_3.isNullOrUndefined(username)) {
            const err = messages_1.nls.localize('error_no_default_username');
            telemetry_1.telemetryService.sendException('replay_debugger_undefined_username', err);
            throw new Error(err);
        }
        const execution = new cli_1.CliCommandExecutor(new ForceQueryUser(username).build(), {
            cwd: projectPath
        }).execute();
        telemetry_1.telemetryService.sendCommandEvent(execution.command.logName);
        const cmdOutput = new cli_1.CommandOutput();
        const result = yield cmdOutput.getCmdResult(execution);
        try {
            const orgInfo = JSON.parse(result).result.records[0].Id;
            return Promise.resolve(orgInfo);
        }
        catch (e) {
            return Promise.reject(result);
        }
    });
}
exports.getUserId = getUserId;
class ForceQueryUser extends util_2.SfdxCommandletExecutor {
    constructor(username) {
        super();
        this.username = username;
    }
    build() {
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:soql:query')
            .withFlag('--query', `SELECT id FROM User WHERE username='${this.username}'`)
            .withJson()
            .withLogName('force_query_user')
            .build();
    }
}
exports.ForceQueryUser = ForceQueryUser;
class CreateDebugLevel extends util_2.SfdxCommandletExecutor {
    constructor() {
        super(...arguments);
        this.developerName = `ReplayDebuggerLevels${Date.now()}`;
    }
    build() {
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:record:create')
            .withFlag('--sobjecttype', 'DebugLevel')
            .withFlag('--values', `developername=${this.developerName} MasterLabel=${this.developerName} apexcode=${constants_1.APEX_CODE_DEBUG_LEVEL} visualforce=${constants_1.VISUALFORCE_DEBUG_LEVEL}`)
            .withArg('--usetoolingapi')
            .withJson()
            .withLogName('force_create_debug_level')
            .build();
    }
}
exports.CreateDebugLevel = CreateDebugLevel;
class CreateTraceFlag extends util_2.SfdxCommandletExecutor {
    constructor(userId) {
        super();
        this.userId = userId;
    }
    build() {
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:record:create')
            .withFlag('--sobjecttype', 'TraceFlag')
            .withFlag('--values', `tracedentityid='${this.userId}' logtype=developer_log debuglevelid=${_1.developerLogTraceFlag.getDebugLevelId()} StartDate='' ExpirationDate='${_1.developerLogTraceFlag
            .getExpirationDate()
            .toUTCString()}`)
            .withArg('--usetoolingapi')
            .withJson()
            .withLogName('force_create_trace_flag')
            .build();
    }
}
exports.CreateTraceFlag = CreateTraceFlag;
class UpdateDebugLevelsExecutor extends util_2.SfdxCommandletExecutor {
    build() {
        const nonNullDebugLevel = _1.developerLogTraceFlag.getDebugLevelId();
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:record:update')
            .withFlag('--sobjecttype', 'DebugLevel')
            .withFlag('--sobjectid', nonNullDebugLevel)
            .withFlag('--values', `ApexCode=${constants_1.APEX_CODE_DEBUG_LEVEL} Visualforce=${constants_1.VISUALFORCE_DEBUG_LEVEL}`)
            .withArg('--usetoolingapi')
            .withJson()
            .withLogName('force_update_debug_level')
            .build();
    }
}
exports.UpdateDebugLevelsExecutor = UpdateDebugLevelsExecutor;
class UpdateTraceFlagsExecutor extends util_2.SfdxCommandletExecutor {
    build() {
        const nonNullTraceFlag = _1.developerLogTraceFlag.getTraceFlagId();
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:data:record:update')
            .withFlag('--sobjecttype', 'TraceFlag')
            .withFlag('--sobjectid', nonNullTraceFlag)
            .withFlag('--values', `StartDate='' ExpirationDate='${_1.developerLogTraceFlag
            .getExpirationDate()
            .toUTCString()}'`)
            .withArg('--usetoolingapi')
            .withJson()
            .withLogName('force_update_trace_flag')
            .build();
    }
}
exports.UpdateTraceFlagsExecutor = UpdateTraceFlagsExecutor;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new util_2.EmptyParametersGatherer();
class ForceQueryTraceFlag extends util_2.SfdxCommandletExecutor {
    build(userId) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_start_apex_debug_logging'))
            .withArg('force:data:soql:query')
            .withFlag('--query', `SELECT id, logtype, startdate, expirationdate, debuglevelid, debuglevel.apexcode, debuglevel.visualforce FROM TraceFlag WHERE logtype='DEVELOPER_LOG' AND TracedEntityId='${userId}'`)
            .withArg('--usetoolingapi')
            .withJson()
            .withLogName('force_query_trace_flag')
            .build();
    }
}
exports.ForceQueryTraceFlag = ForceQueryTraceFlag;
function forceStartApexDebugLogging() {
    return __awaiter(this, void 0, void 0, function* () {
        const executor = new ForceStartApexDebugLoggingExecutor();
        const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, executor);
        yield commandlet.run();
    });
}
exports.forceStartApexDebugLogging = forceStartApexDebugLogging;
//# sourceMappingURL=forceStartApexDebugLogging.js.map