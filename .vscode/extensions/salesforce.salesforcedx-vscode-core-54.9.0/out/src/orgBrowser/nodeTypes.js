"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const forceSourceRetrieveMetadata_1 = require("../commands/forceSourceRetrieveMetadata");
const messages_1 = require("../messages");
var NodeType;
(function (NodeType) {
    NodeType["Org"] = "org";
    NodeType["MetadataType"] = "type";
    NodeType["MetadataComponent"] = "component";
    NodeType["MetadataField"] = "field";
    NodeType["EmptyNode"] = "empty";
    NodeType["Folder"] = "folder";
})(NodeType = exports.NodeType || (exports.NodeType = {}));
class BrowserNode extends vscode.TreeItem {
    constructor(label, type, fullName, metadataObject) {
        super(label);
        this.type = type;
        this.toRefresh = false;
        this.type = type;
        this.contextValue = type;
        this.fullName = fullName || label;
        this.metadataObject = metadataObject;
        switch (this.type) {
            case NodeType.Org:
                this.collapsibleState = vscode.TreeItemCollapsibleState.Expanded;
                break;
            case NodeType.MetadataComponent:
            case NodeType.MetadataField:
                this.collapsibleState = vscode.TreeItemCollapsibleState.None;
                this.iconPath = vscode.ThemeIcon.File;
                break;
            case NodeType.MetadataType:
                this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
                this.suffix = this.metadataObject.suffix;
                this.directoryName = this.metadataObject.directoryName;
                break;
            case NodeType.Folder:
                this.collapsibleState = vscode.TreeItemCollapsibleState.Collapsed;
                this.iconPath = vscode.ThemeIcon.Folder;
                break;
            case NodeType.EmptyNode:
                this.collapsibleState = vscode.TreeItemCollapsibleState.None;
                break;
        }
    }
    setComponents(fullNames, type) {
        this._children = [];
        if (fullNames.length === 0) {
            this._children.push(new BrowserNode(messages_1.nls.localize('empty_components'), NodeType.EmptyNode));
        }
        fullNames.forEach(fullName => {
            const label = this.type === NodeType.Folder
                ? fullName.substr(fullName.indexOf('/') + 1)
                : fullName;
            const child = new BrowserNode(label, type, fullName);
            child._parent = this;
            this._children.push(child);
        });
    }
    setTypes(metadataObjects, type) {
        this._children = [];
        if (metadataObjects.length === 0) {
            this._children.push(new BrowserNode(messages_1.nls.localize('empty_components'), NodeType.EmptyNode));
        }
        metadataObjects.forEach(metadataObject => {
            const child = new BrowserNode(metadataObject.label, type, metadataObject.xmlName, metadataObject);
            child._parent = this;
            this._children.push(child);
        });
    }
    get parent() {
        return this._parent;
    }
    get children() {
        return this._children;
    }
    getAssociatedTypeNode() {
        const parent = this.parent;
        if (parent) {
            switch (parent.type) {
                case NodeType.Folder:
                    return parent.parent;
                case NodeType.MetadataType:
                    return parent;
                case NodeType.Org:
                    return this;
            }
        }
        throw new Error(`Node of type ${this.type} does not have a parent metadata type node`);
    }
    describer() {
        switch (this.type) {
            case NodeType.MetadataType:
                return forceSourceRetrieveMetadata_1.RetrieveDescriberFactory.createTypeNodeDescriber(this);
            case NodeType.Folder:
            case NodeType.MetadataComponent:
                return forceSourceRetrieveMetadata_1.RetrieveDescriberFactory.createComponentNodeDescriber(this);
        }
        throw new Error(`Org Browser node type '${this.type}' does not support metadata retrieve`);
    }
}
exports.BrowserNode = BrowserNode;
//# sourceMappingURL=nodeTypes.js.map