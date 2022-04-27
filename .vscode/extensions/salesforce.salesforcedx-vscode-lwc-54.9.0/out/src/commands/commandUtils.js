"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const commands_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/commands");
const vscode_1 = require("vscode");
const channel_1 = require("../channel");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
function showError(e, logName, commandName) {
    telemetry_1.telemetryService.sendException(`${logName}_error`, e.message);
    commands_1.notificationService.showErrorMessage(e.message);
    commands_1.notificationService.showErrorMessage(messages_1.nls.localize('command_failure', commandName));
    channel_1.channelService.appendLine(`Error: ${e.message}`);
    channel_1.channelService.showChannelOutput();
}
exports.showError = showError;
function openBrowser(url) {
    return vscode_1.env.openExternal(vscode_1.Uri.parse(url));
}
exports.openBrowser = openBrowser;
//# sourceMappingURL=commandUtils.js.map