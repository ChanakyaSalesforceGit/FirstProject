"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require("path");
const extensionPath = path.join(__filename, '..', '..', '..', '..', '..');
const LIGHT_BLUE_BUTTON = path.join(extensionPath, 'resources', 'light', 'testNotRun.svg');
const LIGHT_RED_BUTTON = path.join(extensionPath, 'resources', 'light', 'testFail.svg');
const LIGHT_GREEN_BUTTON = path.join(extensionPath, 'resources', 'light', 'testPass.svg');
const LIGHT_ORANGE_BUTTON = path.join(extensionPath, 'resources', 'light', 'testSkip.svg');
const DARK_BLUE_BUTTON = path.join(extensionPath, 'resources', 'dark', 'testNotRun.svg');
const DARK_RED_BUTTON = path.join(extensionPath, 'resources', 'dark', 'testFail.svg');
const DARK_GREEN_BUTTON = path.join(extensionPath, 'resources', 'dark', 'testPass.svg');
const DARK_ORANGE_BUTTON = path.join(extensionPath, 'resources', 'dark', 'testSkip.svg');
/**
 * Get icon path in the test explorer for test result
 * @param testResult test result
 */
function getIconPath(testResult) {
    if (testResult) {
        if (testResult.status === 0 /* PASSED */) {
            return {
                light: LIGHT_GREEN_BUTTON,
                dark: DARK_GREEN_BUTTON
            };
        }
        else if (testResult.status === 1 /* FAILED */) {
            return {
                light: LIGHT_RED_BUTTON,
                dark: DARK_RED_BUTTON
            };
        }
        else if (testResult.status === 2 /* SKIPPED */) {
            return {
                light: LIGHT_ORANGE_BUTTON,
                dark: DARK_ORANGE_BUTTON
            };
        }
        else {
            return {
                light: LIGHT_BLUE_BUTTON,
                dark: DARK_BLUE_BUTTON
            };
        }
    }
    else {
        return {
            light: LIGHT_BLUE_BUTTON,
            dark: DARK_BLUE_BUTTON
        };
    }
}
exports.getIconPath = getIconPath;
//# sourceMappingURL=iconPaths.js.map