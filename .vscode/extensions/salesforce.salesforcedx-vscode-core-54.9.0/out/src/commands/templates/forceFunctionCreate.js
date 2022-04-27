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
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const cp = require("child_process");
const path = require("path");
const vscode = require("vscode");
const channels_1 = require("../../channels");
const messages_1 = require("../../messages");
const notifications_1 = require("../../notifications");
const util_1 = require("../../util");
const util_2 = require("../util");
const metadataTypeConstants_1 = require("./metadataTypeConstants");
const functions_core_1 = require("@heroku/functions-core");
const util_3 = require("../../util");
const LANGUAGE_JAVA = 'java';
const LANGUAGE_JAVASCRIPT = 'javascript';
const LANGUAGE_TYPESCRIPT = 'typescript';
const LOG_NAME = 'force_function_create';
class ForceFunctionCreateExecutor extends src_1.LibraryCommandletExecutor {
    constructor() {
        super(messages_1.nls.localize('force_function_create_text'), LOG_NAME, channels_1.OUTPUT_CHANNEL);
    }
    run(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { fileName, language } = response.data;
            let metadata;
            switch (language) {
                case LANGUAGE_JAVASCRIPT:
                    metadata = util_1.MetadataDictionary.getInfo(metadataTypeConstants_1.FUNCTION_TYPE_JS);
                    metadata.suffix = '.js';
                    this.telemetry.addProperty('language', 'node');
                    break;
                case LANGUAGE_TYPESCRIPT:
                    metadata = util_1.MetadataDictionary.getInfo(metadataTypeConstants_1.FUNCTION_TYPE_JS);
                    metadata.suffix = '.ts';
                    this.telemetry.addProperty('language', 'node');
                    break;
                case LANGUAGE_JAVA:
                    metadata = util_1.MetadataDictionary.getInfo(metadataTypeConstants_1.FUNCTION_TYPE_JAVA);
                    metadata.suffix = '.java';
                    this.telemetry.addProperty('language', 'java');
                    break;
            }
            const { path: functionPath, welcomeText } = yield functions_core_1.generateFunction(fileName, language, util_3.getRootWorkspacePath());
            channels_1.channelService.appendLine(`Created ${language} function ${fileName} in ${functionPath}.`);
            if (welcomeText)
                channels_1.channelService.appendLine(welcomeText);
            channels_1.channelService.showChannelOutput();
            const outputFile = metadata.pathStrategy.getPathToSource(functionPath, fileName, metadata.suffix);
            const document = yield vscode.workspace.openTextDocument(outputFile);
            vscode.window.showTextDocument(document);
            channels_1.channelService.appendLine('Installing dependencies...');
            if (language === LANGUAGE_JAVA) {
                cp.exec('mvn install', { cwd: path.join(functionPath) }, err => {
                    if (err) {
                        notifications_1.notificationService.showWarningMessage(messages_1.nls.localize('force_function_install_mvn_dependencies_error', err.message));
                    }
                });
            }
            else {
                cp.exec('npm install', { cwd: functionPath }, err => {
                    if (err) {
                        notifications_1.notificationService.showWarningMessage(messages_1.nls.localize('force_function_install_npm_dependencies_error', err.message));
                    }
                });
            }
            return true;
        });
    }
}
exports.ForceFunctionCreateExecutor = ForceFunctionCreateExecutor;
class FunctionInfoGatherer {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const nameInputOptions = {
                prompt: messages_1.nls.localize('force_function_enter_function')
            };
            const name = yield vscode.window.showInputBox(nameInputOptions);
            if (name === undefined) {
                return { type: 'CANCEL' };
            }
            const language = yield vscode.window.showQuickPick([LANGUAGE_JAVA, LANGUAGE_JAVASCRIPT, LANGUAGE_TYPESCRIPT], {
                placeHolder: messages_1.nls.localize('force_function_enter_language')
            });
            if (language === undefined) {
                return { type: 'CANCEL' };
            }
            return {
                type: 'CONTINUE',
                data: {
                    fileName: name,
                    language
                }
            };
        });
    }
}
exports.FunctionInfoGatherer = FunctionInfoGatherer;
const parameterGatherer = new util_2.CompositeParametersGatherer(new FunctionInfoGatherer());
function forceFunctionCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), parameterGatherer, new ForceFunctionCreateExecutor());
        yield commandlet.run();
    });
}
exports.forceFunctionCreate = forceFunctionCreate;
//# sourceMappingURL=forceFunctionCreate.js.map