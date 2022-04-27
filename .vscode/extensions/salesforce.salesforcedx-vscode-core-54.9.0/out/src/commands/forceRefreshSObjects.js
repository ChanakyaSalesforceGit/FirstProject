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
const src_1 = require("@salesforce/salesforcedx-sobjects-faux-generator/out/src");
const src_2 = require("@salesforce/salesforcedx-sobjects-faux-generator/out/src");
const types_1 = require("@salesforce/salesforcedx-sobjects-faux-generator/out/src/types");
const src_3 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const commands_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/commands");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const channels_1 = require("../channels");
const context_1 = require("../context");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
class SObjectRefreshGatherer {
    constructor(source) {
        this.source = source;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            let category = types_1.SObjectCategory.ALL;
            if (!this.source || this.source === types_1.SObjectRefreshSource.Manual) {
                const options = [
                    messages_1.nls.localize('sobject_refresh_all'),
                    messages_1.nls.localize('sobject_refresh_custom'),
                    messages_1.nls.localize('sobject_refresh_standard')
                ];
                const choice = yield vscode.window.showQuickPick(options);
                switch (choice) {
                    case options[0]:
                        category = types_1.SObjectCategory.ALL;
                        break;
                    case options[1]:
                        category = types_1.SObjectCategory.CUSTOM;
                        break;
                    case options[2]:
                        category = types_1.SObjectCategory.STANDARD;
                        break;
                    default:
                        return { type: 'CANCEL' };
                }
            }
            return {
                type: 'CONTINUE',
                data: {
                    category,
                    source: this.source || types_1.SObjectRefreshSource.Manual
                }
            };
        });
    }
}
exports.SObjectRefreshGatherer = SObjectRefreshGatherer;
class ForceRefreshSObjectsExecutor extends src_3.SfdxCommandletExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_sobjects_refresh'))
            .withArg('sobject definitions refresh')
            .withLogName('force_generate_faux_classes_create')
            .build();
    }
    execute(response) {
        var _a, _b;
        return __awaiter(this, void 0, void 0, function* () {
            if (ForceRefreshSObjectsExecutor.isActive) {
                vscode.window.showErrorMessage(messages_1.nls.localize('force_sobjects_no_refresh_if_already_active_error_text'));
                return;
            }
            const startTime = process.hrtime();
            ForceRefreshSObjectsExecutor.isActive = true;
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const execution = new cli_1.LocalCommandExecution(this.build(response.data));
            channels_1.channelService.streamCommandOutput(execution);
            if (this.showChannelOutput) {
                channels_1.channelService.showChannelOutput();
            }
            if (response.data.source !== types_1.SObjectRefreshSource.StartupMin) {
                commands_1.notificationService.reportCommandExecutionStatus(execution, channels_1.channelService, cancellationToken);
            }
            let progressLocation = vscode.ProgressLocation.Notification;
            if (response.data.source !== types_1.SObjectRefreshSource.Manual) {
                progressLocation = vscode.ProgressLocation.Window;
            }
            commands_1.ProgressNotification.show(execution, cancellationTokenSource, progressLocation);
            const projectPath = vscode.workspace.workspaceFolders[0].uri.fsPath;
            const commandName = execution.command.logName;
            try {
                let result;
                let transformer;
                if (response.data.source === types_1.SObjectRefreshSource.StartupMin) {
                    transformer = yield src_2.SObjectTransformerFactory.create(execution.cmdEmitter, cancellationToken, projectPath, types_1.SObjectCategory.STANDARD, types_1.SObjectRefreshSource.StartupMin);
                }
                else {
                    transformer = yield src_2.SObjectTransformerFactory.create(execution.cmdEmitter, cancellationToken, projectPath, response.data.category, response.data.source);
                }
                result = yield transformer.transform(projectPath);
                console.log('Generate success ' + result.data);
                this.logMetric(commandName, startTime, {
                    category: response.data.category,
                    source: response.data.source,
                    cancelled: String(result.data.cancelled)
                }, {
                    standardObjects: (_a = result.data.standardObjects) !== null && _a !== void 0 ? _a : 0,
                    customObjects: (_b = result.data.customObjects) !== null && _b !== void 0 ? _b : 0
                });
            }
            catch (result) {
                console.log('Generate error ' + result.error);
                telemetry_1.telemetryService.sendException(result.name, result.error);
            }
            ForceRefreshSObjectsExecutor.isActive = false;
            return;
        });
    }
}
exports.ForceRefreshSObjectsExecutor = ForceRefreshSObjectsExecutor;
ForceRefreshSObjectsExecutor.isActive = false;
const workspaceChecker = new src_3.SfdxWorkspaceChecker();
function forceRefreshSObjects(source) {
    return __awaiter(this, void 0, void 0, function* () {
        const parameterGatherer = new SObjectRefreshGatherer(source);
        const commandlet = new src_3.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceRefreshSObjectsExecutor());
        yield commandlet.run();
    });
}
exports.forceRefreshSObjects = forceRefreshSObjects;
function verifyUsernameAndInitSObjectDefinitions(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const hasDefaultUsernameSet = (yield context_1.workspaceContext.getConnection()).getUsername() !== undefined;
        if (hasDefaultUsernameSet) {
            initSObjectDefinitions(projectPath).catch(e => telemetry_1.telemetryService.sendException(e.name, e.message));
        }
    });
}
exports.verifyUsernameAndInitSObjectDefinitions = verifyUsernameAndInitSObjectDefinitions;
function initSObjectDefinitions(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (projectPath) {
            const sobjectFolder = getSObjectsDirectory(projectPath);
            if (!fs.existsSync(sobjectFolder)) {
                telemetry_1.telemetryService.sendEventData('sObjectRefreshNotification', { type: types_1.SObjectRefreshSource.Startup }, undefined);
                forceRefreshSObjects(types_1.SObjectRefreshSource.Startup).catch(e => {
                    throw e;
                });
            }
        }
    });
}
exports.initSObjectDefinitions = initSObjectDefinitions;
function getSObjectsDirectory(projectPath) {
    return path.join(projectPath, src_1.SFDX_DIR, src_1.TOOLS_DIR, src_1.SOBJECTS_DIR);
}
function getStandardSObjectsDirectory(projectPath) {
    return path.join(projectPath, src_1.SFDX_DIR, src_1.TOOLS_DIR, src_1.SOBJECTS_DIR, src_1.STANDARDOBJECTS_DIR);
}
function checkSObjectsAndRefresh(projectPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (projectPath &&
            !fs.existsSync(getStandardSObjectsDirectory(projectPath))) {
            telemetry_1.telemetryService.sendEventData('sObjectRefreshNotification', { type: types_1.SObjectRefreshSource.StartupMin }, undefined);
            try {
                yield forceRefreshSObjects(types_1.SObjectRefreshSource.StartupMin);
            }
            catch (e) {
                telemetry_1.telemetryService.sendException(e.name, e.message);
                throw e;
            }
        }
    });
}
exports.checkSObjectsAndRefresh = checkSObjectsAndRefresh;
//# sourceMappingURL=forceRefreshSObjects.js.map