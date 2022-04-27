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
const core_1 = require("@salesforce/core");
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const commands_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/commands");
const channels_1 = require("../../channels");
const messages_1 = require("../../messages");
const telemetry_1 = require("../../telemetry");
const util_1 = require("../../util");
const forceConfigSet_1 = require("../forceConfigSet");
const util_2 = require("../util");
const authParamsGatherer_1 = require("./authParamsGatherer");
class ForceAuthLogoutAll extends util_2.SfdxCommandletExecutor {
    static withoutShowingChannel() {
        const instance = new ForceAuthLogoutAll();
        instance.showChannelOutput = false;
        return instance;
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_auth_logout_all_text'))
            .withArg('force:auth:logout')
            .withArg('--all')
            .withArg('--noprompt')
            .withLogName('force_auth_logout')
            .build();
    }
}
exports.ForceAuthLogoutAll = ForceAuthLogoutAll;
const workspaceChecker = new util_2.SfdxWorkspaceChecker();
const parameterGatherer = new util_2.EmptyParametersGatherer();
const executor = new ForceAuthLogoutAll();
const commandlet = new util_2.SfdxCommandlet(workspaceChecker, parameterGatherer, executor);
function forceAuthLogoutAll() {
    return __awaiter(this, void 0, void 0, function* () {
        yield commandlet.run();
    });
}
exports.forceAuthLogoutAll = forceAuthLogoutAll;
class AuthLogoutDefault extends src_1.LibraryCommandletExecutor {
    constructor() {
        super(messages_1.nls.localize('force_auth_logout_default_text'), 'force_auth_logout_default', channels_1.OUTPUT_CHANNEL);
    }
    run(response, progress, token) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield removeUsername(response.data);
            }
            catch (e) {
                telemetry_1.telemetryService.sendException(e.name, e.message);
                return false;
            }
            return true;
        });
    }
}
exports.AuthLogoutDefault = AuthLogoutDefault;
function forceAuthLogoutDefault() {
    return __awaiter(this, void 0, void 0, function* () {
        const { username, isScratch, alias, error } = yield resolveDefaultUsername();
        if (error) {
            telemetry_1.telemetryService.sendException(error.name, error.message);
            commands_1.notificationService.showErrorMessage('Logout failed to run');
        }
        else if (username) {
            // confirm logout for scratch orgs due to special considerations:
            // https://developer.salesforce.com/docs/atlas.en-us.sfdx_dev.meta/sfdx_dev/sfdx_dev_auth_logout.htm
            const logoutCommandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), isScratch
                ? new authParamsGatherer_1.ScratchOrgLogoutParamsGatherer(username, alias)
                : new util_2.SimpleGatherer(username), new AuthLogoutDefault());
            yield logoutCommandlet.run();
        }
        else {
            commands_1.notificationService.showInformationMessage(messages_1.nls.localize('auth_logout_no_default_org'));
        }
    });
}
exports.forceAuthLogoutDefault = forceAuthLogoutDefault;
function removeUsername(username) {
    return __awaiter(this, void 0, void 0, function* () {
        yield forceConfigSet_1.forceConfigSet('');
        const authRemover = yield core_1.AuthRemover.create();
        yield authRemover.removeAuth(username);
    });
}
function resolveDefaultUsername() {
    return __awaiter(this, void 0, void 0, function* () {
        const usernameOrAlias = yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(false);
        if (usernameOrAlias) {
            const username = yield util_1.OrgAuthInfo.getUsername(usernameOrAlias);
            const alias = username !== usernameOrAlias ? usernameOrAlias : undefined;
            let isScratch = false;
            try {
                isScratch = yield util_1.OrgAuthInfo.isAScratchOrg(username);
            }
            catch (err) {
                return { error: err, isScratch: false };
            }
            return { username, isScratch, alias };
        }
        return { isScratch: false };
    });
}
//# sourceMappingURL=forceAuthLogout.js.map