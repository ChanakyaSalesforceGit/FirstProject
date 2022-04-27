"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
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
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const fs = require("fs");
const path_1 = require("path");
const util_1 = require("util");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const util_2 = require("../util");
const util_3 = require("./util");
const CREATE_MANIFEST_EXECUTOR = 'force_create_manifest';
const DEFAULT_MANIFEST = 'package.xml';
const MANIFEST_SAVE_PLACEHOLDER = 'manifest_input_save_placeholder';
const MANIFEST_SAVE_PROMPT = 'manifest_input_save_prompt';
class ManifestCreateExecutor extends src_1.LibraryCommandletExecutor {
    constructor(sourcePaths, responseText) {
        super(messages_1.nls.localize(CREATE_MANIFEST_EXECUTOR), CREATE_MANIFEST_EXECUTOR, channels_1.OUTPUT_CHANNEL);
        this.sourcePaths = sourcePaths;
        this.responseText = responseText;
    }
    run(response, progress, token) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.sourcePaths) {
                const componentSet = source_deploy_retrieve_1.ComponentSet.fromSource(this.sourcePaths);
                if (this.responseText === undefined) {
                    // Canceled and declined to name the document
                    openUntitledDocument(componentSet);
                }
                else {
                    saveDocument(this.responseText, componentSet);
                }
                return true;
            }
            return false;
        });
    }
}
exports.ManifestCreateExecutor = ManifestCreateExecutor;
function forceCreateManifest(sourceUri, uris) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!uris || uris.length < 1) {
            uris = [];
            uris.push(sourceUri);
        }
        const sourcePaths = uris.map(uri => uri.fsPath);
        const inputOptions = {
            placeHolder: messages_1.nls.localize(MANIFEST_SAVE_PLACEHOLDER),
            prompt: messages_1.nls.localize(MANIFEST_SAVE_PROMPT)
        };
        const responseText = yield vscode.window.showInputBox(inputOptions);
        if (sourcePaths) {
            const commandlet = new util_3.SfdxCommandlet(new util_3.SfdxWorkspaceChecker(), new util_3.FilePathGatherer(sourceUri), new ManifestCreateExecutor(sourcePaths, responseText));
            yield commandlet.run();
        }
    });
}
exports.forceCreateManifest = forceCreateManifest;
function openUntitledDocument(componentSet) {
    vscode.workspace.openTextDocument({
        content: componentSet.getPackageXml(),
        language: 'xml'
    }).then(newManifest => {
        vscode.window.showTextDocument(newManifest);
    });
}
function saveDocument(response, componentSet) {
    const fileName = response ? appendExtension(response) : DEFAULT_MANIFEST;
    const manifestPath = path_1.join(util_2.getRootWorkspacePath(), 'manifest');
    if (!fs.existsSync(manifestPath)) {
        fs.mkdirSync(manifestPath);
    }
    const saveLocation = path_1.join(manifestPath, fileName);
    checkForDuplicateManifest(saveLocation, fileName);
    fs.writeFileSync(saveLocation, componentSet.getPackageXml());
    vscode.workspace.openTextDocument(saveLocation).then(newManifest => {
        vscode.window.showTextDocument(newManifest);
    });
}
function checkForDuplicateManifest(saveLocation, fileName) {
    if (fs.existsSync(saveLocation)) {
        vscode.window.showErrorMessage(util_1.format(messages_1.nls.localize('manifest_input_dupe_error'), fileName));
        throw new Error(util_1.format(messages_1.nls.localize('manifest_input_dupe_error'), fileName));
    }
}
function appendExtension(input) {
    var _a;
    return (_a = path_1.parse(input).name) === null || _a === void 0 ? void 0 : _a.concat('.xml');
}
//# sourceMappingURL=forceCreateManifest.js.map