"use strict";
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
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const core_1 = require("@salesforce/core");
const util_1 = require("util");
const vscode = require("vscode");
const channels_1 = require("../channels");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const telemetry_1 = require("../telemetry");
const index_1 = require("./index");
class OrgAuthInfo {
    static getDefaultUsernameOrAlias(enableWarning) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultUserName = yield index_1.ConfigUtil.getConfigValue(constants_1.DEFAULT_USERNAME_KEY);
                if (util_1.isUndefined(defaultUserName)) {
                    displayMessage(messages_1.nls.localize('error_no_default_username'), enableWarning, VSCodeWindowTypeEnum.Informational);
                    return undefined;
                }
                else {
                    const configSource = yield index_1.ConfigUtil.getConfigSource(constants_1.DEFAULT_USERNAME_KEY);
                    if (configSource === index_1.ConfigSource.Global) {
                        displayMessage(messages_1.nls.localize('warning_using_global_username'), enableWarning, VSCodeWindowTypeEnum.Warning);
                    }
                }
                return JSON.stringify(defaultUserName).replace(/\"/g, '');
            }
            catch (err) {
                console.error(err);
                telemetry_1.telemetryService.sendException('get_default_username_alias', err.message);
                return undefined;
            }
        });
    }
    static getDefaultDevHubUsernameOrAlias(enableWarning, configSource) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const defaultDevHubUserName = yield index_1.ConfigUtil.getConfigValue(constants_1.DEFAULT_DEV_HUB_USERNAME_KEY, configSource);
                if (util_1.isUndefined(defaultDevHubUserName)) {
                    const showButtonText = messages_1.nls.localize('notification_make_default_dev');
                    const selection = yield displayMessage(messages_1.nls.localize('error_no_default_devhubusername'), enableWarning, VSCodeWindowTypeEnum.Informational, [showButtonText]);
                    if (selection && selection === showButtonText) {
                        vscode.commands.executeCommand('sfdx.force.auth.dev.hub');
                    }
                    return undefined;
                }
                return JSON.stringify(defaultDevHubUserName).replace(/\"/g, '');
            }
            catch (err) {
                console.error(err);
                telemetry_1.telemetryService.sendException('get_default_devhub_username_alias', err.message);
                return undefined;
            }
        });
    }
    static getUsername(usernameOrAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield core_1.Aliases.fetch(usernameOrAlias)) || usernameOrAlias;
        });
    }
    static isAScratchOrg(username) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const authInfo = yield core_1.AuthInfo.create({ username });
                const authInfoFields = authInfo.getFields();
                return Promise.resolve(typeof authInfoFields.devHubUsername !== 'undefined');
            }
            catch (e) {
                throw e;
            }
        });
    }
    static getConnection(usernameOrAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            let _usernameOrAlias;
            if (usernameOrAlias) {
                _usernameOrAlias = usernameOrAlias;
            }
            else {
                const defaultName = yield OrgAuthInfo.getDefaultUsernameOrAlias(true);
                if (!defaultName) {
                    throw new Error(messages_1.nls.localize('error_no_default_username'));
                }
                _usernameOrAlias = defaultName;
            }
            const username = yield this.getUsername(_usernameOrAlias);
            return yield core_1.Connection.create({
                authInfo: yield core_1.AuthInfo.create({ username })
            });
        });
    }
}
exports.OrgAuthInfo = OrgAuthInfo;
var VSCodeWindowTypeEnum;
(function (VSCodeWindowTypeEnum) {
    VSCodeWindowTypeEnum[VSCodeWindowTypeEnum["Error"] = 1] = "Error";
    VSCodeWindowTypeEnum[VSCodeWindowTypeEnum["Informational"] = 2] = "Informational";
    VSCodeWindowTypeEnum[VSCodeWindowTypeEnum["Warning"] = 3] = "Warning";
})(VSCodeWindowTypeEnum || (VSCodeWindowTypeEnum = {}));
function displayMessage(output, enableWarning, vsCodeWindowType, items) {
    if (!util_1.isUndefined(enableWarning) && !enableWarning) {
        return;
    }
    const buttons = items || [];
    channels_1.channelService.appendLine(output);
    channels_1.channelService.showChannelOutput();
    if (vsCodeWindowType) {
        switch (vsCodeWindowType) {
            case VSCodeWindowTypeEnum.Error: {
                return notifications_1.notificationService.showErrorMessage(output, ...buttons);
            }
            case VSCodeWindowTypeEnum.Informational: {
                return notifications_1.notificationService.showInformationMessage(output, ...buttons);
            }
            case VSCodeWindowTypeEnum.Warning: {
                return notifications_1.notificationService.showWarningMessage(output, ...buttons);
            }
        }
    }
}
//# sourceMappingURL=authInfo.js.map