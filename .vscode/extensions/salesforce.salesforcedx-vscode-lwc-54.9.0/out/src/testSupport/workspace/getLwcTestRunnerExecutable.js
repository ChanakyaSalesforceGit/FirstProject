"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const which = require("which");
const messages_1 = require("../../messages");
const telemetry_1 = require("../../telemetry");
const workspaceService_1 = require("./workspaceService");
/**
 * Get the absolute path to LWC Test runner executable, installed in an SFDX project.
 * @param cwd path to the workspace folder
 * @returns path to LWC Test runner
 */
function getLwcTestRunnerExecutable(cwd) {
    const workspaceType = workspaceService_1.workspaceService.getCurrentWorkspaceType();
    if (workspaceService_1.workspaceService.isSFDXWorkspace(workspaceType)) {
        const lwcTestRunnerExecutable = path.join(cwd, 'node_modules', '.bin', 'lwc-jest');
        if (fs.existsSync(lwcTestRunnerExecutable)) {
            return lwcTestRunnerExecutable;
        }
        else {
            const errorMessage = messages_1.nls.localize('no_lwc_jest_found_text');
            console.error(errorMessage);
            vscode.window.showErrorMessage(errorMessage);
            telemetry_1.telemetryService.sendException('lwc_test_no_lwc_jest_found', errorMessage);
        }
    }
    else if (workspaceService_1.workspaceService.isCoreWorkspace(workspaceType)) {
        const lwcTestRunnerExecutable = which.sync('lwc-test', {
            nothrow: true
        });
        if (lwcTestRunnerExecutable && fs.existsSync(lwcTestRunnerExecutable)) {
            return lwcTestRunnerExecutable;
        }
        else {
            const errorMessage = messages_1.nls.localize('no_lwc_testrunner_found_text');
            console.error(errorMessage);
            vscode.window.showErrorMessage(errorMessage);
            telemetry_1.telemetryService.sendException('lwc_test_no_lwc_testrunner_found', errorMessage);
        }
    }
    else {
        // This is not expected since test support should not be activated for other workspace types
        telemetry_1.telemetryService.sendException('lwc_test_no_lwc_testrunner_found', 'Unsupported workspace');
    }
}
exports.getLwcTestRunnerExecutable = getLwcTestRunnerExecutable;
//# sourceMappingURL=getLwcTestRunnerExecutable.js.map