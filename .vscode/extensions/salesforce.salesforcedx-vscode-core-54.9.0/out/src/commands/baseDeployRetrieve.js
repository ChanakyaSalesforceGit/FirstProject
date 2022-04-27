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
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const output_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/output");
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const types_1 = require("@salesforce/source-deploy-retrieve/lib/src/client/types");
const path_1 = require("path");
const _1 = require(".");
const channels_1 = require("../channels");
const persistentStorageService_1 = require("../conflict/persistentStorageService");
const constants_1 = require("../constants");
const context_1 = require("../context");
const diagnostics_1 = require("../diagnostics");
const messages_1 = require("../messages");
const settings_1 = require("../settings");
const sfdxProject_1 = require("../sfdxProject");
const util_1 = require("./util");
class DeployRetrieveExecutor extends src_1.LibraryCommandletExecutor {
    constructor(executionName, logName) {
        super(executionName, logName, channels_1.OUTPUT_CHANNEL);
        this.cancellable = true;
    }
    run(response, progress, token) {
        return __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                const components = yield this.getComponents(response);
                // concrete classes may have purposefully changed the api version.
                // if there's an indication they didn't, check the SFDX configuration to see
                // if there is an overridden api version.
                if (components.apiVersion === source_deploy_retrieve_1.registry.apiVersion) {
                    const apiVersion = (yield src_1.ConfigUtil.getConfigValue('apiVersion'));
                    components.apiVersion = apiVersion !== null && apiVersion !== void 0 ? apiVersion : components.apiVersion;
                }
                this.telemetry.addProperty(constants_1.TELEMETRY_METADATA_COUNT, JSON.stringify(util_1.createComponentCount(components)));
                result = yield this.doOperation(components, token);
                const status = result === null || result === void 0 ? void 0 : result.response.status;
                return (status === types_1.RequestStatus.Succeeded ||
                    status === types_1.RequestStatus.SucceededPartial);
            }
            catch (e) {
                throw util_1.formatException(e);
            }
            finally {
                yield this.postOperation(result);
            }
        });
    }
    setupCancellation(operation, token) {
        if (token && operation) {
            token.onCancellationRequested(() => __awaiter(this, void 0, void 0, function* () {
                yield operation.cancel();
            }));
        }
    }
}
exports.DeployRetrieveExecutor = DeployRetrieveExecutor;
class DeployExecutor extends DeployRetrieveExecutor {
    doOperation(components, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const operation = yield components.deploy({
                usernameOrConnection: yield context_1.workspaceContext.getConnection()
            });
            this.setupCancellation(operation, token);
            return operation.pollStatus();
        });
    }
    postOperation(result) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (result) {
                    _1.BaseDeployExecutor.errorCollection.clear();
                    const relativePackageDirs = yield sfdxProject_1.SfdxPackageDirectories.getPackageDirectoryPaths();
                    const output = this.createOutput(result, relativePackageDirs);
                    channels_1.channelService.appendLine(output);
                    const success = result.response.status === types_1.RequestStatus.Succeeded;
                    if (!success) {
                        diagnostics_1.handleDeployDiagnostics(result, _1.BaseDeployExecutor.errorCollection);
                    }
                }
            }
            finally {
                yield settings_1.DeployQueue.get().unlock();
            }
        });
    }
    createOutput(result, relativePackageDirs) {
        const table = new output_1.Table();
        const rowsWithRelativePaths = result.getFileResponses().map(response => {
            response.filePath = src_1.getRelativeProjectPath(response.filePath, relativePackageDirs);
            return response;
        });
        let output;
        if (result.response.status === types_1.RequestStatus.Succeeded) {
            output = table.createTable(rowsWithRelativePaths, [
                { key: 'state', label: messages_1.nls.localize('table_header_state') },
                { key: 'fullName', label: messages_1.nls.localize('table_header_full_name') },
                { key: 'type', label: messages_1.nls.localize('table_header_type') },
                {
                    key: 'filePath',
                    label: messages_1.nls.localize('table_header_project_path')
                }
            ], messages_1.nls.localize(`table_title_deployed_source`));
        }
        else {
            output = table.createTable(rowsWithRelativePaths.filter(row => row.error), [
                {
                    key: 'filePath',
                    label: messages_1.nls.localize('table_header_project_path')
                },
                { key: 'error', label: messages_1.nls.localize('table_header_errors') }
            ], messages_1.nls.localize(`table_title_deploy_errors`));
        }
        return output;
    }
}
exports.DeployExecutor = DeployExecutor;
class RetrieveExecutor extends DeployRetrieveExecutor {
    doOperation(components, token) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield context_1.workspaceContext.getConnection();
            const defaultOutput = path_1.join(src_1.getRootWorkspacePath(), (_a = (yield sfdxProject_1.SfdxPackageDirectories.getDefaultPackageDir())) !== null && _a !== void 0 ? _a : '');
            const operation = yield components.retrieve({
                usernameOrConnection: connection,
                output: defaultOutput,
                merge: true
            });
            this.setupCancellation(operation, token);
            return operation.pollStatus();
        });
    }
    postOperation(result) {
        return __awaiter(this, void 0, void 0, function* () {
            if (result) {
                const relativePackageDirs = yield sfdxProject_1.SfdxPackageDirectories.getPackageDirectoryPaths();
                const output = this.createOutput(result, relativePackageDirs);
                channels_1.channelService.appendLine(output);
                persistentStorageService_1.PersistentStorageService.getInstance().setPropertiesForFilesRetrieve(result.response.fileProperties);
            }
        });
    }
    createOutput(result, relativePackageDirs) {
        const successes = [];
        const failures = [];
        for (const response of result.getFileResponses()) {
            const asRow = response;
            response.filePath = src_1.getRelativeProjectPath(response.filePath, relativePackageDirs);
            if (response.state !== types_1.ComponentStatus.Failed) {
                successes.push(asRow);
            }
            else {
                failures.push(asRow);
            }
        }
        return this.createOutputTable(successes, failures);
    }
    createOutputTable(successes, failures) {
        const table = new output_1.Table();
        let output = '';
        if (successes.length > 0) {
            output += table.createTable(successes, [
                { key: 'fullName', label: messages_1.nls.localize('table_header_full_name') },
                { key: 'type', label: messages_1.nls.localize('table_header_type') },
                {
                    key: 'filePath',
                    label: messages_1.nls.localize('table_header_project_path')
                }
            ], messages_1.nls.localize(`lib_retrieve_result_title`));
        }
        if (failures.length > 0) {
            if (successes.length > 0) {
                output += '\n';
            }
            output += table.createTable(failures, [
                { key: 'fullName', label: messages_1.nls.localize('table_header_full_name') },
                { key: 'type', label: messages_1.nls.localize('table_header_type') },
                { key: 'error', label: messages_1.nls.localize('table_header_message') }
            ], messages_1.nls.localize('lib_retrieve_message_title'));
        }
        return output;
    }
}
exports.RetrieveExecutor = RetrieveExecutor;
//# sourceMappingURL=baseDeployRetrieve.js.map