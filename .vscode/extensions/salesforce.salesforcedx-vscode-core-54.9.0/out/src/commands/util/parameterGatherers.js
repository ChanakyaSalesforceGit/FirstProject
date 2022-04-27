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
const glob = require("glob");
const path = require("path");
const vscode = require("vscode");
const messages_1 = require("../../messages");
const sfdxProject_1 = require("../../sfdxProject");
const util_1 = require("../../util");
class CompositeParametersGatherer {
    constructor(...gatherers) {
        this.gatherers = gatherers;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const aggregatedData = {};
            for (const gatherer of this.gatherers) {
                const input = yield gatherer.gather();
                if (input.type === 'CONTINUE') {
                    Object.keys(input.data).map(key => (aggregatedData[key] = input.data[key]));
                }
                else {
                    return {
                        type: 'CANCEL'
                    };
                }
            }
            return {
                type: 'CONTINUE',
                data: aggregatedData
            };
        });
    }
}
exports.CompositeParametersGatherer = CompositeParametersGatherer;
class EmptyParametersGatherer {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            return { type: 'CONTINUE', data: {} };
        });
    }
}
exports.EmptyParametersGatherer = EmptyParametersGatherer;
class FilePathGatherer {
    constructor(uri) {
        this.filePath = uri.fsPath;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_1.hasRootWorkspace()) {
                return { type: 'CONTINUE', data: this.filePath };
            }
            return { type: 'CANCEL' };
        });
    }
}
exports.FilePathGatherer = FilePathGatherer;
class FileSelector {
    constructor(displayMessage, errorMessage, include, exclude, maxResults) {
        this.displayMessage = displayMessage;
        this.errorMessage = errorMessage;
        this.include = include;
        this.exclude = exclude;
        this.maxResults = maxResults;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const files = yield vscode.workspace.findFiles(this.include, this.exclude, this.maxResults);
            const fileItems = files.map(file => {
                return {
                    label: path.basename(file.toString()),
                    description: file.fsPath
                };
            });
            if (fileItems.length === 0) {
                vscode.window.showErrorMessage(this.errorMessage);
                return { type: 'CANCEL' };
            }
            const selection = yield vscode.window.showQuickPick(fileItems, {
                placeHolder: this.displayMessage
            });
            return selection
                ? { type: 'CONTINUE', data: { file: selection.description.toString() } }
                : { type: 'CANCEL' };
        });
    }
}
exports.FileSelector = FileSelector;
class SelectFileName {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const fileNameInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_file_name')
            };
            const fileName = yield vscode.window.showInputBox(fileNameInputOptions);
            return fileName
                ? { type: 'CONTINUE', data: { fileName } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectFileName = SelectFileName;
class SelectUsername {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const usernameInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_username_name')
            };
            const username = yield vscode.window.showInputBox(usernameInputOptions);
            return username
                ? { type: 'CONTINUE', data: { username } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectUsername = SelectUsername;
class DemoModePromptGatherer {
    constructor() {
        this.LOGOUT_RESPONSE = 'Cancel';
        this.DO_NOT_LOGOUT_RESPONSE = 'Authorize Org';
        this.prompt = messages_1.nls.localize('demo_mode_prompt');
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield vscode.window.showInformationMessage(this.prompt, this.DO_NOT_LOGOUT_RESPONSE, this.LOGOUT_RESPONSE);
            return response && response === this.LOGOUT_RESPONSE
                ? { type: 'CONTINUE', data: {} }
                : { type: 'CANCEL' };
        });
    }
}
exports.DemoModePromptGatherer = DemoModePromptGatherer;
class SelectLwcComponentDir {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            let packageDirs = [];
            try {
                packageDirs = yield sfdxProject_1.SfdxPackageDirectories.getPackageDirectoryPaths();
            }
            catch (e) {
                if (e.name !== 'NoPackageDirectoryPathsFound' &&
                    e.name !== 'NoPackageDirectoriesFound') {
                    throw e;
                }
            }
            const packageDir = yield this.showMenu(packageDirs, 'parameter_gatherer_enter_dir_name');
            let outputdir;
            const namePathMap = new Map();
            let fileName;
            if (packageDir) {
                const pathToPkg = path.join(util_1.getRootWorkspacePath(), packageDir);
                const components = source_deploy_retrieve_1.ComponentSet.fromSource(pathToPkg);
                const lwcNames = [];
                for (const component of components.getSourceComponents() || []) {
                    const { fullName, type } = component;
                    if (type.name === source_deploy_retrieve_1.registry.types.lightningcomponentbundle.name) {
                        namePathMap.set(fullName, component.xml);
                        lwcNames.push(fullName);
                    }
                }
                const chosenLwcName = yield this.showMenu(lwcNames, 'parameter_gatherer_enter_lwc_name');
                const filePathToXml = namePathMap.get(chosenLwcName);
                fileName = path.basename(filePathToXml, '.js-meta.xml');
                // Path strategy expects a relative path to the output folder
                outputdir = path.dirname(filePathToXml).replace(pathToPkg, packageDir);
            }
            return outputdir && fileName
                ? {
                    type: 'CONTINUE',
                    data: { fileName, outputdir }
                }
                : { type: 'CANCEL' };
        });
    }
    showMenu(options, message) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode.window.showQuickPick(options, {
                placeHolder: messages_1.nls.localize(message)
            });
        });
    }
}
exports.SelectLwcComponentDir = SelectLwcComponentDir;
class SelectOutputDir {
    constructor(typeDir, typeDirRequired) {
        this.typeDir = typeDir;
        this.typeDirRequired = typeDirRequired;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            let packageDirs = [];
            try {
                packageDirs = yield sfdxProject_1.SfdxPackageDirectories.getPackageDirectoryPaths();
            }
            catch (e) {
                if (e.name !== 'NoPackageDirectoryPathsFound' &&
                    e.name !== 'NoPackageDirectoriesFound') {
                    throw e;
                }
            }
            let dirOptions = this.getDefaultOptions(packageDirs);
            let outputdir = yield this.showMenu(dirOptions);
            if (outputdir === SelectOutputDir.customDirOption) {
                dirOptions = this.getCustomOptions(packageDirs, util_1.getRootWorkspacePath());
                outputdir = yield this.showMenu(dirOptions);
            }
            return outputdir
                ? { type: 'CONTINUE', data: { outputdir } }
                : { type: 'CANCEL' };
        });
    }
    getDefaultOptions(packageDirectories) {
        const options = packageDirectories.map(packageDir => path.join(packageDir, SelectOutputDir.defaultOutput, this.typeDir));
        options.push(SelectOutputDir.customDirOption);
        return options;
    }
    getCustomOptions(packageDirs, rootPath) {
        const packages = packageDirs.length > 1 ? `{${packageDirs.join(',')}}` : packageDirs[0];
        return new glob.GlobSync(path.join(rootPath, packages, '**', path.sep)).found.map(value => {
            let relativePath = path.relative(rootPath, path.join(value, '/'));
            relativePath = path.join(relativePath, this.typeDirRequired && !relativePath.endsWith(this.typeDir)
                ? this.typeDir
                : '');
            return relativePath;
        });
    }
    showMenu(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode.window.showQuickPick(options, {
                placeHolder: messages_1.nls.localize('parameter_gatherer_enter_dir_name')
            });
        });
    }
}
exports.SelectOutputDir = SelectOutputDir;
SelectOutputDir.defaultOutput = path.join('main', 'default');
SelectOutputDir.customDirOption = `$(file-directory) ${messages_1.nls.localize('custom_output_directory')}`;
class SimpleGatherer {
    constructor(input) {
        this.input = input;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                type: 'CONTINUE',
                data: this.input
            };
        });
    }
}
exports.SimpleGatherer = SimpleGatherer;
class RetrieveComponentOutputGatherer {
    constructor(describer) {
        this.describer = describer;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            return {
                type: 'CONTINUE',
                data: yield this.describer.gatherOutputLocations()
            };
        });
    }
}
exports.RetrieveComponentOutputGatherer = RetrieveComponentOutputGatherer;
class MetadataTypeGatherer extends SimpleGatherer {
    constructor(metadataType) {
        super({ type: metadataType });
    }
}
exports.MetadataTypeGatherer = MetadataTypeGatherer;
class PromptConfirmGatherer {
    constructor(question) {
        this.question = question;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const confirmOpt = messages_1.nls.localize('parameter_gatherer_prompt_confirm_option');
            const cancelOpt = messages_1.nls.localize('parameter_gatherer_prompt_cancel_option');
            const choice = yield this.showMenu([cancelOpt, confirmOpt]);
            return confirmOpt === choice
                ? { type: 'CONTINUE', data: { choice } }
                : { type: 'CANCEL' };
        });
    }
    showMenu(options) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield vscode.window.showQuickPick(options, {
                placeHolder: this.question
            });
        });
    }
}
exports.PromptConfirmGatherer = PromptConfirmGatherer;
//# sourceMappingURL=parameterGatherers.js.map