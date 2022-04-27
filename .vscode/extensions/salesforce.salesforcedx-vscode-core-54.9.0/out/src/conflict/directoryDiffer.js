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
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const channels_1 = require("../channels");
const conflict_1 = require("../conflict");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const telemetry_1 = require("../telemetry");
class CommonDirDirectoryDiffer {
    constructor() { }
    diff(localSourcePath, remoteSourcePath) {
        const localSet = this.listFiles(localSourcePath);
        const different = new Set();
        // process remote files to generate differences
        let scannedRemote = 0;
        this.walkFiles(remoteSourcePath, '', stats => {
            scannedRemote++;
            if (localSet.has(stats.relPath)) {
                const file1 = path.join(localSourcePath, stats.relPath);
                const file2 = path.join(remoteSourcePath, stats.relPath);
                if (this.filesDiffer(file1, file2)) {
                    different.add({
                        localRelPath: stats.relPath,
                        remoteRelPath: stats.relPath
                    });
                }
            }
        });
        return {
            localRoot: localSourcePath,
            remoteRoot: remoteSourcePath,
            different,
            scannedLocal: localSet.size,
            scannedRemote
        };
    }
    filesDiffer(one, two) {
        const buffer1 = fs.readFileSync(one);
        const buffer2 = fs.readFileSync(two);
        return !buffer1.equals(buffer2);
    }
    listFiles(root) {
        const results = new Set();
        this.walkFiles(root, '', stats => {
            results.add(stats.relPath);
        });
        return results;
    }
    walkFiles(root, subdir, callback) {
        const fullDir = path.join(root, subdir);
        const subdirList = fs.readdirSync(fullDir);
        subdirList.forEach(filename => {
            const fullPath = path.join(fullDir, filename);
            const stat = fs.statSync(fullPath);
            const relPath = path.join(subdir, filename);
            if (stat && stat.isDirectory()) {
                this.walkFiles(root, relPath, callback);
            }
            else {
                callback({ filename, subdir, relPath });
            }
        });
    }
}
exports.CommonDirDirectoryDiffer = CommonDirDirectoryDiffer;
function diffFolder(cache, username) {
    return __awaiter(this, void 0, void 0, function* () {
        const localPath = path.join(cache.project.baseDirectory, cache.project.commonRoot);
        const remotePath = path.join(cache.cache.baseDirectory, cache.cache.commonRoot);
        const differ = new CommonDirDirectoryDiffer();
        const diffs = differ.diff(localPath, remotePath);
        conflict_1.conflictView.visualizeDifferences(messages_1.nls.localize('force_source_diff_folder_title', username), username, true, diffs, true);
    });
}
exports.diffFolder = diffFolder;
/**
 * Perform file diff and execute VS Code diff comand to show in UI.
 * It matches the correspondent file in compoennt.
 * @param localFile local file
 * @param remoteComponent remote source component
 * @param defaultUsernameorAlias username/org info to show in diff
 * @returns {Promise<void>}
 */
function diffOneFile(localFile, remoteComponent, defaultUsernameorAlias) {
    return __awaiter(this, void 0, void 0, function* () {
        const filePart = path.basename(localFile);
        const remoteFilePaths = remoteComponent.walkContent();
        if (remoteComponent.xml) {
            remoteFilePaths.push(remoteComponent.xml);
        }
        for (const filePath of remoteFilePaths) {
            if (filePath.endsWith(filePart)) {
                const remoteUri = vscode.Uri.file(filePath);
                const localUri = vscode.Uri.file(localFile);
                try {
                    yield vscode.commands.executeCommand('vscode.diff', remoteUri, localUri, messages_1.nls.localize('force_source_diff_title', defaultUsernameorAlias, filePart, filePart));
                }
                catch (err) {
                    notifications_1.notificationService.showErrorMessage(err.message);
                    channels_1.channelService.appendLine(err.message);
                    channels_1.channelService.showChannelOutput();
                    telemetry_1.telemetryService.sendException(err.name, err.message);
                }
                return;
            }
        }
    });
}
exports.diffOneFile = diffOneFile;
//# sourceMappingURL=directoryDiffer.js.map