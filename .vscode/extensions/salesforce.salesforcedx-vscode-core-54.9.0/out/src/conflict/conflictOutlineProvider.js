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
const vscode = require("vscode");
const conflictNode_1 = require("./conflictNode");
class ConflictOutlineProvider {
    constructor() {
        this.internalOnDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this.internalOnDidChangeTreeData.event;
        this.root = null;
    }
    onViewChange() {
        this.internalOnDidChangeTreeData.fire(undefined);
    }
    refresh(node) {
        return __awaiter(this, void 0, void 0, function* () {
            this.internalOnDidChangeTreeData.fire(node);
        });
    }
    reset(rootLabel, conflicts, emptyLabel) {
        this.emptyLabel = emptyLabel;
        this.root = this.createConflictRoot(rootLabel, conflicts);
    }
    getRevealNode() {
        return this.root;
    }
    getTreeItem(element) {
        if (element) {
            return element;
        }
        if (this.root) {
            return this.root;
        }
        return { label: 'EMPTY' };
    }
    getChildren(element) {
        if (element) {
            return element.children;
        }
        if (this.root) {
            return [this.root];
        }
        return [];
    }
    getParent(element) {
        return element.parent;
    }
    createConflictRoot(rootLabel, conflicts) {
        const orgRoot = new conflictNode_1.ConflictGroupNode(rootLabel, this.emptyLabel);
        orgRoot.id = 'ROOT-NODE';
        orgRoot.addChildren(conflicts);
        return orgRoot;
    }
}
exports.ConflictOutlineProvider = ConflictOutlineProvider;
//# sourceMappingURL=conflictOutlineProvider.js.map