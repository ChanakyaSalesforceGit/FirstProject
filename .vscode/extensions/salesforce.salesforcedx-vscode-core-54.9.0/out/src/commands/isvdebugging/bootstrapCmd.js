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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const AdmZip = require("adm-zip");
const fs = require("fs");
const path = require("path");
const sanitizeFilename = require("sanitize-filename");
const shell = require("shelljs");
const url_1 = require("url");
const vscode = require("vscode");
const channels_1 = require("../../channels");
const messages_1 = require("../../messages");
const notifications_1 = require("../../notifications");
const statuses_1 = require("../../statuses");
const forceProjectCreate_1 = require("../forceProjectCreate");
const util_1 = require("../util");
class IsvDebugBootstrapExecutor extends util_1.SfdxCommandletExecutor {
    constructor() {
        super(...arguments);
        this.relativeMetdataTempPath = path.join('.sfdx', 'tools', 'isvdebuggermdapitmp');
        this.relativeApexPackageXmlPath = path.join(this.relativeMetdataTempPath, 'package.xml');
        this.relativeInstalledPackagesPath = path.join('.sfdx', 'tools', 'installed-packages');
    }
    build(data) {
        throw new Error('not in use');
    }
    buildCreateProjectCommand(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step1_create_project'))
            .withArg('force:project:create')
            .withFlag('--projectname', data.projectName)
            .withFlag('--outputdir', data.projectUri)
            .withFlag('--template', 'standard')
            .withLogName('isv_debug_bootstrap_create_project')
            .build();
    }
    buildConfigureProjectCommand(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step2_configure_project'))
            .withArg('force:config:set')
            .withArg(`isvDebuggerSid=${data.sessionId}`)
            .withArg(`isvDebuggerUrl=${data.loginUrl}`)
            .withArg(`instanceUrl=${data.loginUrl}`)
            .withLogName('isv_debug_bootstrap_configure_project')
            .build();
    }
    buildQueryForOrgNamespacePrefixCommand(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step2_configure_project_retrieve_namespace'))
            .withArg('force:data:soql:query')
            .withFlag('--query', 'SELECT NamespacePrefix FROM Organization LIMIT 1')
            .withFlag('--targetusername', data.sessionId)
            .withJson()
            .withLogName('isv_debug_bootstrap_configure_project_retrieve_namespace')
            .build();
    }
    parseOrgNamespaceQueryResultJson(orgNamespaceQueryJson) {
        const orgNamespaceQueryResponse = JSON.parse(orgNamespaceQueryJson);
        if (orgNamespaceQueryResponse.result &&
            orgNamespaceQueryResponse.result.records &&
            orgNamespaceQueryResponse.result.records[0] &&
            typeof orgNamespaceQueryResponse.result.records[0].NamespacePrefix ===
                'string') {
            return orgNamespaceQueryResponse.result.records[0].NamespacePrefix;
        }
        return '';
    }
    buildRetrieveOrgSourceCommand(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step3_retrieve_org_source'))
            .withArg('force:mdapi:retrieve')
            .withFlag('--retrievetargetdir', this.relativeMetdataTempPath)
            .withFlag('--unpackaged', this.relativeApexPackageXmlPath)
            .withFlag('--targetusername', data.sessionId)
            .withLogName('isv_debug_bootstrap_retrieve_org_source')
            .build();
    }
    buildMetadataApiConvertOrgSourceCommand(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step4_convert_org_source'))
            .withArg('force:mdapi:convert')
            .withFlag('--rootdir', path.join(this.relativeMetdataTempPath, 'unpackaged'))
            .withFlag('--outputdir', 'force-app')
            .withLogName('isv_debug_bootstrap_convert_org_source')
            .build();
    }
    buildPackageInstalledListAsJsonCommand(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step5_list_installed_packages'))
            .withArg('force:package:installed:list')
            .withFlag('--targetusername', data.sessionId)
            .withJson()
            .withLogName('isv_debug_bootstrap_list_installed_packages')
            .build();
    }
    buildRetrievePackagesSourceCommand(data, packageNames) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step6_retrieve_packages_source'))
            .withArg('force:mdapi:retrieve')
            .withFlag('--retrievetargetdir', this.relativeMetdataTempPath)
            .withFlag('--packagenames', packageNames.join(','))
            .withFlag('--targetusername', data.sessionId)
            .withLogName('isv_debug_bootstrap_retrieve_packages_source')
            .build();
    }
    buildMetadataApiConvertPackageSourceCommand(packageName) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('isv_debug_bootstrap_step7_convert_package_source', packageName))
            .withArg('force:mdapi:convert')
            .withFlag('--rootdir', path.join(this.relativeMetdataTempPath, 'packages', packageName))
            .withFlag('--outputdir', path.join(this.relativeInstalledPackagesPath, packageName))
            .withLogName('isv_debug_bootstrap_convert_package_source')
            .build();
    }
    parsePackageInstalledListJson(packagesJson) {
        const packagesData = JSON.parse(packagesJson);
        return packagesData.result.map((entry) => {
            return {
                id: entry.SubscriberPackageId,
                name: entry.SubscriberPackageName,
                namespace: entry.SubscriberPackageNamespace,
                versionId: entry.SubscriberPackageVersionId,
                versionName: entry.SubscriberPackageVersionName,
                versionNumber: entry.SubscriberPackageVersionNumber
            };
        });
    }
    execute(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const cancellationTokenSource = new vscode.CancellationTokenSource();
            const cancellationToken = cancellationTokenSource.token;
            const projectParentPath = response.data.projectUri;
            const projectPath = path.join(projectParentPath, response.data.projectName);
            const projectMetadataTempPath = path.join(projectPath, this.relativeMetdataTempPath);
            const apexRetrievePackageXmlPath = path.join(projectPath, this.relativeApexPackageXmlPath);
            const projectInstalledPackagesPath = path.join(projectPath, this.relativeInstalledPackagesPath);
            // remove any previous project at this path location
            shell.rm('-rf', projectPath);
            // 1: create project
            yield this.executeCommand(this.buildCreateProjectCommand(response.data), { cwd: projectParentPath }, cancellationTokenSource, cancellationToken);
            // 2: configure project
            yield this.executeCommand(this.buildConfigureProjectCommand(response.data), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
            // 2b: update sfdx-project.json with namespace
            const orgNamespaceInfoResponseJson = yield this.executeCommand(this.buildQueryForOrgNamespacePrefixCommand(response.data), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
            try {
                const sfdxProjectJsonFile = path.join(projectPath, 'sfdx-project.json');
                const sfdxProjectConfig = JSON.parse(fs.readFileSync(sfdxProjectJsonFile, { encoding: 'utf-8' }));
                sfdxProjectConfig.namespace = this.parseOrgNamespaceQueryResultJson(orgNamespaceInfoResponseJson);
                fs.writeFileSync(sfdxProjectJsonFile, JSON.stringify(sfdxProjectConfig, null, 2), { encoding: 'utf-8' });
            }
            catch (error) {
                console.error(error);
                channels_1.channelService.appendLine(messages_1.nls.localize('error_updating_sfdx_project', error.toString()));
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_updating_sfdx_project', error.toString()));
                return;
            }
            // 3a: create package.xml for downloading org apex
            try {
                shell.mkdir('-p', projectMetadataTempPath);
                fs.writeFileSync(apexRetrievePackageXmlPath, `<?xml version="1.0" encoding="UTF-8"?>
<Package xmlns="http://soap.sforce.com/2006/04/metadata">
  <types>
    <members>*</members>
    <name>ApexClass</name>
  </types>
  <types>
    <members>*</members>
    <name>ApexTrigger</name>
  </types>
</Package>`, { encoding: 'utf-8' });
            }
            catch (error) {
                console.error(error);
                channels_1.channelService.appendLine(messages_1.nls.localize('error_creating_packagexml', error.toString()));
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_creating_packagexml', error.toString()));
                return;
            }
            // 3b: retrieve unmanged org source
            yield this.executeCommand(this.buildRetrieveOrgSourceCommand(response.data), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
            // 4a: unzip retrieved source
            try {
                const zip = new AdmZip(path.join(projectMetadataTempPath, 'unpackaged.zip'));
                zip.extractAllTo(projectMetadataTempPath, true);
            }
            catch (error) {
                console.error(error);
                channels_1.channelService.appendLine(messages_1.nls.localize('error_extracting_org_source', error.toString()));
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_extracting_org_source', error.toString()));
                return;
            }
            // 4b: convert org source
            yield this.executeCommand(this.buildMetadataApiConvertOrgSourceCommand(response.data), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
            // 5: get list of installed packages
            const packagesJson = yield this.executeCommand(this.buildPackageInstalledListAsJsonCommand(response.data), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
            const packageInfos = this.parsePackageInstalledListJson(packagesJson);
            // 6: fetch packages
            yield this.executeCommand(this.buildRetrievePackagesSourceCommand(response.data, packageInfos.map(entry => entry.name)), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
            // 7a: unzip downloaded packages into temp location
            try {
                const packagesTempPath = path.join(projectMetadataTempPath, 'packages');
                shell.mkdir('-p', packagesTempPath);
                shell.mkdir('-p', projectInstalledPackagesPath);
                const zip = new AdmZip(path.join(projectMetadataTempPath, 'unpackaged.zip'));
                zip.extractAllTo(packagesTempPath, true);
            }
            catch (error) {
                console.error(error);
                channels_1.channelService.appendLine(messages_1.nls.localize('error_extracting_packages', error.toString()));
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_extracting_packages', error.toString()));
                return;
            }
            // 7b: convert packages into final location
            for (const packageInfo of packageInfos) {
                channels_1.channelService.appendLine(messages_1.nls.localize('isv_debug_bootstrap_processing_package', packageInfo.name));
                yield this.executeCommand(this.buildMetadataApiConvertPackageSourceCommand(packageInfo.name), { cwd: projectPath }, cancellationTokenSource, cancellationToken);
                // generate installed-package.json file
                try {
                    fs.writeFileSync(path.join(projectInstalledPackagesPath, packageInfo.name, 'installed-package.json'), JSON.stringify(packageInfo, null, 2), { encoding: 'utf-8' });
                }
                catch (error) {
                    console.error(error);
                    channels_1.channelService.appendLine(messages_1.nls.localize('error_writing_installed_package_info', error.toString()));
                    notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_writing_installed_package_info', error.toString()));
                    return;
                }
            }
            // 7c: cleanup temp files
            try {
                shell.rm('-rf', projectMetadataTempPath);
            }
            catch (error) {
                console.error(error);
                channels_1.channelService.appendLine(messages_1.nls.localize('error_cleanup_temp_files', error.toString()));
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_cleanup_temp_files', error.toString()));
                return;
            }
            // 8: generate launch configuration
            channels_1.channelService.appendLine(messages_1.nls.localize('isv_debug_bootstrap_generate_launchjson'));
            try {
                const projectVsCodeFolder = path.join(projectPath, '.vscode');
                shell.mkdir('-p', projectVsCodeFolder);
                fs.writeFileSync(path.join(projectVsCodeFolder, 'launch.json'), 
                // mostly duplicated from ApexDebuggerConfigurationProvider to avoid hard dependency from core to debugger module
                JSON.stringify({
                    version: '0.2.0',
                    configurations: [
                        {
                            name: 'Launch Apex Debugger',
                            type: 'apex',
                            request: 'launch',
                            userIdFilter: [],
                            requestTypeFilter: [],
                            entryPointFilter: '',
                            sfdxProject: '${workspaceRoot}',
                            connectType: 'ISV_DEBUGGER'
                        }
                    ]
                }, null, 2), { encoding: 'utf-8' });
            }
            catch (error) {
                console.error(error);
                channels_1.channelService.appendLine(messages_1.nls.localize('error_creating_launchjson', error.toString()));
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('error_creating_launchjson', error.toString()));
                return;
            }
            // last step: open the folder in VS Code
            channels_1.channelService.appendLine(messages_1.nls.localize('isv_debug_bootstrap_open_project'));
            yield vscode.commands.executeCommand('vscode.openFolder', vscode.Uri.file(projectPath));
        });
    }
    executeCommand(command, options, cancellationTokenSource, cancellationToken) {
        return __awaiter(this, void 0, void 0, function* () {
            const startTime = process.hrtime();
            // do not inherit global env because we are setting our own auth
            const execution = new cli_1.CliCommandExecutor(command, options, false).execute(cancellationToken);
            const result = new cli_1.CommandOutput().getCmdResult(execution);
            this.attachExecution(execution, cancellationTokenSource, cancellationToken);
            execution.processExitSubject.subscribe(() => {
                this.logMetric(execution.command.logName, startTime);
            });
            return result;
        });
    }
    attachExecution(execution, cancellationTokenSource, cancellationToken) {
        channels_1.channelService.streamCommandOutput(execution);
        channels_1.channelService.showChannelOutput();
        notifications_1.notificationService.reportExecutionError(execution.command.toString(), execution.stderrSubject);
        notifications_1.ProgressNotification.show(execution, cancellationTokenSource);
        statuses_1.taskViewService.addCommandExecution(execution, cancellationTokenSource);
    }
}
exports.IsvDebugBootstrapExecutor = IsvDebugBootstrapExecutor;
class EnterForceIdeUri {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const forceIdeUri = yield vscode.window.showInputBox({
                prompt: messages_1.nls.localize('parameter_gatherer_paste_forceide_url'),
                placeHolder: messages_1.nls.localize('parameter_gatherer_paste_forceide_url_placeholder'),
                ignoreFocusOut: true,
                validateInput: EnterForceIdeUri.uriValidator
            });
            if (forceIdeUri) {
                const url = new url_1.URL(forceIdeUri);
                const parameter = url.searchParams;
                const loginUrl = parameter.get('url');
                const sessionId = parameter.get('sessionId');
                if (loginUrl && sessionId) {
                    const protocolPrefix = parameter.get('secure') === '0' ? 'http://' : 'https://';
                    this.forceIdUrl = {
                        loginUrl: loginUrl.toLowerCase().startsWith('http')
                            ? loginUrl
                            : protocolPrefix + loginUrl,
                        sessionId,
                        orgName: url.hostname
                    };
                    return {
                        type: 'CONTINUE',
                        data: this.forceIdUrl
                    };
                }
                vscode.window.showErrorMessage(messages_1.nls.localize('parameter_gatherer_invalid_forceide_url'));
            }
            return { type: 'CANCEL' };
        });
    }
}
exports.EnterForceIdeUri = EnterForceIdeUri;
EnterForceIdeUri.uriValidator = (value) => {
    try {
        const url = new url_1.URL(value);
        const parameter = url.searchParams;
        const loginUrl = parameter.get('url');
        const sessionId = parameter.get('sessionId');
        if (typeof loginUrl !== 'string' || typeof sessionId !== 'string') {
            return messages_1.nls.localize('parameter_gatherer_invalid_forceide_url');
        }
    }
    catch (e) {
        return messages_1.nls.localize('parameter_gatherer_invalid_forceide_url');
    }
    return null; // all good
};
const forceIdeUrlGatherer = new EnterForceIdeUri();
const workspaceChecker = new util_1.EmptyPreChecker();
const parameterGatherer = new util_1.CompositeParametersGatherer(forceIdeUrlGatherer, new forceProjectCreate_1.SelectProjectName(() => {
    if (forceIdeUrlGatherer.forceIdUrl &&
        forceIdeUrlGatherer.forceIdUrl.orgName) {
        return sanitizeFilename(forceIdeUrlGatherer.forceIdUrl.orgName.replace(/[\+]/g, '_'));
    }
    return '';
}), new forceProjectCreate_1.SelectProjectFolder());
const pathExistsChecker = new forceProjectCreate_1.PathExistsChecker();
const executor = new IsvDebugBootstrapExecutor();
const commandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, executor, pathExistsChecker);
function isvDebugBootstrap() {
    return __awaiter(this, void 0, void 0, function* () {
        yield commandlet.run();
    });
}
exports.isvDebugBootstrap = isvDebugBootstrap;
//# sourceMappingURL=bootstrapCmd.js.map