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
const core_1 = require("@salesforce/core");
const templates_1 = require("@salesforce/templates");
const util_1 = require("../util");
const channels_1 = require("../../channels");
const notifications_1 = require("../../notifications");
const telemetry_1 = require("../../telemetry");
const util_2 = require("../../util");
const path = require("path");
const vscode_1 = require("vscode");
/**
 * Base class for all template commands
 */
class LibraryBaseTemplateCommand {
    constructor() {
        this.showChannelOutput = true;
        /**
         * Additional telemetry properties to log on successful execution
         */
        this.telemetryProperties = {};
        /**
         * Specify one of the metadata types from one of metadataTypeConstants.
         * if this is not specified, you should override openCreatedTemplateInVSCode
         * or getSourcePathStrategy/getFileExtension/getDefaultDirectory.
         */
        this.metadataTypeName = '';
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            const commandName = this.executionName;
            channels_1.channelService.showCommandWithTimestamp(`Starting ${commandName}`);
            const result = yield vscode_1.window.withProgress({
                title: commandName,
                location: vscode_1.ProgressLocation.Notification
            }, () => __awaiter(this, void 0, void 0, function* () {
                try {
                    const templateOptions = this.constructTemplateOptions(response.data);
                    const libraryResult = yield this.createTemplate(this.templateType, templateOptions);
                    const fileName = this.getOutputFileName(response.data);
                    telemetry_1.telemetryService.sendCommandEvent(this.telemetryName, startTime, Object.assign({ dirType: this.identifyDirType(libraryResult.outputDir), commandExecutor: 'library' }, this.telemetryProperties));
                    yield this.openCreatedTemplateInVSCode(libraryResult.outputDir, fileName);
                    return {
                        output: libraryResult.rawOutput
                    };
                }
                catch (error) {
                    telemetry_1.telemetryService.sendException('force_template_create_library', error.message);
                    return {
                        error
                    };
                }
            }));
            if (result.output) {
                channels_1.channelService.appendLine(result.output);
                channels_1.channelService.showCommandWithTimestamp(`Finished ${commandName}`);
                notifications_1.notificationService.showSuccessfulExecution(commandName).catch(() => {
                    // ignore
                });
            }
            if (result.error) {
                channels_1.channelService.appendLine(result.error.message);
                notifications_1.notificationService.showFailedExecution(commandName);
            }
        });
    }
    createTemplate(templateType, templateOptions) {
        return __awaiter(this, void 0, void 0, function* () {
            const cwd = util_2.getRootWorkspacePath();
            const templateService = templates_1.TemplateService.getInstance(cwd);
            let customOrgMetadataTemplates;
            const configValue = yield util_2.ConfigUtil.getConfigValue(core_1.Config.CUSTOM_ORG_METADATA_TEMPLATES);
            if (configValue === undefined) {
                customOrgMetadataTemplates = undefined;
            }
            else {
                customOrgMetadataTemplates = String(configValue);
            }
            this.telemetryProperties.isUsingCustomOrgMetadataTemplates = String(customOrgMetadataTemplates !== undefined);
            return yield templateService.create(templateType, templateOptions, customOrgMetadataTemplates);
        });
    }
    openCreatedTemplateInVSCode(outputdir, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_2.hasRootWorkspace()) {
                const document = yield vscode_1.workspace.openTextDocument(this.getPathToSource(outputdir, fileName));
                vscode_1.window.showTextDocument(document);
            }
        });
    }
    get metadataType() {
        if (this._metadataType) {
            return this._metadataType;
        }
        const type = this.metadataTypeName;
        const info = util_2.MetadataDictionary.getInfo(type);
        this._metadataType = info;
        return info;
    }
    identifyDirType(outputDirectory) {
        const defaultDirectoryPath = path.join(util_1.SelectOutputDir.defaultOutput, this.getDefaultDirectory());
        return outputDirectory.endsWith(defaultDirectoryPath)
            ? 'defaultDir'
            : 'customDir';
    }
    getPathToSource(outputDir, fileName) {
        // outputDir from library is an absolute path
        const sourceDirectory = outputDir;
        return this.getSourcePathStrategy().getPathToSource(sourceDirectory, fileName, this.getFileExtension());
    }
    getSourcePathStrategy() {
        if (!this.metadataType)
            return util_1.PathStrategyFactory.createDefaultStrategy();
        return this.metadataType.pathStrategy;
    }
    getFileExtension() {
        if (!this.metadataType)
            return '';
        return `.${this.metadataType.suffix}`;
    }
    getDefaultDirectory() {
        if (!this.metadataType)
            return '';
        return this.metadataType.directory;
    }
}
exports.LibraryBaseTemplateCommand = LibraryBaseTemplateCommand;
//# sourceMappingURL=libraryBaseTemplateCommand.js.map