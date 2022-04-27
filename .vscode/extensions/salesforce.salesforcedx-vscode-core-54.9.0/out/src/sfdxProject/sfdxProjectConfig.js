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
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const core_1 = require("@salesforce/core");
const path = require("path");
const vscode = require("vscode");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const predicates_1 = require("../predicates");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
/**
 * Class representing the local sfdx-project.json file.
 * Does not contain global values.
 */
class SfdxProjectConfig {
    constructor() {
        throw new Error('Error: *** call SfdxProject.getInstance() to get the singleton instance of this class ***');
    }
    static initializeSfdxProjectConfig() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!SfdxProjectConfig.instance &&
                predicates_1.isSfdxProjectOpened.apply(vscode.workspace).result) {
                const sfdxProjectPath = util_1.getRootWorkspacePath();
                try {
                    const sfdxProject = yield core_1.SfdxProject.resolve(sfdxProjectPath);
                    SfdxProjectConfig.instance = yield sfdxProject.retrieveSfdxProjectJson();
                    const fileWatcher = vscode.workspace.createFileSystemWatcher(path.join(sfdxProjectPath, constants_1.SFDX_PROJECT_FILE));
                    fileWatcher.onDidChange(() => __awaiter(this, void 0, void 0, function* () {
                        try {
                            yield SfdxProjectConfig.instance.read();
                        }
                        catch (error) {
                            SfdxProjectConfig.handleError(error);
                            throw error;
                        }
                    }));
                }
                catch (error) {
                    SfdxProjectConfig.handleError(error);
                    throw error;
                }
            }
        });
    }
    static handleError(error) {
        let errorMessage = error.message;
        if (error.name === 'JsonParseError') {
            errorMessage = messages_1.nls.localize('error_parsing_sfdx_project_file', error.path, error.message);
        }
        notifications_1.notificationService.showErrorMessage(errorMessage);
        telemetry_1.telemetryService.sendException('project_config', errorMessage);
    }
    static getInstance() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!SfdxProjectConfig.instance) {
                yield SfdxProjectConfig.initializeSfdxProjectConfig();
            }
            return SfdxProjectConfig.instance;
        });
    }
    static getValue(key) {
        return __awaiter(this, void 0, void 0, function* () {
            const projectConfig = yield SfdxProjectConfig.getInstance();
            return projectConfig.get(key);
        });
    }
}
exports.default = SfdxProjectConfig;
//# sourceMappingURL=sfdxProjectConfig.js.map