"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const messages_1 = require("../../../messages");
const notifications_1 = require("../../../notifications");
const telemetry_1 = require("../../../telemetry");
exports.WARNING_MSG_KEY = 'force_function_start_warning_not_in_function_folder';
exports.NO_FUNCTION_FOLDER_KEY = 'force_function_start_not_in_function_folder';
exports.validateStartFunctionsUri = (sourceUri) => {
    var _a;
    if (!sourceUri) {
        // Try to start function from current active editor, if running SFDX: start function from command palette
        sourceUri = (_a = vscode_1.window.activeTextEditor) === null || _a === void 0 ? void 0 : _a.document.uri;
    }
    if (!sourceUri) {
        const warningMessage = messages_1.nls.localize(exports.WARNING_MSG_KEY);
        notifications_1.notificationService.showWarningMessage(warningMessage);
        telemetry_1.telemetryService.sendException(exports.NO_FUNCTION_FOLDER_KEY, warningMessage);
        return;
    }
    return sourceUri;
};
//# sourceMappingURL=validateStartFunctionsUri.js.map