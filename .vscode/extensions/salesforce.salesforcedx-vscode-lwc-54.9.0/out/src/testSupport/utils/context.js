"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const testWatcher_1 = require("../testRunner/testWatcher");
const constants_1 = require("../types/constants");
const isLwcJestTest_1 = require("./isLwcJestTest");
/**
 * Set context for currently focused file initially or on active text editor change
 * @param textEditor text editor
 */
function setLwcJestFileFocusedContext(textEditor) {
    if (textEditor) {
        vscode.commands.executeCommand('setContext', constants_1.SFDX_LWC_JEST_FILE_FOCUSED_CONTEXT, !!isLwcJestTest_1.isLwcJestTest(textEditor.document));
        testWatcher_1.testWatcher.setWatchingContext(textEditor.document.uri);
    }
    else {
        vscode.commands.executeCommand('setContext', constants_1.SFDX_LWC_JEST_FILE_FOCUSED_CONTEXT, false);
    }
}
/**
 * Sets up handlers for active text editor change
 * and make sure the correct context is set.
 * @param context extension context
 */
function startWatchingEditorFocusChange(context) {
    setLwcJestFileFocusedContext(vscode.window.activeTextEditor);
    const handleDidChangeActiveTextEditor = vscode.window.onDidChangeActiveTextEditor(textEditor => {
        setLwcJestFileFocusedContext(textEditor);
    });
    context.subscriptions.push(handleDidChangeActiveTextEditor);
}
exports.startWatchingEditorFocusChange = startWatchingEditorFocusChange;
//# sourceMappingURL=context.js.map