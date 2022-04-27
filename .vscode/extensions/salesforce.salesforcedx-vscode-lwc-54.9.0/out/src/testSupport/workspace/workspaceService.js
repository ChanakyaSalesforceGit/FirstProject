"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const lightning_lsp_common_1 = require("@salesforce/lightning-lsp-common");
const vscode = require("vscode");
/**
 * Provide capabilities for VS Code regarding LWC workspace types defined in lightning-lsp-common
 */
class WorkspaceService {
    constructor() {
        this.currentWorkspaceType = lightning_lsp_common_1.shared.WorkspaceType.UNKNOWN;
    }
    /**
     * Setup current workspace type
     * @param context extension context
     * @param workspaceType
     */
    register(context, workspaceType) {
        this.setCurrentWorkspaceType(workspaceType);
        const isInternalDev = this.isCoreWorkspace(workspaceType);
        vscode.commands.executeCommand('setContext', 'sfdx:internal_dev', isInternalDev);
    }
    getCurrentWorkspaceType() {
        return this.currentWorkspaceType;
    }
    setCurrentWorkspaceType(workspaceType) {
        this.currentWorkspaceType = workspaceType;
    }
    isSFDXWorkspace(workspaceType) {
        return workspaceType === lightning_lsp_common_1.shared.WorkspaceType.SFDX;
    }
    isCoreWorkspace(workspaceType) {
        return (workspaceType === lightning_lsp_common_1.shared.WorkspaceType.CORE_ALL ||
            workspaceType === lightning_lsp_common_1.shared.WorkspaceType.CORE_PARTIAL);
    }
    /**
     * @returns {String} workspace type name for telemetry
     */
    getCurrentWorkspaceTypeForTelemetry() {
        return lightning_lsp_common_1.shared.WorkspaceType[this.getCurrentWorkspaceType()];
    }
}
exports.workspaceService = new WorkspaceService();
//# sourceMappingURL=workspaceService.js.map