"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
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
const path = require("path");
const vscode_1 = require("vscode");
const messages_1 = require("../messages");
const conflictView_1 = require("./conflictView");
var directoryDiffer_1 = require("./directoryDiffer");
exports.CommonDirDirectoryDiffer = directoryDiffer_1.CommonDirDirectoryDiffer;
exports.diffFolder = directoryDiffer_1.diffFolder;
exports.diffOneFile = directoryDiffer_1.diffOneFile;
var metadataCacheService_1 = require("./metadataCacheService");
exports.MetadataCacheExecutor = metadataCacheService_1.MetadataCacheExecutor;
exports.MetadataCacheService = metadataCacheService_1.MetadataCacheService;
exports.PathType = metadataCacheService_1.PathType;
var persistentStorageService_1 = require("./persistentStorageService");
exports.PersistentStorageService = persistentStorageService_1.PersistentStorageService;
exports.conflictView = conflictView_1.ConflictView.getInstance();
function setupConflictView(extensionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        const view = exports.conflictView;
        yield view.init(extensionContext);
    });
}
exports.setupConflictView = setupConflictView;
function registerConflictView() {
    const viewItems = [];
    viewItems.push(vscode_1.commands.registerCommand('sfdx.force.conflict.diff', entry => conflictDiff(entry)));
    viewItems.push(vscode_1.commands.registerCommand('sfdx.force.conflict.open', entry => openResource(entry)));
    return vscode_1.Disposable.from(...viewItems);
}
exports.registerConflictView = registerConflictView;
function conflictDiff(file) {
    const local = vscode_1.Uri.file(path.join(file.localPath, file.localRelPath));
    const remote = vscode_1.Uri.file(path.join(file.remotePath, file.remoteRelPath));
    const title = messages_1.nls.localize('conflict_detect_diff_title', file.remoteLabel, file.fileName, file.fileName);
    vscode_1.commands.executeCommand('vscode.diff', remote, local, title);
}
function openResource(node) {
    const file = node.conflict;
    if (file) {
        const local = vscode_1.Uri.file(path.join(file.localPath, file.localRelPath));
        vscode_1.window.showTextDocument(local).then(() => { });
    }
}
//# sourceMappingURL=index.js.map