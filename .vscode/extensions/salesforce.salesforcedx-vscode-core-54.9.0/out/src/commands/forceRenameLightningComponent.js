"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
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
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const commands_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/commands");
const fs = require("fs");
const path = require("path");
const util_1 = require("util");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const util_2 = require("./util");
const RENAME_LIGHTNING_COMPONENT_EXECUTOR = 'force_rename_lightning_component';
const RENAME_INPUT_PLACEHOLDER = 'rename_component_input_placeholder';
const RENAME_INPUT_PROMPT = 'rename_component_input_prompt';
const RENAME_INPUT_DUP_ERROR = 'rename_component_input_dup_error';
const RENAME_WARNING = 'rename_component_warning';
const LWC = 'lwc';
const AURA = 'aura';
const TEST_FOLDER = '__tests__';
class RenameLwcComponentExecutor extends src_1.LibraryCommandletExecutor {
    constructor(sourceFsPath) {
        super(messages_1.nls.localize(RENAME_LIGHTNING_COMPONENT_EXECUTOR), RENAME_LIGHTNING_COMPONENT_EXECUTOR, channels_1.OUTPUT_CHANNEL);
        this.sourceFsPath = sourceFsPath;
    }
    run(response) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const newComponentName = (_a = response.data.name) === null || _a === void 0 ? void 0 : _a.trim();
            if (newComponentName && this.sourceFsPath) {
                yield renameComponent(this.sourceFsPath, newComponentName);
                return true;
            }
            return false;
        });
    }
}
exports.RenameLwcComponentExecutor = RenameLwcComponentExecutor;
function forceRenameLightningComponent(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const sourceFsPath = sourceUri.fsPath;
        if (sourceFsPath) {
            const commandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new GetComponentName(sourceFsPath), new RenameLwcComponentExecutor(sourceFsPath));
            yield commandlet.run();
        }
    });
}
exports.forceRenameLightningComponent = forceRenameLightningComponent;
class GetComponentName {
    constructor(sourceFsPath) {
        this.sourceFsPath = sourceFsPath;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const inputOptions = {
                value: getComponentName(yield getComponentPath(this.sourceFsPath)),
                placeHolder: messages_1.nls.localize(RENAME_INPUT_PLACEHOLDER),
                promopt: messages_1.nls.localize(RENAME_INPUT_PROMPT)
            };
            const inputResult = yield vscode.window.showInputBox(inputOptions);
            return inputResult
                ? { type: 'CONTINUE', data: { name: inputResult } }
                : { type: 'CANCEL' };
        });
    }
}
exports.GetComponentName = GetComponentName;
function renameComponent(sourceFsPath, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const componentPath = yield getComponentPath(sourceFsPath);
        const componentName = getComponentName(componentPath);
        yield checkForDuplicateName(componentPath, newName);
        const items = yield fs.promises.readdir(componentPath);
        for (const item of items) {
            // only rename the file that has same name with component
            if (isNameMatch(item, componentName, componentPath)) {
                const newItem = item.replace(componentName, newName);
                yield fs.promises.rename(path.join(componentPath, item), path.join(componentPath, newItem));
            }
            if (item === TEST_FOLDER) {
                const testFolderPath = path.join(componentPath, TEST_FOLDER);
                const testFiles = yield fs.promises.readdir(testFolderPath);
                for (const file of testFiles) {
                    if (isNameMatch(file, componentName, componentPath)) {
                        const newFile = file.replace(componentName, newName);
                        yield fs.promises.rename(path.join(testFolderPath, file), path.join(testFolderPath, newFile));
                    }
                }
            }
        }
        const newComponentPath = path.join(path.dirname(componentPath), newName);
        yield fs.promises.rename(componentPath, newComponentPath);
        commands_1.notificationService.showWarningMessage(messages_1.nls.localize(RENAME_WARNING));
    });
}
function getComponentPath(sourceFsPath) {
    return __awaiter(this, void 0, void 0, function* () {
        const stats = yield fs.promises.stat(sourceFsPath);
        return stats.isFile() ? path.dirname(sourceFsPath) : sourceFsPath;
    });
}
function getComponentName(componentPath) {
    return path.basename(componentPath);
}
function checkForDuplicateName(componentPath, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        const isNameDuplicate = yield isDuplicate(componentPath, newName);
        if (isNameDuplicate) {
            const errorMessage = messages_1.nls.localize(RENAME_INPUT_DUP_ERROR);
            commands_1.notificationService.showErrorMessage(errorMessage);
            throw new Error(util_1.format(errorMessage));
        }
    });
}
function isDuplicate(componentPath, newName) {
    return __awaiter(this, void 0, void 0, function* () {
        // A LWC component can't share the same name as a Aura component
        const componentPathDirName = path.dirname(componentPath);
        let lwcPath;
        let auraPath;
        if (isLwcComponent(componentPath)) {
            lwcPath = componentPathDirName;
            auraPath = path.join(path.dirname(componentPathDirName), AURA);
        }
        else {
            lwcPath = path.join(path.dirname(componentPathDirName), LWC);
            auraPath = componentPathDirName;
        }
        const allLwcComponents = yield fs.promises.readdir(lwcPath);
        const allAuraComponents = yield fs.promises.readdir(auraPath);
        return (allLwcComponents.includes(newName) || allAuraComponents.includes(newName));
    });
}
function isNameMatch(item, componentName, componentPath) {
    const isLwc = isLwcComponent(componentPath);
    let regularExp;
    if (isLwc) {
        regularExp = new RegExp(`${componentName}\.(html|js|js-meta.xml|css|svg|test.js)`);
    }
    else {
        regularExp = new RegExp(`${componentName}(((Controller|Renderer|Helper)?\.js)|(\.(cmp|app|css|design|auradoc|svg)))`);
    }
    return Boolean(item.match(regularExp));
}
exports.isNameMatch = isNameMatch;
function isLwcComponent(componentPath) {
    return path.basename(path.dirname(componentPath)) === LWC;
}
//# sourceMappingURL=forceRenameLightningComponent.js.map