"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
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
const shelljs_1 = require("shelljs");
const vscode_1 = require("vscode");
const _1 = require(".");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
function isCLIInstalled() {
    let isInstalled = false;
    try {
        if (shelljs_1.which('sfdx')) {
            isInstalled = true;
        }
    }
    catch (e) {
        console.error('An error happened while looking for sfdx cli', e);
    }
    return isInstalled;
}
exports.isCLIInstalled = isCLIInstalled;
function showCLINotInstalledMessage() {
    const showMessage = messages_1.nls.localize('sfdx_cli_not_found', constants_1.SFDX_CLI_DOWNLOAD_LINK, constants_1.SFDX_CLI_DOWNLOAD_LINK);
    vscode_1.window.showWarningMessage(showMessage);
}
exports.showCLINotInstalledMessage = showCLINotInstalledMessage;
function isSFDXContainerMode() {
    return process.env.SFDX_CONTAINER_MODE ? true : false;
}
exports.isSFDXContainerMode = isSFDXContainerMode;
function disableCLITelemetry() {
    cli_1.GlobalCliEnvironment.environmentVariables.set(constants_1.ENV_SFDX_DISABLE_TELEMETRY, 'true');
}
exports.disableCLITelemetry = disableCLITelemetry;
function isCLITelemetryAllowed() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const disabledConfig = (yield _1.ConfigUtil.getConfigValue(constants_1.SFDX_CONFIG_DISABLE_TELEMETRY)) || '';
            return disabledConfig !== 'true';
        }
        catch (e) {
            console.log('Error checking cli settings: ' + e);
        }
        return true;
    });
}
exports.isCLITelemetryAllowed = isCLITelemetryAllowed;
//# sourceMappingURL=cliConfiguration.js.map