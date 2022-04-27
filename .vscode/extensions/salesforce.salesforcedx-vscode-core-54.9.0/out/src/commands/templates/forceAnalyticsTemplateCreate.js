"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
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
const templates_1 = require("@salesforce/templates");
const vscode = require("vscode");
const messages_1 = require("../../messages");
const util_1 = require("../util");
const libraryBaseTemplateCommand_1 = require("./libraryBaseTemplateCommand");
const metadataTypeConstants_1 = require("./metadataTypeConstants");
class LibraryForceAnalyticsTemplateCreateExecutor extends libraryBaseTemplateCommand_1.LibraryBaseTemplateCommand {
    constructor() {
        super(...arguments);
        this.executionName = messages_1.nls.localize('force_analytics_template_create_text');
        this.telemetryName = 'force_analytics_template_create';
        this.metadataTypeName = metadataTypeConstants_1.ANALYTICS_TEMPLATE_TYPE;
        this.templateType = templates_1.TemplateType.AnalyticsTemplate;
    }
    getFileExtension() {
        return '.json';
    }
    getOutputFileName(data) {
        return data.fileName;
    }
    constructTemplateOptions(data) {
        const templateOptions = {
            outputdir: data.outputdir,
            templatename: data.fileName
        };
        return templateOptions;
    }
    getDefaultDirectory() {
        return metadataTypeConstants_1.ANALYTICS_TEMPLATE_DIRECTORY;
    }
    getSourcePathStrategy() {
        return util_1.PathStrategyFactory.createWaveTemplateBundleStrategy();
    }
}
exports.LibraryForceAnalyticsTemplateCreateExecutor = LibraryForceAnalyticsTemplateCreateExecutor;
class SelectProjectTemplate {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectTemplateInputOptions = {
                prompt: messages_1.nls.localize('force_analytics_template_name_text')
            };
            const fileName = yield vscode.window.showInputBox(projectTemplateInputOptions);
            return fileName
                ? { type: 'CONTINUE', data: { fileName } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectProjectTemplate = SelectProjectTemplate;
const outputDirGatherer = new util_1.SelectOutputDir(metadataTypeConstants_1.ANALYTICS_TEMPLATE_DIRECTORY);
const parameterGatherer = new util_1.CompositeParametersGatherer(new SelectProjectTemplate(), outputDirGatherer);
function forceAnalyticsTemplateCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const createTemplateExecutor = new LibraryForceAnalyticsTemplateCreateExecutor();
        const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), parameterGatherer, createTemplateExecutor);
        yield commandlet.run();
    });
}
exports.forceAnalyticsTemplateCreate = forceAnalyticsTemplateCreate;
//# sourceMappingURL=forceAnalyticsTemplateCreate.js.map