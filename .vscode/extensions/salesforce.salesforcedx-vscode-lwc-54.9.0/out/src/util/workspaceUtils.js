"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
class WorkspaceUtils {
    static get instance() {
        if (WorkspaceUtils._instance === undefined) {
            WorkspaceUtils._instance = new WorkspaceUtils();
        }
        return WorkspaceUtils._instance;
    }
    init(extensionContext) {
        this.context = extensionContext;
    }
    getGlobalStore() {
        return this.context && this.context.globalState;
    }
    getWorkspaceSettings() {
        return vscode_1.workspace.getConfiguration('salesforcedx-vscode-lwc');
    }
}
exports.WorkspaceUtils = WorkspaceUtils;
//# sourceMappingURL=workspaceUtils.js.map