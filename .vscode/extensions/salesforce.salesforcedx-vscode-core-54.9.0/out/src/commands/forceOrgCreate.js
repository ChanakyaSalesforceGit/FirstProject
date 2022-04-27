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
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const path = require("path");
const vscode = require("vscode");
const channels_1 = require("../channels");
const context_1 = require("../context");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const statuses_1 = require("../statuses");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
const util_2 = require("./util");
exports.DEFAULT_ALIAS = 'vscodeScratchOrg';
exports.DEFAULT_EXPIRATION_DAYS = '7';
class ForceOrgCreateExecutor extends util_2.SfdxCommandletExecutor {
    build(data) {
        const selectionPath = path.relative(util_1.getRootWorkspacePath(), // this is safe because of workspaceChecker
        data.file);
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_org_create_default_scratch_org_text'))
            .withArg('force:org:create')
            .withFlag('-f', `${selectionPath}`)
            .withFlag('--setalias', data.alias)
            .withFlag('--durationdays', data.expirationDays)
            .withArg('--setdefaultusername')
            .withLogName('force_org_create_default_scratch_org')
            .withJson()
            .build();
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
        execution.stdoutSubject.subscribe(realData => {
            stdOut += realData.toString();
        });
        execution.processExitSubject.subscribe((exitCode) => __awaiter(this, void 0, void 0, function* () {
            this.logMetric(execution.command.logName, startTime);
            try {
                const createParser = new cli_1.OrgCreateResultParser(stdOut);
                if (createParser.createIsSuccessful()) {
                    // NOTE: there is a beta in which this command also allows users to create sandboxes
                    // once it's GA this will have to be updated
                    context_1.setWorkspaceOrgTypeWithOrgType(context_1.OrgType.SourceTracked);
                }
                else {
                    const errorResponse = createParser.getResult();
                    if (errorResponse) {
                        channels_1.channelService.appendLine(errorResponse.message);
                        telemetry_1.telemetryService.sendException('force_org_create', errorResponse.message);
                    }
                }
            }
            catch (err) {
                channels_1.channelService.appendLine(messages_1.nls.localize('force_org_create_result_parsing_error'));
                channels_1.channelService.appendLine(err);
                telemetry_1.telemetryService.sendException('force_org_create', `Error while parsing org create response ${err}`);
            }
        }));
        notifications_1.notificationService.reportCommandExecutionStatus(execution, cancellationToken);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
}
exports.ForceOrgCreateExecutor = ForceOrgCreateExecutor;
class AliasGatherer {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultExpirationdate = exports.DEFAULT_EXPIRATION_DAYS;
            let defaultAlias = exports.DEFAULT_ALIAS;
            if (util_1.hasRootWorkspace()) {
                const folderName = util_1.getRootWorkspace().name.replace(/\W/g /* Replace all non-alphanumeric characters */, '');
                defaultAlias = helpers_1.isAlphaNumSpaceString(folderName)
                    ? folderName
                    : exports.DEFAULT_ALIAS;
            }
            const aliasInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_alias_name'),
                placeHolder: defaultAlias,
                validateInput: value => {
                    return helpers_1.isAlphaNumSpaceString(value) || value === ''
                        ? null
                        : messages_1.nls.localize('error_invalid_org_alias');
                }
            };
            const alias = yield vscode.window.showInputBox(aliasInputOptions);
            // Hitting enter with no alias will use the value of `defaultAlias`
            if (alias === undefined) {
                return { type: 'CANCEL' };
            }
            const expirationDaysInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_scratch_org_expiration_days'),
                placeHolder: defaultExpirationdate,
                validateInput: value => {
                    return helpers_1.isIntegerInRange(value, [1, 30]) || value === ''
                        ? null
                        : messages_1.nls.localize('error_invalid_expiration_days');
                }
            };
            const scratchOrgExpirationInDays = yield vscode.window.showInputBox(expirationDaysInputOptions);
            if (scratchOrgExpirationInDays === undefined) {
                return { type: 'CANCEL' };
            }
            return {
                type: 'CONTINUE',
                data: {
                    alias: alias === '' ? defaultAlias : alias,
                    expirationDays: scratchOrgExpirationInDays === ''
                        ? defaultExpirationdate
                        : scratchOrgExpirationInDays
                }
            };
        });
    }
}
exports.AliasGatherer = AliasGatherer;
const preconditionChecker = new util_2.CompositePreconditionChecker(new util_2.SfdxWorkspaceChecker(), new util_2.DevUsernameChecker());
const parameterGatherer = new util_2.CompositeParametersGatherer(new util_2.FileSelector(messages_1.nls.localize('parameter_gatherer_enter_scratch_org_def_files'), messages_1.nls.localize('error_no_scratch_def'), 'config/**/*-scratch-def.json'), new AliasGatherer());
function forceOrgCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(preconditionChecker, parameterGatherer, new ForceOrgCreateExecutor());
        yield commandlet.run();
    });
}
exports.forceOrgCreate = forceOrgCreate;
//# sourceMappingURL=forceOrgCreate.js.map