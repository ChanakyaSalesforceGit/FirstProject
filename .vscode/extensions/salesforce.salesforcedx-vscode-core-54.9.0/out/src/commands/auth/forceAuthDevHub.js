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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const util_1 = require("../util");
const util_2 = require("../../util");
const core_1 = require("@salesforce/core");
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const os_1 = require("os");
const vscode = require("vscode");
const constants_1 = require("../../constants");
const messages_1 = require("../../messages");
const demo_mode_1 = require("../../modes/demo-mode");
const util_3 = require("../../util");
const index_1 = require("../../util/index");
const forceAuthWebLogin_1 = require("./forceAuthWebLogin");
class ForceAuthDevHubExecutor extends util_1.SfdxCommandletExecutor {
    constructor() {
        super(...arguments);
        this.showChannelOutput = util_3.isSFDXContainerMode();
    }
    build(data) {
        const command = new cli_1.SfdxCommandBuilder().withDescription(messages_1.nls.localize('force_auth_web_login_authorize_dev_hub_text'));
        if (util_3.isSFDXContainerMode()) {
            command
                .withArg('force:auth:device:login')
                .withLogName('force_auth_device_dev_hub');
        }
        else {
            command.withArg('force:auth:web:login').withLogName('force_auth_dev_hub');
        }
        command.withArg('--setdefaultdevhubusername');
        return command.build();
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const execution = new cli_1.CliCommandExecutor(this.build(response.data), {
                cwd: util_2.getRootWorkspacePath()
            }).execute(cancellationToken);
            execution.processExitSubject.subscribe(() => this.configureDefaultDevHubLocation());
            this.attachExecution(execution, cancellationTokenSource, cancellationToken);
        });
    }
    configureDefaultDevHubLocation() {
        return __awaiter(this, void 0, void 0, function* () {
            const globalDevHubName = yield index_1.OrgAuthInfo.getDefaultDevHubUsernameOrAlias(false, index_1.ConfigSource.Global);
            if (helpers_1.isNullOrUndefined(globalDevHubName)) {
                const localDevHubName = yield index_1.OrgAuthInfo.getDefaultDevHubUsernameOrAlias(false, index_1.ConfigSource.Local);
                if (localDevHubName) {
                    yield this.setGlobalDefaultDevHub(localDevHubName);
                }
            }
        });
    }
    setGlobalDefaultDevHub(newUsername) {
        return __awaiter(this, void 0, void 0, function* () {
            const homeDirectory = os_1.homedir();
            const globalConfig = yield core_1.ConfigFile.create({
                isGlobal: true,
                rootFolder: homeDirectory,
                filename: constants_1.SFDX_CONFIG_FILE
            });
            globalConfig.set(constants_1.DEFAULT_DEV_HUB_USERNAME_KEY, newUsername);
            yield globalConfig.write();
        });
    }
}
exports.ForceAuthDevHubExecutor = ForceAuthDevHubExecutor;
class ForceAuthDevHubDemoModeExecutor extends forceAuthWebLogin_1.ForceAuthDemoModeExecutor {
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_auth_web_login_authorize_dev_hub_text'))
            .withArg('force:auth:web:login')
            .withArg('--setdefaultdevhubusername')
            .withArg('--noprompt')
            .withJson()
            .withLogName('force_auth_dev_hub_demo_mode')
            .build();
    }
}
exports.ForceAuthDevHubDemoModeExecutor = ForceAuthDevHubDemoModeExecutor;
const workspaceChecker = new util_1.SfdxWorkspaceChecker();
const parameterGatherer = new util_1.EmptyParametersGatherer();
function createAuthDevHubExecutor() {
    return demo_mode_1.isDemoMode()
        ? new ForceAuthDevHubDemoModeExecutor()
        : new ForceAuthDevHubExecutor();
}
exports.createAuthDevHubExecutor = createAuthDevHubExecutor;
function forceAuthDevHub() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, createAuthDevHubExecutor());
        yield commandlet.run();
    });
}
exports.forceAuthDevHub = forceAuthDevHub;
//# sourceMappingURL=forceAuthDevHub.js.map