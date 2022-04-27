"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const constants_1 = require("../types/constants");
/**
 * Determine if the text document is an LWC Jest test
 * @param textDocument vscode text document
 */
function isLwcJestTest(textDocument) {
    return vscode.languages.match(constants_1.LWC_TEST_DOCUMENT_SELECTOR, textDocument);
}
exports.isLwcJestTest = isLwcJestTest;
//# sourceMappingURL=isLwcJestTest.js.map