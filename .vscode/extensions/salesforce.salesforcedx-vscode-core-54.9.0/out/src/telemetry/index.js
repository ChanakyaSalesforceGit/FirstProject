"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const vscode_1 = require("vscode");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
exports.telemetryService = src_1.TelemetryService.getInstance();
function showTelemetryMessage(context) {
    const messageAlreadyPrompted = context.globalState.get(constants_1.TELEMETRY_GLOBAL_VALUE);
    if (!messageAlreadyPrompted) {
        // Show the message and set telemetry to true;
        const showButtonText = messages_1.nls.localize('telemetry_legal_dialog_button_text');
        const showMessage = messages_1.nls.localize('telemetry_legal_dialog_message', constants_1.TELEMETRY_OPT_OUT_LINK);
        vscode_1.window
            .showInformationMessage(showMessage, showButtonText)
            .then(selection => {
            // Open disable telemetry link
            if (selection && selection === showButtonText) {
                vscode_1.commands.executeCommand('vscode.open', vscode_1.Uri.parse(constants_1.TELEMETRY_OPT_OUT_LINK));
            }
        });
        context.globalState.update(constants_1.TELEMETRY_GLOBAL_VALUE, true);
    }
}
exports.showTelemetryMessage = showTelemetryMessage;
//# sourceMappingURL=index.js.map