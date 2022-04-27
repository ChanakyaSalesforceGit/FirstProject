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
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require("path");
const vscode_1 = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const settings_1 = require("../settings");
const telemetry_1 = require("../telemetry");
const conflictOutlineProvider_1 = require("./conflictOutlineProvider");
class ConflictView {
    constructor() {
        this.diffsOnly = false;
    }
    static getInstance() {
        if (!this.instance) {
            this.instance = new ConflictView();
        }
        return this.instance;
    }
    get treeView() {
        if (this._treeView) {
            return this._treeView;
        }
        throw this.initError();
    }
    get dataProvider() {
        if (this._dataProvider) {
            return this._dataProvider;
        }
        throw this.initError();
    }
    visualizeDifferences(title, remoteLabel, reveal, diffResults, diffsOnly = false) {
        this.diffsOnly = diffsOnly;
        const conflicts = diffResults
            ? this.createConflictEntries(diffResults, remoteLabel)
            : [];
        const emptyLabel = diffsOnly
            ? messages_1.nls.localize('conflict_detect_no_differences')
            : messages_1.nls.localize('conflict_detect_no_conflicts');
        this.dataProvider.reset(title, conflicts, emptyLabel);
        this.updateEnablementMessage();
        if (reveal) {
            this.revealConflictNode();
        }
        this.dataProvider.onViewChange();
    }
    createConflictEntries(diffResults, remoteLabel) {
        const conflicts = [];
        diffResults.different.forEach(p => {
            conflicts.push({
                remoteLabel,
                localRelPath: p.localRelPath,
                remoteRelPath: p.remoteRelPath,
                fileName: path.basename(p.localRelPath),
                localPath: diffResults.localRoot,
                remotePath: diffResults.remoteRoot,
                localLastModifiedDate: p.localLastModifiedDate,
                remoteLastModifiedDate: p.remoteLastModifiedDate
            });
        });
        return conflicts;
    }
    init(extensionContext) {
        return __awaiter(this, void 0, void 0, function* () {
            this._dataProvider = new conflictOutlineProvider_1.ConflictOutlineProvider();
            this._treeView = vscode_1.window.createTreeView(ConflictView.VIEW_ID, {
                treeDataProvider: this._dataProvider
            });
            this._treeView.onDidChangeVisibility(() => __awaiter(this, void 0, void 0, function* () {
                if (this.treeView.visible) {
                    this.updateEnablementMessage();
                    yield this.dataProvider.onViewChange();
                }
            }));
            extensionContext.subscriptions.push(this._treeView);
        });
    }
    updateEnablementMessage() {
        this.treeView.message =
            settings_1.sfdxCoreSettings.getConflictDetectionEnabled() || this.diffsOnly
                ? undefined
                : messages_1.nls.localize('conflict_detect_not_enabled');
    }
    revealConflictNode() {
        const node = this.dataProvider.getRevealNode();
        if (node) {
            Promise.resolve(this.treeView.reveal(node, { expand: true })).catch(e => {
                const errorMessage = e.toString();
                channels_1.channelService.appendLine('Error during reveal: ' + errorMessage);
                telemetry_1.telemetryService.sendException('ConflictDetectionException', errorMessage);
            });
        }
    }
    initError() {
        const message = messages_1.nls.localize('conflict_detect_view_init');
        telemetry_1.telemetryService.sendException('ConflictDetectionException', message);
        return new Error(message);
    }
}
exports.ConflictView = ConflictView;
ConflictView.VIEW_ID = 'conflicts';
//# sourceMappingURL=conflictView.js.map