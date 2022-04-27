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
const channels_1 = require("../channels");
const context_1 = require("../context");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const settings_1 = require("../settings");
const sfdxProject_1 = require("../sfdxProject");
const path = require("path");
const timers_1 = require("timers");
const vscode = require("vscode");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
class DeployQueue {
    constructor() {
        this.queue = new Set();
        this.locked = false;
    }
    static get() {
        if (!DeployQueue.instance) {
            DeployQueue.instance = new DeployQueue();
        }
        return DeployQueue.instance;
    }
    static reset() {
        if (DeployQueue.instance) {
            if (DeployQueue.instance.timer) {
                clearTimeout(DeployQueue.instance.timer);
            }
            DeployQueue.instance = new DeployQueue();
        }
    }
    enqueue(document) {
        return __awaiter(this, void 0, void 0, function* () {
            this.queue.add(document);
            yield this.wait();
            yield this.doDeploy();
        });
    }
    unlock() {
        return __awaiter(this, void 0, void 0, function* () {
            this.locked = false;
            yield this.wait();
            yield this.doDeploy();
        });
    }
    wait() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise(resolve => {
                if (this.timer) {
                    clearTimeout(this.timer);
                }
                this.timer = timers_1.setTimeout(resolve, DeployQueue.ENQUEUE_DELAY);
            });
        });
    }
    doDeploy() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.locked && this.queue.size > 0) {
                this.locked = true;
                const toDeploy = Array.from(this.queue);
                this.queue.clear();
                try {
                    let defaultUsernameorAlias;
                    if (util_1.hasRootWorkspace()) {
                        defaultUsernameorAlias = yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(false);
                    }
                    const orgType = yield context_1.getWorkspaceOrgType(defaultUsernameorAlias);
                    if (orgType === context_1.OrgType.SourceTracked) {
                        const forceCommand = settings_1.sfdxCoreSettings.getPushOrDeployOnSaveOverrideConflicts()
                            ? '.force'
                            : '';
                        const command = `sfdx.force.source.push${forceCommand}`;
                        vscode.commands.executeCommand(command);
                    }
                    else {
                        vscode.commands.executeCommand('sfdx.force.source.deploy.multiple.source.paths', toDeploy);
                    }
                    telemetry_1.telemetryService.sendEventData('deployOnSave', {
                        deployType: orgType === context_1.OrgType.SourceTracked ? 'Push' : 'Deploy'
                    }, {
                        documentsToDeploy: toDeploy.length,
                        waitTimeForLastDeploy: this.deployWaitStart
                            ? telemetry_1.telemetryService.getEndHRTime(this.deployWaitStart)
                            : 0
                    });
                }
                catch (e) {
                    switch (e.name) {
                        case 'NamedOrgNotFound':
                            displayError(messages_1.nls.localize('error_fetching_auth_info_text'));
                            break;
                        case 'NoDefaultusernameSet':
                            displayError(messages_1.nls.localize('error_push_or_deploy_on_save_no_default_username'));
                            break;
                        default:
                            displayError(e.message);
                    }
                    this.locked = false;
                }
                this.deployWaitStart = undefined;
            }
            else if (this.locked && !this.deployWaitStart) {
                this.deployWaitStart = process.hrtime();
            }
        });
    }
}
exports.DeployQueue = DeployQueue;
DeployQueue.ENQUEUE_DELAY = 500; // milliseconds
function registerPushOrDeployOnSave() {
    return __awaiter(this, void 0, void 0, function* () {
        vscode.workspace.onDidSaveTextDocument((textDocument) => __awaiter(this, void 0, void 0, function* () {
            if (settings_1.sfdxCoreSettings.getPushOrDeployOnSaveEnabled() &&
                !(yield ignorePath(textDocument.uri))) {
                yield DeployQueue.get().enqueue(textDocument.uri);
            }
        }));
    });
}
exports.registerPushOrDeployOnSave = registerPushOrDeployOnSave;
function displayError(message) {
    notifications_1.notificationService.showErrorMessage(message);
    channels_1.channelService.appendLine(message);
    channels_1.channelService.showChannelOutput();
    telemetry_1.telemetryService.sendException('push_deploy_on_save_queue', `DeployOnSaveError: Documents were queued but a deployment was not triggered`);
}
function ignorePath(uri) {
    return __awaiter(this, void 0, void 0, function* () {
        return isDotFile(uri) || !(yield pathIsInPackageDirectory(uri));
    });
}
function pathIsInPackageDirectory(documentUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const documentPath = documentUri.fsPath;
        try {
            return yield sfdxProject_1.SfdxPackageDirectories.isInPackageDirectory(documentPath);
        }
        catch (error) {
            switch (error.name) {
                case 'NoPackageDirectoriesFound':
                    error.message = messages_1.nls.localize('error_no_package_directories_found_on_setup_text');
                    break;
                case 'NoPackageDirectoryPathsFound':
                    error.message = messages_1.nls.localize('error_no_package_directories_paths_found_text');
                    break;
            }
            displayError(error.message);
            throw error;
        }
    });
}
exports.pathIsInPackageDirectory = pathIsInPackageDirectory;
function isDotFile(uri) {
    return path.basename(uri.fsPath).startsWith('.');
}
//# sourceMappingURL=pushOrDeployOnSave.js.map