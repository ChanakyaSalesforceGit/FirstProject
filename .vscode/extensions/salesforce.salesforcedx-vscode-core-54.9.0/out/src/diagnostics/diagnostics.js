"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const path = require("path");
const vscode = require("vscode");
function getRange(lineNumber, columnNumber) {
    const ln = Number(lineNumber);
    const col = Number(columnNumber);
    const pos = new vscode.Position(ln > 0 ? ln - 1 : 0, col > 0 ? col - 1 : 0);
    return new vscode.Range(pos, pos);
}
exports.getRange = getRange;
function handleDiagnosticErrors(errors, workspacePath, sourcePathOrPaths, errorCollection) {
    errorCollection.clear();
    // In the case that we have deployed multiple source paths,
    // the default error path for errors without an associated
    // file path should be the workspace path
    const defaultErrorPath = sourcePathOrPaths.includes(',')
        ? workspacePath
        : sourcePathOrPaths;
    const diagnosticMap = new Map();
    if (errors.hasOwnProperty('result')) {
        errors.result.forEach(error => {
            // source:deploy sometimes returns N/A as filePath
            const fileUri = error.filePath === 'N/A'
                ? defaultErrorPath
                : path.join(workspacePath, error.filePath);
            const range = getRange(error.lineNumber || '1', error.columnNumber || '1');
            const diagnostic = {
                message: error.error,
                severity: vscode.DiagnosticSeverity.Error,
                source: error.type,
                range
            };
            if (!diagnosticMap.has(fileUri)) {
                diagnosticMap.set(fileUri, []);
            }
            diagnosticMap.get(fileUri).push(diagnostic);
        });
        diagnosticMap.forEach((diagMap, file) => {
            const fileUri = vscode.Uri.file(file);
            errorCollection.set(fileUri, diagMap);
        });
    }
    else if (errors.hasOwnProperty('message')) {
        const fileUri = vscode.Uri.file(defaultErrorPath);
        const range = getRange('1', '1');
        const diagnostic = {
            message: errors.message,
            severity: vscode.DiagnosticSeverity.Error,
            source: errors.name,
            range
        };
        errorCollection.set(fileUri, [diagnostic]);
    }
    return errorCollection;
}
exports.handleDiagnosticErrors = handleDiagnosticErrors;
function handleDeployDiagnostics(deployResult, errorCollection) {
    var _a;
    errorCollection.clear();
    const diagnosticMap = new Map();
    for (const fileResponse of deployResult.getFileResponses()) {
        if (fileResponse.state !== source_deploy_retrieve_1.ComponentStatus.Failed) {
            continue;
        }
        const { lineNumber, columnNumber, error, problemType, type } = fileResponse;
        const range = getRange(lineNumber ? lineNumber.toString() : '1', columnNumber ? columnNumber.toString() : '1');
        const severity = problemType === 'Error'
            ? vscode.DiagnosticSeverity.Error
            : vscode.DiagnosticSeverity.Warning;
        const vscDiagnostic = {
            message: error,
            range,
            severity,
            source: type
        };
        const filePath = (_a = fileResponse.filePath) !== null && _a !== void 0 ? _a : src_1.getRootWorkspacePath();
        if (!diagnosticMap.has(filePath)) {
            diagnosticMap.set(filePath, []);
        }
        diagnosticMap.get(filePath).push(vscDiagnostic);
    }
    diagnosticMap.forEach((diagnostics, file) => errorCollection.set(vscode.Uri.file(file), diagnostics));
    return errorCollection;
}
exports.handleDeployDiagnostics = handleDeployDiagnostics;
//# sourceMappingURL=diagnostics.js.map