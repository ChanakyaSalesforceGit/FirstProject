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
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const vscode = require("vscode");
const messages_1 = require("../messages");
const util_1 = require("../util");
const index_1 = require("./index");
class MetadataOutlineProvider {
    constructor(defaultOrg) {
        this.toRefresh = false;
        this.internalOnDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.internalOnDidChangeTreeData.event;
        this.defaultOrg = defaultOrg;
    }
    onViewChange() {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameOrAlias = yield this.getDefaultUsernameOrAlias();
            if (usernameOrAlias !== this.defaultOrg) {
                this.internalOnDidChangeTreeData.fire(undefined);
            }
            this.defaultOrg = usernameOrAlias;
        });
    }
    refresh(node) {
        return __awaiter(this, void 0, void 0, function* () {
            if (node && !node.toRefresh) {
                node.toRefresh = true;
            }
            else if (!this.toRefresh) {
                const usernameOrAlias = yield this.getDefaultUsernameOrAlias();
                this.defaultOrg = usernameOrAlias;
                this.toRefresh = true;
            }
            this.internalOnDidChangeTreeData.fire(node);
        });
    }
    getTreeItem(element) {
        return element;
    }
    getParent(element) {
        return element.parent;
    }
    getChildren(element) {
        return __awaiter(this, void 0, void 0, function* () {
            if (helpers_1.isNullOrUndefined(this.defaultOrg)) {
                const emptyDefault = new index_1.BrowserNode(messages_1.nls.localize('missing_default_org'), index_1.NodeType.EmptyNode);
                return Promise.resolve([emptyDefault]);
            }
            if (helpers_1.isNullOrUndefined(element)) {
                const org = new index_1.BrowserNode(this.defaultOrg, index_1.NodeType.Org);
                return Promise.resolve([org]);
            }
            switch (element.type) {
                case index_1.NodeType.Org:
                    const types = yield this.getTypes();
                    element.setTypes(types, index_1.NodeType.MetadataType);
                    this.toRefresh = false;
                    break;
                case index_1.NodeType.Folder:
                case index_1.NodeType.MetadataType:
                    let nodeType = index_1.NodeType.MetadataComponent;
                    if (index_1.TypeUtils.FOLDER_TYPES.has(element.fullName)) {
                        nodeType = index_1.NodeType.Folder;
                    }
                    else if (element.parent && element.parent.fullName === index_1.CUSTOMOBJECTS_FULLNAME) {
                        nodeType = index_1.NodeType.MetadataField;
                    }
                    const components = yield this.getComponents(element);
                    element.setComponents(components, nodeType);
                    element.toRefresh = false;
                    break;
            }
            return Promise.resolve(element.children);
        });
    }
    getTypes() {
        return __awaiter(this, void 0, void 0, function* () {
            const username = this.defaultOrg;
            const typeUtil = new index_1.TypeUtils();
            try {
                return yield typeUtil.loadTypes(username, this.toRefresh);
            }
            catch (e) {
                throw parseErrors(e);
            }
        });
    }
    getComponents(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const cmpUtils = new index_1.ComponentUtils();
            try {
                let typeName;
                let folder;
                switch (node.type) {
                    case index_1.NodeType.Folder:
                        typeName = node.parent.fullName;
                        folder = node.fullName;
                        break;
                    case index_1.NodeType.MetadataType:
                        if (index_1.TypeUtils.FOLDER_TYPES.has(node.fullName)) {
                            const typeUtils = new index_1.TypeUtils();
                            typeName = typeUtils.getFolderForType(node.fullName);
                            break;
                        }
                    default:
                        typeName = node.fullName;
                }
                const components = yield cmpUtils.loadComponents(this.defaultOrg, typeName, folder, node.toRefresh);
                return components;
            }
            catch (e) {
                throw parseErrors(e);
            }
        });
    }
    getDefaultUsernameOrAlias() {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_1.hasRootWorkspace()) {
                const username = yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(false);
                return username;
            }
            else {
                throw new Error(messages_1.nls.localize('cannot_determine_workspace'));
            }
        });
    }
}
exports.MetadataOutlineProvider = MetadataOutlineProvider;
function parseErrors(error) {
    try {
        const errMsg = typeof error === 'string' ? error : error.message;
        const e = helpers_1.extractJsonObject(errMsg);
        let message;
        switch (e.name) {
            case 'RefreshTokenAuthError':
                message = messages_1.nls.localize('error_auth_token');
                break;
            case 'NoOrgFound':
                message = messages_1.nls.localize('error_no_org_found');
                break;
            default:
                message = messages_1.nls.localize('error_fetching_metadata');
                break;
        }
        message += ' ' + messages_1.nls.localize('error_org_browser_text');
        return new Error(message);
    }
    catch (e) {
        return new Error(e);
    }
}
exports.parseErrors = parseErrors;
//# sourceMappingURL=metadataOutlineProvider.js.map