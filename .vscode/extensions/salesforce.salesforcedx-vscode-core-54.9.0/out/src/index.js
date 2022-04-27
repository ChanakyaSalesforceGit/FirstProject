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
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const vscode = require("vscode");
const channels_1 = require("./channels");
const commands_1 = require("./commands");
const forceStartApexDebugLogging_1 = require("./commands/forceStartApexDebugLogging");
const functionService_1 = require("./commands/functions/functionService");
const isvdebugging_1 = require("./commands/isvdebugging");
const util_1 = require("./commands/util");
const conflict_1 = require("./conflict");
const constants_1 = require("./constants");
const context_1 = require("./context");
const context_2 = require("./context");
const decorators = require("./decorators");
const demo_mode_1 = require("./modes/demo-mode");
const notifications_1 = require("./notifications");
const orgBrowser_1 = require("./orgBrowser");
const orgPicker_1 = require("./orgPicker");
const predicates_1 = require("./predicates");
const settings_1 = require("./settings");
const statuses_1 = require("./statuses");
const telemetry_1 = require("./telemetry");
const util_2 = require("./util");
const authInfo_1 = require("./util/authInfo");
const flagOverwrite = {
    flag: '--forceoverwrite'
};
const flagLegacy = {
    commandVersion: util_1.CommandVersion.Legacy
};
const flagLegacyOverwrite = {
    flag: '--forceoverwrite',
    commandVersion: util_1.CommandVersion.Legacy
};
const flagStatusLocal = {
    flag: commands_1.SourceStatusFlags.Local
};
const flagStatusRemote = {
    flag: commands_1.SourceStatusFlags.Remote
};
function registerCommands(extensionContext) {
    // Customer-facing commands
    const forceAuthAccessTokenCmd = vscode.commands.registerCommand('sfdx.force.auth.accessToken', commands_1.forceAuthAccessToken);
    const forceAuthWebLoginCmd = vscode.commands.registerCommand('sfdx.force.auth.web.login', commands_1.forceAuthWebLogin);
    const forceAuthDevHubCmd = vscode.commands.registerCommand('sfdx.force.auth.dev.hub', commands_1.forceAuthDevHub);
    const forceAuthLogoutAllCmd = vscode.commands.registerCommand('sfdx.force.auth.logout.all', commands_1.forceAuthLogoutAll);
    const forceAuthLogoutDefaultCmd = vscode.commands.registerCommand('sfdx.force.auth.logout.default', commands_1.forceAuthLogoutDefault);
    const forceOrgCreateCmd = vscode.commands.registerCommand('sfdx.force.org.create', commands_1.forceOrgCreate);
    const forceOrgOpenCmd = vscode.commands.registerCommand('sfdx.force.org.open', commands_1.forceOrgOpen);
    const forceSourceDeleteCmd = vscode.commands.registerCommand('sfdx.force.source.delete', commands_1.forceSourceDelete);
    const forceSourceDeleteCurrentFileCmd = vscode.commands.registerCommand('sfdx.force.source.delete.current.file', commands_1.forceSourceDelete);
    const forceSourceDeployCurrentSourceFileCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.current.source.file', commands_1.forceSourceDeploySourcePaths);
    const forceSourceDeployInManifestCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.in.manifest', commands_1.forceSourceDeployManifest);
    const forceSourceDeployMultipleSourcePathsCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.multiple.source.paths', commands_1.forceSourceDeploySourcePaths);
    const forceSourceDeploySourcePathCmd = vscode.commands.registerCommand('sfdx.force.source.deploy.source.path', commands_1.forceSourceDeploySourcePaths);
    const forceSourcePullCmd = vscode.commands.registerCommand('sfdx.force.source.pull', commands_1.forceSourcePull);
    const forceSourcePullForceCmd = vscode.commands.registerCommand('sfdx.force.source.pull.force', commands_1.forceSourcePull, flagOverwrite);
    const forceSourceLegacyPullCmd = vscode.commands.registerCommand('sfdx.force.source.legacy.pull', commands_1.forceSourcePull, flagLegacy);
    const forceSourceLegacyPullForceCmd = vscode.commands.registerCommand('sfdx.force.source.legacy.pull.force', commands_1.forceSourcePull, flagLegacyOverwrite);
    const forceSourcePushCmd = vscode.commands.registerCommand('sfdx.force.source.push', commands_1.forceSourcePush);
    const forceSourcePushForceCmd = vscode.commands.registerCommand('sfdx.force.source.push.force', commands_1.forceSourcePush, flagOverwrite);
    const forceSourceLegacyPushCmd = vscode.commands.registerCommand('sfdx.force.source.legacy.push', commands_1.forceSourcePush, flagLegacy);
    const forceSourceLegacyPushForceCmd = vscode.commands.registerCommand('sfdx.force.source.legacy.push.force', commands_1.forceSourcePush, flagLegacyOverwrite);
    const forceSourceRetrieveCmd = vscode.commands.registerCommand('sfdx.force.source.retrieve.source.path', commands_1.forceSourceRetrieveSourcePaths);
    const forceSourceRetrieveCurrentFileCmd = vscode.commands.registerCommand('sfdx.force.source.retrieve.current.source.file', commands_1.forceSourceRetrieveSourcePaths);
    const forceSourceRetrieveInManifestCmd = vscode.commands.registerCommand('sfdx.force.source.retrieve.in.manifest', commands_1.forceSourceRetrieveManifest);
    const forceSourceStatusCmd = vscode.commands.registerCommand('sfdx.force.source.status', commands_1.forceSourceStatus);
    const forceSourceStatusLocalCmd = vscode.commands.registerCommand('sfdx.force.source.status.local', commands_1.forceSourceStatus, flagStatusLocal);
    const forceSourceStatusRemoteCmd = vscode.commands.registerCommand('sfdx.force.source.status.remote', commands_1.forceSourceStatus, flagStatusRemote);
    const forceSourceLegacyStatusCmd = vscode.commands.registerCommand('sfdx.force.source.legacy.status', commands_1.forceSourceStatus, flagLegacy);
    const forceTaskStopCmd = vscode.commands.registerCommand('sfdx.force.task.stop', commands_1.forceTaskStop);
    const forceApexClassCreateCmd = vscode.commands.registerCommand('sfdx.force.apex.class.create', commands_1.forceApexClassCreate);
    const forceAnalyticsTemplateCreateCmd = vscode.commands.registerCommand('sfdx.force.analytics.template.create', commands_1.forceAnalyticsTemplateCreate);
    const forceVisualforceComponentCreateCmd = vscode.commands.registerCommand('sfdx.force.visualforce.component.create', commands_1.forceVisualforceComponentCreate);
    const forceVisualforcePageCreateCmd = vscode.commands.registerCommand('sfdx.force.visualforce.page.create', commands_1.forceVisualforcePageCreate);
    const forceLightningAppCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.app.create', commands_1.forceLightningAppCreate);
    const forceLightningComponentCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.component.create', commands_1.forceLightningComponentCreate);
    const forceLightningEventCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.event.create', commands_1.forceLightningEventCreate);
    const forceLightningInterfaceCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.interface.create', commands_1.forceLightningInterfaceCreate);
    const forceLightningLwcCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.lwc.create', commands_1.forceLightningLwcCreate);
    const forceLightningLwcTestCreateCmd = vscode.commands.registerCommand('sfdx.force.lightning.lwc.test.create', commands_1.forceLightningLwcTestCreate);
    const forceDebuggerStopCmd = vscode.commands.registerCommand('sfdx.force.debugger.stop', commands_1.forceDebuggerStop);
    const forceConfigListCmd = vscode.commands.registerCommand('sfdx.force.config.list', commands_1.forceConfigList);
    const forceAliasListCmd = vscode.commands.registerCommand('sfdx.force.alias.list', commands_1.forceAliasList);
    const forceOrgDeleteDefaultCmd = vscode.commands.registerCommand('sfdx.force.org.delete.default', commands_1.forceOrgDelete);
    const forceOrgDeleteUsernameCmd = vscode.commands.registerCommand('sfdx.force.org.delete.username', commands_1.forceOrgDelete, { flag: '--targetusername' });
    const forceOrgDisplayDefaultCmd = vscode.commands.registerCommand('sfdx.force.org.display.default', commands_1.forceOrgDisplay);
    const forceOrgDisplayUsernameCmd = vscode.commands.registerCommand('sfdx.force.org.display.username', commands_1.forceOrgDisplay, { flag: '--targetusername' });
    const forceOrgListCleanCmd = vscode.commands.registerCommand('sfdx.force.org.list.clean', commands_1.forceOrgList);
    const forceDataSoqlQueryInputCmd = vscode.commands.registerCommand('sfdx.force.data.soql.query.input', commands_1.forceDataSoqlQuery);
    const forceDataSoqlQuerySelectionCmd = vscode.commands.registerCommand('sfdx.force.data.soql.query.selection', commands_1.forceDataSoqlQuery);
    const forceProjectCreateCmd = vscode.commands.registerCommand('sfdx.force.project.create', commands_1.forceSfdxProjectCreate);
    const forcePackageInstallCmd = vscode.commands.registerCommand('sfdx.force.package.install', commands_1.forcePackageInstall);
    const forceProjectWithManifestCreateCmd = vscode.commands.registerCommand('sfdx.force.project.with.manifest.create', commands_1.forceProjectWithManifestCreate);
    const forceApexTriggerCreateCmd = vscode.commands.registerCommand('sfdx.force.apex.trigger.create', commands_1.forceApexTriggerCreate);
    const forceStartApexDebugLoggingCmd = vscode.commands.registerCommand('sfdx.force.start.apex.debug.logging', commands_1.forceStartApexDebugLogging);
    const forceStopApexDebugLoggingCmd = vscode.commands.registerCommand('sfdx.force.stop.apex.debug.logging', commands_1.forceStopApexDebugLogging);
    const isvDebugBootstrapCmd = vscode.commands.registerCommand('sfdx.debug.isv.bootstrap', isvdebugging_1.isvDebugBootstrap);
    const forceConfigSetCmd = vscode.commands.registerCommand('sfdx.force.config.set', commands_1.forceConfigSet);
    const forceDiffFile = vscode.commands.registerCommand('sfdx.force.diff', commands_1.forceSourceDiff);
    const forceDiffFolder = vscode.commands.registerCommand('sfdx.force.folder.diff', commands_1.forceSourceFolderDiff);
    const forceFunctionCreateCmd = vscode.commands.registerCommand('sfdx.force.function.create', commands_1.forceFunctionCreate);
    const forceFunctionStartCmd = vscode.commands.registerCommand('sfdx.force.function.containerless.start', commands_1.forceFunctionContainerlessStartCommand);
    const forceFunctionContainerStartCmd = vscode.commands.registerCommand('sfdx.force.function.container.start', commands_1.forceFunctionContainerStartCommand);
    const forceFunctionInvokeCmd = vscode.commands.registerCommand('sfdx.force.function.invoke', commands_1.forceFunctionInvoke);
    const forceFunctionDebugInvokeCmd = vscode.commands.registerCommand('sfdx.force.function.debugInvoke', commands_1.forceFunctionDebugInvoke);
    const forceFunctionStopCmd = vscode.commands.registerCommand('sfdx.force.function.stop', commands_1.forceFunctionStop);
    const forceRefreshSObjectsCmd = vscode.commands.registerCommand('sfdx.force.internal.refreshsobjects', commands_1.forceRefreshSObjects);
    const forceRenameComponentCmd = vscode.commands.registerCommand('sfdx.lightning.rename', commands_1.forceRenameLightningComponent);
    return vscode.Disposable.from(forceAuthAccessTokenCmd, forceAuthWebLoginCmd, forceAuthDevHubCmd, forceAuthLogoutAllCmd, forceAuthLogoutDefaultCmd, forceDataSoqlQueryInputCmd, forceDataSoqlQuerySelectionCmd, forceDiffFile, forceFunctionCreateCmd, forceFunctionInvokeCmd, forceFunctionDebugInvokeCmd, forceFunctionStartCmd, forceFunctionContainerStartCmd, forceFunctionStopCmd, forceOrgCreateCmd, forceOrgOpenCmd, forceOrgDeleteDefaultCmd, forceOrgDeleteUsernameCmd, forceOrgListCleanCmd, forceRefreshSObjectsCmd, forceSourceDeleteCmd, forceSourceDeleteCurrentFileCmd, forceSourceDeployCurrentSourceFileCmd, forceSourceDeployInManifestCmd, forceSourceDeployMultipleSourcePathsCmd, forceSourceDeploySourcePathCmd, forceSourcePullCmd, forceSourcePullForceCmd, forceSourceLegacyPullCmd, forceSourceLegacyPullForceCmd, forceSourcePushCmd, forceSourcePushForceCmd, forceSourceLegacyPushCmd, forceSourceLegacyPushForceCmd, forceSourceRetrieveCmd, forceSourceRetrieveCurrentFileCmd, forceSourceRetrieveInManifestCmd, forceSourceStatusCmd, forceSourceStatusLocalCmd, forceSourceStatusRemoteCmd, forceSourceLegacyStatusCmd, forceTaskStopCmd, forceApexClassCreateCmd, forceAnalyticsTemplateCreateCmd, forceVisualforceComponentCreateCmd, forceVisualforcePageCreateCmd, forceLightningAppCreateCmd, forceLightningComponentCreateCmd, forceLightningEventCreateCmd, forceLightningInterfaceCreateCmd, forceLightningLwcCreateCmd, forceLightningLwcTestCreateCmd, forceDebuggerStopCmd, forceConfigListCmd, forceAliasListCmd, forceOrgDisplayDefaultCmd, forceOrgDisplayUsernameCmd, forceProjectCreateCmd, forcePackageInstallCmd, forceProjectWithManifestCreateCmd, forceApexTriggerCreateCmd, forceStartApexDebugLoggingCmd, forceStopApexDebugLoggingCmd, isvDebugBootstrapCmd, forceConfigSetCmd);
}
function registerInternalDevCommands(extensionContext) {
    const forceInternalLightningAppCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.app.create', commands_1.forceInternalLightningAppCreate);
    const forceInternalLightningComponentCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.component.create', commands_1.forceInternalLightningComponentCreate);
    const forceInternalLightningEventCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.event.create', commands_1.forceInternalLightningEventCreate);
    const forceInternalLightningInterfaceCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.interface.create', commands_1.forceInternalLightningInterfaceCreate);
    const forceInternalLightningLwcCreateCmd = vscode.commands.registerCommand('sfdx.internal.lightning.lwc.create', commands_1.forceInternalLightningLwcCreate);
    return vscode.Disposable.from(forceInternalLightningComponentCreateCmd, forceInternalLightningLwcCreateCmd, forceInternalLightningAppCreateCmd, forceInternalLightningEventCreateCmd, forceInternalLightningInterfaceCreateCmd);
}
function registerOrgPickerCommands(orgList) {
    const forceSetDefaultOrgCmd = vscode.commands.registerCommand('sfdx.force.set.default.org', () => orgList.setDefaultOrg());
    return vscode.Disposable.from(forceSetDefaultOrgCmd);
}
function setupOrgBrowser(extensionContext) {
    return __awaiter(this, void 0, void 0, function* () {
        yield orgBrowser_1.orgBrowser.init(extensionContext);
        vscode.commands.registerCommand('sfdx.force.metadata.view.type.refresh', (node) => __awaiter(this, void 0, void 0, function* () {
            yield orgBrowser_1.orgBrowser.refreshAndExpand(node);
        }));
        vscode.commands.registerCommand('sfdx.force.metadata.view.component.refresh', (node) => __awaiter(this, void 0, void 0, function* () {
            yield orgBrowser_1.orgBrowser.refreshAndExpand(node);
        }));
        vscode.commands.registerCommand('sfdx.force.source.retrieve.component', (trigger) => __awaiter(this, void 0, void 0, function* () {
            yield commands_1.forceSourceRetrieveCmp(trigger);
        }));
        vscode.commands.registerCommand('sfdx.force.source.retrieve.open.component', (trigger) => __awaiter(this, void 0, void 0, function* () {
            yield commands_1.forceSourceRetrieveCmp(trigger, true);
        }));
        vscode.commands.registerCommand('sfdx.create.manifest', commands_1.forceCreateManifest);
    });
}
function activate(context) {
    return __awaiter(this, void 0, void 0, function* () {
        const extensionHRStart = process.hrtime();
        const { name, aiKey, version } = require(context.asAbsolutePath('./package.json'));
        yield telemetry_1.telemetryService.initializeService(context, name, aiKey, version);
        telemetry_1.showTelemetryMessage(context);
        // Task View
        const treeDataProvider = vscode.window.registerTreeDataProvider('sfdx.force.tasks.view', statuses_1.taskViewService);
        context.subscriptions.push(treeDataProvider);
        // Set internal dev context
        const internalDev = settings_1.sfdxCoreSettings.getInternalDev();
        vscode.commands.executeCommand('setContext', 'sfdx:internal_dev', internalDev);
        if (internalDev) {
            // Internal Dev commands
            const internalCommands = registerInternalDevCommands(context);
            context.subscriptions.push(internalCommands);
            // Api
            const internalApi = {
                channelService: channels_1.channelService,
                EmptyParametersGatherer: util_1.EmptyParametersGatherer,
                isCLIInstalled: util_2.isCLIInstalled,
                notificationService: notifications_1.notificationService,
                OrgAuthInfo: authInfo_1.OrgAuthInfo,
                ProgressNotification: notifications_1.ProgressNotification,
                SfdxCommandlet: util_1.SfdxCommandlet,
                SfdxCommandletExecutor: util_1.SfdxCommandletExecutor,
                sfdxCoreSettings: settings_1.sfdxCoreSettings,
                SfdxWorkspaceChecker: util_1.SfdxWorkspaceChecker,
                telemetryService: telemetry_1.telemetryService
            };
            telemetry_1.telemetryService.sendExtensionActivationEvent(extensionHRStart);
            console.log('SFDX CLI Extension Activated (internal dev mode)');
            return internalApi;
        }
        functionService_1.FunctionService.instance.handleDidStartTerminateDebugSessions(context);
        // Context
        const sfdxProjectOpened = predicates_1.isSfdxProjectOpened.apply(vscode.workspace).result;
        // TODO: move this and the replay debugger commands to the apex extension
        let replayDebuggerExtensionInstalled = false;
        if (vscode.extensions.getExtension('salesforce.salesforcedx-vscode-apex-replay-debugger')) {
            replayDebuggerExtensionInstalled = true;
        }
        vscode.commands.executeCommand('setContext', 'sfdx:replay_debugger_extension', replayDebuggerExtensionInstalled);
        vscode.commands.executeCommand('setContext', 'sfdx:project_opened', sfdxProjectOpened);
        if (sfdxProjectOpened) {
            yield context_2.workspaceContext.initialize(context);
            // register org picker commands
            const orgList = new orgPicker_1.OrgList();
            context.subscriptions.push(registerOrgPickerCommands(orgList));
            yield setupOrgBrowser(context);
            yield conflict_1.setupConflictView(context);
            conflict_1.PersistentStorageService.initialize(context);
            // Register filewatcher for push or deploy on save
            yield settings_1.registerPushOrDeployOnSave();
            decorators.showOrg();
            decorators.monitorOrgConfigChanges();
            // Demo mode Decorator
            if (demo_mode_1.isDemoMode()) {
                decorators.showDemoMode();
            }
        }
        // Commands
        const commands = registerCommands(context);
        context.subscriptions.push(commands);
        context.subscriptions.push(conflict_1.registerConflictView());
        const api = {
            channelService: channels_1.channelService,
            CompositeParametersGatherer: util_1.CompositeParametersGatherer,
            EmptyParametersGatherer: util_1.EmptyParametersGatherer,
            getDefaultUsernameOrAlias: context_1.getDefaultUsernameOrAlias,
            getUserId: forceStartApexDebugLogging_1.getUserId,
            isCLIInstalled: util_2.isCLIInstalled,
            notificationService: notifications_1.notificationService,
            OrgAuthInfo: authInfo_1.OrgAuthInfo,
            ProgressNotification: notifications_1.ProgressNotification,
            SelectFileName: util_1.SelectFileName,
            SelectOutputDir: util_1.SelectOutputDir,
            SfdxCommandlet: util_1.SfdxCommandlet,
            SfdxCommandletExecutor: util_1.SfdxCommandletExecutor,
            sfdxCoreSettings: settings_1.sfdxCoreSettings,
            SfdxWorkspaceChecker: util_1.SfdxWorkspaceChecker,
            workspaceContext: context_2.workspaceContext,
            taskViewService: statuses_1.taskViewService,
            telemetryService: telemetry_1.telemetryService
        };
        commands_1.registerFunctionInvokeCodeLensProvider(context);
        telemetry_1.telemetryService.sendExtensionActivationEvent(extensionHRStart);
        console.log('SFDX CLI Extension Activated');
        // Refresh SObject definitions if there aren't any faux classes
        const sobjectRefreshStartup = vscode.workspace
            .getConfiguration(constants_1.SFDX_CORE_CONFIGURATION_NAME)
            .get(constants_1.ENABLE_SOBJECT_REFRESH_ON_STARTUP, false);
        if (sobjectRefreshStartup) {
            commands_1.initSObjectDefinitions(vscode.workspace.workspaceFolders[0].uri.fsPath).catch(e => telemetry_1.telemetryService.sendException(e.name, e.message));
        }
        else {
            commands_1.checkSObjectsAndRefresh(vscode.workspace.workspaceFolders[0].uri.fsPath).catch(e => telemetry_1.telemetryService.sendException(e.name, e.message));
        }
        return api;
    });
}
exports.activate = activate;
function deactivate() {
    console.log('SFDX CLI Extension Deactivated');
    // Send metric data.
    telemetry_1.telemetryService.sendExtensionDeactivationEvent();
    telemetry_1.telemetryService.dispose();
    decorators.disposeTraceFlagExpiration();
    return commands_1.turnOffLogging();
}
exports.deactivate = deactivate;
//# sourceMappingURL=index.js.map