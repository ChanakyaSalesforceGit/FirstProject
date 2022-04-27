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
const path_1 = require("path");
const orgBrowser_1 = require("../../orgBrowser");
const sfdxProject_1 = require("../../sfdxProject");
class NodeDescriber {
    constructor(node) {
        this.node = node;
    }
    buildOutput(node) {
        return __awaiter(this, void 0, void 0, function* () {
            const typeNode = node.getAssociatedTypeNode();
            // TODO: Only create one cmp when cli bug (W-6558000) fixed
            const packageDirectories = yield sfdxProject_1.SfdxPackageDirectories.getPackageDirectoryPaths();
            return packageDirectories.map(directory => ({
                fileName: node.fullName,
                outputdir: path_1.join(directory, 'main', 'default', typeNode.directoryName),
                type: typeNode.fullName,
                suffix: typeNode.suffix
            }));
        });
    }
}
class TypeNodeDescriber extends NodeDescriber {
    buildMetadataArg(data) {
        if (data) {
            const dedupe = new Set(); // filter dupes caused by cli bug. See buildOutput in parent class
            data.forEach(c => dedupe.add(`${c.type}:${c.fileName}`));
            if (dedupe.size < this.node.children.length) {
                return Array.from(dedupe).reduce((acc, current, index) => {
                    acc += current;
                    if (index < dedupe.size - 1) {
                        acc += ',';
                    }
                    return acc;
                }, '');
            }
        }
        return this.node.fullName;
    }
    gatherOutputLocations() {
        return __awaiter(this, void 0, void 0, function* () {
            yield orgBrowser_1.orgBrowser.refreshAndExpand(this.node);
            const components = [];
            for (const child of this.node.children) {
                components.push(...(yield this.buildOutput(child)));
            }
            return components;
        });
    }
}
class ComponentNodeDescriber extends NodeDescriber {
    buildMetadataArg() {
        return `${this.node.getAssociatedTypeNode().fullName}:${this.node.fullName}`;
    }
    gatherOutputLocations() {
        return Promise.resolve(this.buildOutput(this.node));
    }
}
class RetrieveDescriberFactory {
    static createTypeNodeDescriber(node) {
        return new TypeNodeDescriber(node);
    }
    static createComponentNodeDescriber(node) {
        return new ComponentNodeDescriber(node);
    }
}
exports.RetrieveDescriberFactory = RetrieveDescriberFactory;
//# sourceMappingURL=describers.js.map