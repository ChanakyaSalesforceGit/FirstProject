"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const os = require("os");
const path = require("path");
const vscode_1 = require("vscode");
const messages_1 = require("../messages");
const util_1 = require("../util");
const CONFIG_FILE = util_1.hasRootWorkspace()
    ? path.join(util_1.getRootWorkspacePath(), '.sfdx', 'sfdx-config.json')
    : path.join(os.homedir(), '.sfdx', 'sfdx-config.json');
let statusBarItem;
function showOrg() {
    if (!statusBarItem) {
        statusBarItem = vscode_1.window.createStatusBarItem(vscode_1.StatusBarAlignment.Left, 50);
        statusBarItem.tooltip = messages_1.nls.localize('status_bar_open_org_tooltip');
        statusBarItem.command = 'sfdx.force.org.open';
        statusBarItem.show();
    }
    displayDefaultUserName(CONFIG_FILE);
}
exports.showOrg = showOrg;
function monitorOrgConfigChanges() {
    const watcher = vscode_1.workspace.createFileSystemWatcher(CONFIG_FILE);
    watcher.onDidChange(uri => {
        displayDefaultUserName(uri.fsPath);
    });
    watcher.onDidCreate(uri => {
        displayDefaultUserName(uri.fsPath);
    });
}
exports.monitorOrgConfigChanges = monitorOrgConfigChanges;
function displayDefaultUserName(configPath) {
    fs.readFile(configPath, (err, data) => {
        if (!err) {
            const config = JSON.parse(data.toString());
            if (config['defaultusername']) {
                statusBarItem.text = `$(browser)`;
            }
        }
    });
}
//# sourceMappingURL=scratch-org-decorator.js.map