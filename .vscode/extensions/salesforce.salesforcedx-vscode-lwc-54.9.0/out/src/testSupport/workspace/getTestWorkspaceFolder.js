"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const messages_1 = require("../../messages");
const telemetry_1 = require("../../telemetry");
/**
 * If testUri is specified, returns the workspace folder containing the test if it exists.
 * Otherwise, return the first workspace folder if it exists.
 * @param testUri optional testUri
 */
function getTestWorkspaceFolder(testUri) {
    let workspaceFolder;
    if (testUri) {
        workspaceFolder = vscode.workspace.getWorkspaceFolder(testUri);
    }
    else {
        workspaceFolder = vscode.workspace.workspaceFolders[0];
    }
    if (workspaceFolder) {
        return workspaceFolder;
    }
    else {
        const errorMessage = messages_1.nls.localize('no_workspace_folder_found_for_test_text');
        console.error(errorMessage);
        vscode.window.showErrorMessage(errorMessage);
        telemetry_1.telemetryService.sendException('lwc_test_no_workspace_folder_found_for_test', errorMessage);
    }
}
exports.getTestWorkspaceFolder = getTestWorkspaceFolder;
//# sourceMappingURL=getTestWorkspaceFolder.js.map