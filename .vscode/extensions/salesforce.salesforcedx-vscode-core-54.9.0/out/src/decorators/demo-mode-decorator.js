"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const messages_1 = require("../../src/messages");
let demoModeStatusBar;
function showDemoMode() {
    if (!demoModeStatusBar) {
        demoModeStatusBar = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Right, 50);
        demoModeStatusBar.text = messages_1.nls.localize('demo_mode_status_text');
        demoModeStatusBar.tooltip = messages_1.nls.localize('demo_mode_status_tooltip');
        demoModeStatusBar.show();
    }
}
exports.showDemoMode = showDemoMode;
//# sourceMappingURL=demo-mode-decorator.js.map