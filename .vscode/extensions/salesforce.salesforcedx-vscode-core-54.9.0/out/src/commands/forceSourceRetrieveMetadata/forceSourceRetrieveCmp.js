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
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const path = require("path");
const vscode = require("vscode");
const messages_1 = require("../../messages");
const sfdxProject_1 = require("../../sfdxProject");
const util_1 = require("../../util");
const baseDeployRetrieve_1 = require("../baseDeployRetrieve");
const util_2 = require("../util");
const parameterGatherers_1 = require("../util/parameterGatherers");
const postconditionCheckers_1 = require("../util/postconditionCheckers");
class LibraryRetrieveSourcePathExecutor extends baseDeployRetrieve_1.RetrieveExecutor {
    constructor(openAfterRetrieve = false) {
        super(messages_1.nls.localize('force_source_retrieve_text'), 'force_source_retrieve_beta');
        this.openAfterRetrieve = openAfterRetrieve;
    }
    getComponents(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const toRetrieve = new source_deploy_retrieve_1.ComponentSet(response.data.map(lc => ({ fullName: lc.fileName, type: lc.type })));
            const packageDirs = yield sfdxProject_1.SfdxPackageDirectories.getPackageDirectoryFullPaths();
            const localSourceComponents = source_deploy_retrieve_1.ComponentSet.fromSource({
                fsPaths: packageDirs,
                include: toRetrieve
            });
            for (const component of localSourceComponents) {
                toRetrieve.add(component);
            }
            return toRetrieve;
        });
    }
    postOperation(result) {
        const _super = Object.create(null, {
            postOperation: { get: () => super.postOperation }
        });
        return __awaiter(this, void 0, void 0, function* () {
            yield _super.postOperation.call(this, result);
            // assumes opening only one component
            if (result && this.openAfterRetrieve) {
                const componentToOpen = result.components.getSourceComponents().first();
                if (componentToOpen) {
                    const dirPath = (yield sfdxProject_1.SfdxPackageDirectories.getDefaultPackageDir()) || '';
                    const defaultOutput = path.join(util_1.getRootWorkspacePath(), dirPath);
                    const compSet = source_deploy_retrieve_1.ComponentSet.fromSource(defaultOutput);
                    yield this.openResources(this.findResources(componentToOpen, compSet));
                }
            }
        });
    }
    findResources(filter, compSet) {
        if (compSet && compSet.size > 0) {
            const oneComp = compSet.getSourceComponents(filter).first();
            const filesToOpen = [];
            if (oneComp) {
                if (oneComp.xml) {
                    filesToOpen.push(oneComp.xml);
                }
                for (const filePath of oneComp.walkContent()) {
                    filesToOpen.push(filePath);
                }
            }
            return filesToOpen;
        }
        return [];
    }
    openResources(filesToOpen) {
        return __awaiter(this, void 0, void 0, function* () {
            for (const file of filesToOpen) {
                const showOptions = {
                    preview: false
                };
                const document = yield vscode.workspace.openTextDocument(file);
                vscode.window.showTextDocument(document, showOptions);
            }
        });
    }
}
exports.LibraryRetrieveSourcePathExecutor = LibraryRetrieveSourcePathExecutor;
function forceSourceRetrieveCmp(trigger, openAfterRetrieve = false) {
    return __awaiter(this, void 0, void 0, function* () {
        const retrieveDescriber = trigger.describer();
        const commandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new parameterGatherers_1.RetrieveComponentOutputGatherer(retrieveDescriber), new LibraryRetrieveSourcePathExecutor(openAfterRetrieve), new postconditionCheckers_1.OverwriteComponentPrompt());
        yield commandlet.run();
    });
}
exports.forceSourceRetrieveCmp = forceSourceRetrieveCmp;
//# sourceMappingURL=forceSourceRetrieveCmp.js.map