"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const date_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/date");
const vscode_1 = require("vscode");
const constants_1 = require("./../constants");
const messages_1 = require("./../messages");
let statusBarItem;
function showTraceFlagExpiration(expirationDate) {
    if (!statusBarItem) {
        statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 40);
    }
    statusBarItem.text = messages_1.nls.localize('force_apex_debug_log_status_bar_text', expirationDate.toLocaleTimeString(undefined, date_1.optionHHmm));
    statusBarItem.tooltip = messages_1.nls.localize('force_apex_debug_log_status_bar_hover_text', constants_1.APEX_CODE_DEBUG_LEVEL, expirationDate.toLocaleTimeString(undefined, date_1.optionHHmm), expirationDate.toLocaleDateString(undefined, date_1.optionMMddYYYY));
    statusBarItem.show();
}
exports.showTraceFlagExpiration = showTraceFlagExpiration;
function hideTraceFlagExpiration() {
    statusBarItem.hide();
}
exports.hideTraceFlagExpiration = hideTraceFlagExpiration;
function disposeTraceFlagExpiration() {
    statusBarItem.dispose();
}
exports.disposeTraceFlagExpiration = disposeTraceFlagExpiration;
//# sourceMappingURL=traceflag-time-decorator.js.map