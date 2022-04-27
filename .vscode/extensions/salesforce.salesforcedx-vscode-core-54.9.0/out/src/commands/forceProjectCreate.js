"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
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
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const inputUtils_1 = require("../util/inputUtils");
const libraryBaseTemplateCommand_1 = require("./templates/libraryBaseTemplateCommand");
const util_1 = require("./util");
var projectTemplateEnum;
(function (projectTemplateEnum) {
    projectTemplateEnum["standard"] = "standard";
    projectTemplateEnum["empty"] = "empty";
    projectTemplateEnum["analytics"] = "analytics";
})(projectTemplateEnum = exports.projectTemplateEnum || (exports.projectTemplateEnum = {}));
class ProjectTemplateItem {
    constructor(name, description) {
        this.label = messages_1.nls.localize(name);
        this.description = messages_1.nls.localize(description);
    }
}
exports.ProjectTemplateItem = ProjectTemplateItem;
class LibraryForceProjectCreateExecutor extends libraryBaseTemplateCommand_1.LibraryBaseTemplateCommand {
    constructor(options = { isProjectWithManifest: false }) {
        super();
        this.executionName = messages_1.nls.localize('force_project_create_text');
        this.telemetryName = 'force_project_create';
        this.templateType = templates_1.TemplateType.Project;
        this.options = options;
    }
    getOutputFileName(data) {
        return data.projectName;
    }
    openCreatedTemplateInVSCode(outputdir, fileName) {
        return __awaiter(this, void 0, void 0, function* () {
            yield vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(path.join(outputdir, fileName)));
        });
    }
    constructTemplateOptions(data) {
        const templateOptions = {
            projectname: data.projectName,
            template: data.projectTemplate,
            outputdir: data.projectUri,
            ns: '',
            loginurl: 'https://login.salesforce.com',
            defaultpackagedir: 'force-app',
            manifest: this.options.isProjectWithManifest
        };
        this.telemetryProperties = { projectTemplate: data.projectTemplate };
        return templateOptions;
    }
}
exports.LibraryForceProjectCreateExecutor = LibraryForceProjectCreateExecutor;
class SelectProjectTemplate {
    constructor(prefillValueProvider) {
        this.prefillValueProvider = prefillValueProvider;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const items = [
                new ProjectTemplateItem('force_project_create_standard_template_display_text', 'force_project_create_standard_template'),
                new ProjectTemplateItem('force_project_create_empty_template_display_text', 'force_project_create_empty_template'),
                new ProjectTemplateItem('force_project_create_analytics_template_display_text', 'force_project_create_analytics_template')
            ];
            const selection = yield vscode.window.showQuickPick(items);
            let projectTemplate;
            switch (selection && selection.label) {
                case messages_1.nls.localize('force_project_create_standard_template_display_text'):
                    projectTemplate = projectTemplateEnum.standard;
                    break;
                case messages_1.nls.localize('force_project_create_empty_template_display_text'):
                    projectTemplate = projectTemplateEnum.empty;
                    break;
                case messages_1.nls.localize('force_project_create_analytics_template_display_text'):
                    projectTemplate = projectTemplateEnum.analytics;
                    break;
                default:
                    break;
            }
            return projectTemplate
                ? { type: 'CONTINUE', data: { projectTemplate } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectProjectTemplate = SelectProjectTemplate;
class SelectProjectName {
    constructor(prefillValueProvider) {
        this.prefillValueProvider = prefillValueProvider;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = messages_1.nls.localize('parameter_gatherer_enter_project_name');
            const prefillValue = this.prefillValueProvider ? this.prefillValueProvider() : '';
            const projectName = yield inputUtils_1.InputUtils.getFormattedString(prompt, prefillValue);
            return projectName
                ? { type: 'CONTINUE', data: { projectName } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectProjectName = SelectProjectName;
class SelectProjectFolder {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectUri = yield vscode.window.showOpenDialog({
                canSelectFiles: false,
                canSelectFolders: true,
                canSelectMany: false,
                openLabel: messages_1.nls.localize('force_project_create_open_dialog_create_label')
            });
            return projectUri && projectUri.length === 1
                ? { type: 'CONTINUE', data: { projectUri: projectUri[0].fsPath } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectProjectFolder = SelectProjectFolder;
class PathExistsChecker {
    check(inputs) {
        return __awaiter(this, void 0, void 0, function* () {
            if (inputs.type === 'CONTINUE') {
                const pathExists = fs.existsSync(path.join(inputs.data.projectUri, `${inputs.data.projectName}/`));
                if (!pathExists) {
                    return inputs;
                }
                else {
                    const overwrite = yield notifications_1.notificationService.showWarningMessage(messages_1.nls.localize('warning_prompt_dir_overwrite'), messages_1.nls.localize('warning_prompt_overwrite'), messages_1.nls.localize('warning_prompt_overwrite_cancel'));
                    if (overwrite === messages_1.nls.localize('warning_prompt_overwrite')) {
                        return inputs;
                    }
                }
            }
            return { type: 'CANCEL' };
        });
    }
}
exports.PathExistsChecker = PathExistsChecker;
const workspaceChecker = new util_1.EmptyPreChecker();
const parameterGatherer = new util_1.CompositeParametersGatherer(new SelectProjectTemplate(), new SelectProjectName(), new SelectProjectFolder());
const pathExistsChecker = new PathExistsChecker();
function forceSfdxProjectCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const createTemplateExecutor = new LibraryForceProjectCreateExecutor();
        const sfdxProjectCreateCommandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, createTemplateExecutor, pathExistsChecker);
        yield sfdxProjectCreateCommandlet.run();
    });
}
exports.forceSfdxProjectCreate = forceSfdxProjectCreate;
function forceProjectWithManifestCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const createTemplateExecutor = new LibraryForceProjectCreateExecutor({
            isProjectWithManifest: true
        });
        const projectWithManifestCreateCommandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, createTemplateExecutor, pathExistsChecker);
        yield projectWithManifestCreateCommandlet.run();
    });
}
exports.forceProjectWithManifestCreate = forceProjectWithManifestCreate;
//# sourceMappingURL=forceProjectCreate.js.map