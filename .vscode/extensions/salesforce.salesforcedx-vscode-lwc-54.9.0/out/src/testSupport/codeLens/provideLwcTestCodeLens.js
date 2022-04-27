"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const jest_editor_support_1 = require("jest-editor-support");
const vscode_1 = require("vscode");
const messages_1 = require("../../messages");
/**
 * Provide "Run Test" and "Debug Test" Code Lens for LWC tests.
 * We can move this implementation to lightning language server in the future.
 *
 * @param document text document
 * @param token cancellation token
 */
function provideLwcTestCodeLens(document, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const fsPath = document.uri.fsPath;
        const parseResults = jest_editor_support_1.parse(fsPath, document.getText());
        const { itBlocks } = parseResults;
        return itBlocks
            .map(itBlock => {
            const { name, nameRange, start, end } = itBlock;
            // VS Code position is zero-based
            const range = new vscode_1.Range(new vscode_1.Position(nameRange.start.line - 1, nameRange.start.column - 1), new vscode_1.Position(nameRange.end.line - 1, nameRange.end.column - 1));
            const testExecutionInfo = {
                kind: "testCase" /* TEST_CASE */,
                testType: "lwc" /* LWC */,
                testUri: document.uri,
                testName: name
            };
            const runTestTitle = messages_1.nls.localize('run_test_title');
            const runTestCaseCommand = {
                command: 'sfdx.force.lightning.lwc.test.case.run',
                title: runTestTitle,
                tooltip: runTestTitle,
                arguments: [{ testExecutionInfo }]
            };
            const runTestCaseCodeLens = new vscode_1.CodeLens(range, runTestCaseCommand);
            const debugTestTitle = messages_1.nls.localize('debug_test_title');
            const debugTestCaseCommand = {
                command: 'sfdx.force.lightning.lwc.test.case.debug',
                title: debugTestTitle,
                tooltip: debugTestTitle,
                arguments: [{ testExecutionInfo }]
            };
            const debugTestCaseCodeLens = new vscode_1.CodeLens(range, debugTestCaseCommand);
            return [runTestCaseCodeLens, debugTestCaseCodeLens];
        })
            .reduce((xs, x) => xs.concat(x), []);
    });
}
exports.provideLwcTestCodeLens = provideLwcTestCodeLens;
//# sourceMappingURL=provideLwcTestCodeLens.js.map