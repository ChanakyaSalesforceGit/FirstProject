"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const jest_editor_support_1 = require("jest-editor-support");
const jest_regex_util_1 = require("jest-regex-util");
const strip_ansi_1 = require("strip-ansi");
const vscode = require("vscode");
function populateAncestorTitlesRecursive(node, ancestorTitles, itBlocksWithAncestorTitles) {
    node.ancestorTitles = ancestorTitles;
    if (node.type === jest_editor_support_1.ParsedNodeTypes.it) {
        itBlocksWithAncestorTitles.push(node);
    }
    if (node.type === jest_editor_support_1.ParsedNodeTypes.root ||
        node.type === jest_editor_support_1.ParsedNodeTypes.describe) {
        if (!node.children) {
            return;
        }
        node.children.forEach(childNode => {
            populateAncestorTitlesRecursive(childNode, node.name ? [...ancestorTitles, node.name] : ancestorTitles, itBlocksWithAncestorTitles);
        });
    }
}
/**
 * Populate ancestor titles for itBlocks
 * @param parsedResult original parse results
 */
function populateAncestorTitles(parsedResult) {
    try {
        const itBlocksWithAncestorTitles = [];
        populateAncestorTitlesRecursive(parsedResult.root, [], itBlocksWithAncestorTitles);
        parsedResult.itBlocksWithAncestorTitles = itBlocksWithAncestorTitles;
        return parsedResult;
    }
    catch (error) {
        console.error(error);
    }
}
exports.populateAncestorTitles = populateAncestorTitles;
/**
 * Extract the VS Code position from failure message stacktrace in Jest output.
 * @param testFsPath test file path
 * @param failureMessage failure message from Jest output
 */
function extractPositionFromFailureMessage(testFsPath, failureMessage) {
    try {
        const locationMatcher = new RegExp(jest_regex_util_1.escapeStrForRegex(testFsPath) + '\\:(\\d+)\\:(\\d+)', 'i');
        const matchResult = failureMessage.match(locationMatcher);
        if (matchResult) {
            const lineString = matchResult[1];
            const columnString = matchResult[2];
            const line = parseInt(lineString, 10);
            const column = parseInt(columnString, 10);
            if (isNaN(line) || isNaN(column)) {
                return undefined;
            }
            return new vscode.Position(line - 1, column - 1);
        }
        return undefined;
    }
    catch (error) {
        return undefined;
    }
}
exports.extractPositionFromFailureMessage = extractPositionFromFailureMessage;
/**
 * Strip the ANSI color codes from failure message
 * @param failureMessage failure message from Jest output
 */
function sanitizeFailureMessage(failureMessage) {
    return strip_ansi_1.default(failureMessage);
}
exports.sanitizeFailureMessage = sanitizeFailureMessage;
//# sourceMappingURL=jestUtils.js.map