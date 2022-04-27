"use strict";
/*
 * Copyright (c) 2018, salesforce.com, inc.
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
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const output_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/output");
const vscode = require("vscode");
const channels_1 = require("../channels");
const diagnostics_1 = require("../diagnostics");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const pushOrDeployOnSave_1 = require("../settings/pushOrDeployOnSave");
const statuses_1 = require("../statuses");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
const sfdxCommandlet_1 = require("./util/sfdxCommandlet");
var DeployType;
(function (DeployType) {
    DeployType["Deploy"] = "deploy";
    DeployType["Push"] = "push";
})(DeployType = exports.DeployType || (exports.DeployType = {}));
class BaseDeployExecutor extends sfdxCommandlet_1.SfdxCommandletExecutor {
    execute(response) {
        const startTime = process.hrtime();
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const workspacePath = util_1.getRootWorkspacePath() || '';
        const execFilePathOrPaths = this.getDeployType() === DeployType.Deploy ? response.data : '';
        const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
            cwd: workspacePath,
            env: { SFDX_JSON_TO_STDOUT: 'true' }
        }).execute(cancellationToken);
        channels_1.channelService.streamCommandStartStop(execution);
        let stdOut = '';
        execution.stdoutSubject.subscribe(realData => {
            stdOut += realData.toString();
        });
        execution.processExitSubject.subscribe((exitCode) => __awaiter(this, void 0, void 0, function* () {
            const telemetry = new src_1.TelemetryBuilder();
            let success = false;
            try {
                BaseDeployExecutor.errorCollection.clear();
                if (stdOut) {
                    const deployParser = new cli_1.ForceDeployResultParser(stdOut);
                    const errors = deployParser.getErrors();
                    if (errors && !deployParser.hasConflicts()) {
                        channels_1.channelService.showChannelOutput();
                        diagnostics_1.handleDiagnosticErrors(errors, workspacePath, execFilePathOrPaths, BaseDeployExecutor.errorCollection);
                    }
                    else {
                        success = true;
                    }
                    this.outputResult(deployParser);
                }
            }
            catch (e) {
                BaseDeployExecutor.errorCollection.clear();
                if (e.name !== 'DeployParserFail') {
                    e.message =
                        'Error while creating diagnostics for vscode problem view.';
                }
                telemetry_1.telemetryService.sendException(e.name, e.message);
                console.error(e.message);
            }
            telemetry.addProperty('success', String(success));
            this.logMetric(execution.command.logName, startTime, telemetry.build().properties);
            yield pushOrDeployOnSave_1.DeployQueue.get().unlock();
        }));
        notifications_1.notificationService.reportCommandExecutionStatus(execution, cancellationToken);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
    outputResult(parser) {
        const table = new output_1.Table();
        const titleType = this.getDeployType();
        const successes = parser.getSuccesses();
        const errors = parser.getErrors();
        const deployedSource = successes
            ? successes.result.deployedSource
            : undefined;
        if (deployedSource || parser.hasConflicts()) {
            const rows = deployedSource || (errors && errors.result);
            const title = !parser.hasConflicts()
                ? messages_1.nls.localize(`table_title_${titleType}ed_source`)
                : undefined;
            const outputTable = table.createTable(rows, [
                { key: 'state', label: messages_1.nls.localize('table_header_state') },
                { key: 'fullName', label: messages_1.nls.localize('table_header_full_name') },
                { key: 'type', label: messages_1.nls.localize('table_header_type') },
                { key: 'filePath', label: messages_1.nls.localize('table_header_project_path') }
            ], title);
            if (parser.hasConflicts()) {
                channels_1.channelService.appendLine(messages_1.nls.localize('push_conflicts_error') + '\n');
            }
            channels_1.channelService.appendLine(outputTable);
            if (deployedSource && deployedSource.length === 0) {
                const noResults = messages_1.nls.localize('table_no_results_found') + '\n';
                channels_1.channelService.appendLine(noResults);
            }
        }
        if (errors && !parser.hasConflicts()) {
            const { name, message, result } = errors;
            if (result) {
                const outputTable = table.createTable(result, [
                    {
                        key: 'filePath',
                        label: messages_1.nls.localize('table_header_project_path')
                    },
                    { key: 'error', label: messages_1.nls.localize('table_header_errors') }
                ], messages_1.nls.localize(`table_title_${titleType}_errors`));
                channels_1.channelService.appendLine(outputTable);
            }
            else if (name && message) {
                channels_1.channelService.appendLine(`${name}: ${message}\n`);
            }
        }
    }
}
exports.BaseDeployExecutor = BaseDeployExecutor;
BaseDeployExecutor.errorCollection = vscode.languages.createDiagnosticCollection('deploy-errors');
//# sourceMappingURL=baseDeployCommand.js.map