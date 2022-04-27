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
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
const util_2 = require("./util");
class ForceOrgOpenContainerExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_org_open_default_scratch_org_text'))
            .withArg('force:org:open')
            .withLogName('force_org_open_default_scratch_org')
            .withArg('--urlonly')
            .withJson()
            .build();
    }
    buildUserMessageWith(orgData) {
        return messages_1.nls.localize('force_org_open_container_mode_message_text', orgData.result.orgId, orgData.result.username, orgData.result.url);
    }
    execute(response) {
        const startTime = process.hrtime();
        const cancellationTokenSource = new vscode.CancellationTokenSource();
        const cancellationToken = cancellationTokenSource.token;
        const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
            cwd: util_1.getRootWorkspacePath(),
            env: { SFDX_JSON_TO_STDOUT: 'true' }
        }).execute(cancellationToken);
        channels_1.channelService.streamCommandStartStop(execution);
        let stdOut = '';
        execution.stdoutSubject.subscribe(cliResponse => {
            stdOut += cliResponse.toString();
        });
        execution.processExitSubject.subscribe(() => {
            this.logMetric(execution.command.logName, startTime);
            try {
                const orgOpenParser = new cli_1.OrgOpenContainerResultParser(stdOut);
                if (orgOpenParser.openIsSuccessful()) {
                    const cliOrgData = orgOpenParser.getResult();
                    const authenticatedOrgUrl = cliOrgData.result.url;
                    channels_1.channelService.appendLine(this.buildUserMessageWith(cliOrgData));
                    // open the default browser
                    vscode.env.openExternal(vscode.Uri.parse(authenticatedOrgUrl));
                }
                else {
                    const errorResponse = orgOpenParser.getResult();
                    channels_1.channelService.appendLine(errorResponse.message);
                }
            }
            catch (error) {
                channels_1.channelService.appendLine(messages_1.nls.localize('force_org_open_default_scratch_org_container_error'));
                telemetry_1.telemetryService.sendException('force_org_open_container', `There was an error when parsing the org open response ${error}`);
            }
        });
        notifications_1.notificationService.reportCommandExecutionStatus(execution, cancellationToken);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
}
exports.ForceOrgOpenContainerExecutor = ForceOrgOpenContainerExecutor;
class ForceOrgOpenExecutor extends util_2.SfdxCommandletExecutor {
    constructor() {
        super(...arguments);
        this.showChannelOutput = false;
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_org_open_default_scratch_org_text'))
            .withArg('force:org:open')
            .withLogName('force_org_open_default_scratch_org')
            .build();
    }
}
exports.ForceOrgOpenExecutor = ForceOrgOpenExecutor;
function getExecutor() {
    return util_1.isSFDXContainerMode()
        ? new ForceOrgOpenContainerExecutor()
        : new ForceOrgOpenExecutor();
}
exports.getExecutor = getExecutor;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new util_2.EmptyParametersGatherer();
function forceOrgOpen() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, getExecutor());
        yield commandlet.run();
    });
}
exports.forceOrgOpen = forceOrgOpen;
//# sourceMappingURL=forceOrgOpen.js.map