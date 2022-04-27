"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
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
const vscode = require("vscode");
const channels_1 = require("../channels");
const conflict_1 = require("../conflict");
const differ = require("../conflict/directoryDiffer");
const context_1 = require("../context");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const telemetry_1 = require("../telemetry");
const util_1 = require("./util");
const workspaceChecker = new util_1.SfdxWorkspaceChecker();
function forceSourceDiff(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sourceUri) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId !== 'forcesourcemanifest') {
                sourceUri = editor.document.uri;
            }
            else {
                const errorMessage = messages_1.nls.localize('force_source_diff_unsupported_type');
                telemetry_1.telemetryService.sendException('unsupported_type_on_diff', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
                return;
            }
        }
        const defaultUsernameorAlias = context_1.workspaceContext.username;
        if (!defaultUsernameorAlias) {
            notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('missing_default_org'));
            return;
        }
        const executor = new conflict_1.MetadataCacheExecutor(defaultUsernameorAlias, messages_1.nls.localize('force_source_diff_text'), 'force_source_diff', handleCacheResults);
        const commandlet = new util_1.SfdxCommandlet(workspaceChecker, new util_1.FilePathGatherer(sourceUri), executor);
        yield commandlet.run();
    });
}
exports.forceSourceDiff = forceSourceDiff;
function forceSourceFolderDiff(explorerPath) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!explorerPath) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId !== 'forcesourcemanifest') {
                explorerPath = editor.document.uri;
            }
            else {
                const errorMessage = messages_1.nls.localize('force_source_diff_unsupported_type');
                telemetry_1.telemetryService.sendException('unsupported_type_on_diff', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
                return;
            }
        }
        const username = context_1.workspaceContext.username;
        if (!username) {
            notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('missing_default_org'));
            return;
        }
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.FilePathGatherer(explorerPath), new conflict_1.MetadataCacheExecutor(username, 'Source Diff', 'source-diff-loader', handleCacheResults));
        yield commandlet.run();
    });
}
exports.forceSourceFolderDiff = forceSourceFolderDiff;
function handleCacheResults(username, cache) {
    return __awaiter(this, void 0, void 0, function* () {
        if (cache) {
            if (cache.selectedType === "individual" /* Individual */ && cache.cache.components) {
                yield differ.diffOneFile(cache.selectedPath, cache.cache.components[0], username);
            }
            else if (cache.selectedType === "folder" /* Folder */) {
                yield differ.diffFolder(cache, username);
            }
        }
        else {
            const message = messages_1.nls.localize('force_source_diff_components_not_in_org');
            notifications_1.notificationService.showErrorMessage(message);
            throw new Error(message);
        }
    });
}
exports.handleCacheResults = handleCacheResults;
//# sourceMappingURL=forceSourceDiff.js.map