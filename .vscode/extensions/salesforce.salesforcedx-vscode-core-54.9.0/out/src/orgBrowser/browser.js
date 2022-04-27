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
const vscode_1 = require("vscode");
const messages_1 = require("../messages");
const orgBrowser_1 = require("../orgBrowser");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
class OrgBrowser {
    constructor() { }
    static getInstance() {
        if (!this.instance) {
            this.instance = new OrgBrowser();
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
    init(extensionContext) {
        return __awaiter(this, void 0, void 0, function* () {
            const username = yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(false);
            this._dataProvider = new orgBrowser_1.MetadataOutlineProvider(username);
            this._treeView = vscode_1.window.createTreeView(OrgBrowser.VIEW_ID, {
                treeDataProvider: this._dataProvider,
                canSelectMany: true
            });
            this._treeView.onDidChangeVisibility(() => __awaiter(this, void 0, void 0, function* () {
                if (this.treeView.visible) {
                    yield this.dataProvider.onViewChange();
                }
            }));
            extensionContext.subscriptions.push(this._treeView);
        });
    }
    refreshAndExpand(node) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.dataProvider.refresh(node);
            yield this.treeView.reveal(node, { expand: true });
        });
    }
    initError() {
        const message = messages_1.nls.localize('error_org_browser_init');
        telemetry_1.telemetryService.sendException('OrgBrowserException', message);
        return new Error(message);
    }
}
exports.OrgBrowser = OrgBrowser;
OrgBrowser.VIEW_ID = 'metadata';
//# sourceMappingURL=browser.js.map