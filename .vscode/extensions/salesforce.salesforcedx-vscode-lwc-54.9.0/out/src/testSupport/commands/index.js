"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode_1 = require("vscode");
const vscode = require("vscode");
const forceLwcTestDebugAction_1 = require("./forceLwcTestDebugAction");
const forceLwcTestNavigateToTest_1 = require("./forceLwcTestNavigateToTest");
const forceLwcTestRefreshTestExplorer_1 = require("./forceLwcTestRefreshTestExplorer");
const forceLwcTestRunAction_1 = require("./forceLwcTestRunAction");
const forceLwcTestWatchAction_1 = require("./forceLwcTestWatchAction");
/**
 * Register all commands with the extension context
 * @param extensionContext extension context
 */
function registerCommands(extensionContext) {
    const forceLwcTestRunAllTestsCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.runAllTests', forceLwcTestRunAction_1.forceLwcTestRunAllTests);
    const forceLwcTestRefreshTestExplorerCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.refreshTestExplorer', forceLwcTestRefreshTestExplorer_1.forceLwcTestRefreshTestExplorer);
    const forceLwcTestNavigateToTestCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.navigateToTest', forceLwcTestNavigateToTest_1.forceLwcTestNavigateToTest);
    const forceLwcTestFileRunCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.file.run', forceLwcTestRunAction_1.forceLwcTestFileRun);
    const forceLwcTestFileDebugCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.file.debug', forceLwcTestDebugAction_1.forceLwcTestFileDebug);
    const forceLwcTestCaseRunCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.case.run', forceLwcTestRunAction_1.forceLwcTestCaseRun);
    const forceLwcTestCaseDebugCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.case.debug', forceLwcTestDebugAction_1.forceLwcTestCaseDebug);
    const forceLwcTestEditorTitleRunCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.editorTitle.run', forceLwcTestRunAction_1.forceLwcTestRunActiveTextEditorTest);
    const forceLwcTestEditorTitleDebugCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.editorTitle.debug', forceLwcTestDebugAction_1.forceLwcTestDebugActiveTextEditorTest);
    const forceLwcTestEditorTitleStartWatchingCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.editorTitle.startWatching', forceLwcTestWatchAction_1.forceLwcTestStartWatchingCurrentFile);
    const forceLwcTestEditorTitleStopWatchingCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.editorTitle.stopWatching', forceLwcTestWatchAction_1.forceLwcTestStopWatchingCurrentFile);
    const forceLwcTestStopWatchingAllTestsCmd = vscode_1.commands.registerCommand('sfdx.force.lightning.lwc.test.stopWatchingAllTests', forceLwcTestWatchAction_1.forceLwcTestStopWatchingAllTests);
    const startDebugSessionDisposable = vscode.debug.onDidStartDebugSession(forceLwcTestDebugAction_1.handleDidStartDebugSession);
    const stopDebugSessionDisposable = vscode.debug.onDidTerminateDebugSession(forceLwcTestDebugAction_1.handleDidTerminateDebugSession);
    const disposables = vscode_1.Disposable.from(forceLwcTestRunAllTestsCmd, forceLwcTestRefreshTestExplorerCmd, forceLwcTestNavigateToTestCmd, forceLwcTestFileRunCmd, forceLwcTestFileDebugCmd, forceLwcTestCaseRunCmd, forceLwcTestCaseDebugCmd, forceLwcTestEditorTitleRunCmd, forceLwcTestEditorTitleDebugCmd, forceLwcTestEditorTitleStartWatchingCmd, forceLwcTestEditorTitleStopWatchingCmd, forceLwcTestStopWatchingAllTestsCmd, startDebugSessionDisposable, stopDebugSessionDisposable);
    extensionContext.subscriptions.push(disposables);
    return disposables;
}
exports.registerCommands = registerCommands;
//# sourceMappingURL=index.js.map