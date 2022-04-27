"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode_1 = require("vscode");
/**
 * Returns workspace specific jest args from CLI arguments and test run type
 * @param jestArgs jest args
 * @param testRunType test run type
 */
function getCliArgsFromJestArgs(jestArgs, testRunType) {
    const cliArgs = ['--', ...jestArgs];
    const usePreviewJavaScriptDebugger = vscode_1.workspace
        .getConfiguration('debug')
        .get('javascript.usePreview');
    // W-9883286
    // Since VS Code 1.60, `debug.javascript.usePreview` setting is no longer available
    if (testRunType === "debug" /* DEBUG */ &&
        usePreviewJavaScriptDebugger === false) {
        cliArgs.unshift('--debug');
    }
    return cliArgs;
}
exports.getCliArgsFromJestArgs = getCliArgsFromJestArgs;
//# sourceMappingURL=getCliArgsFromJestArgs.js.map