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
const lightning_lsp_common_1 = require("@salesforce/lightning-lsp-common");
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/");
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const commands_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/commands");
const fs = require("fs");
const path = require("path");
const vscode = require("vscode");
const channel_1 = require("../channel");
const messages_1 = require("../messages");
const devServerService_1 = require("../service/devServerService");
const previewService_1 = require("../service/previewService");
const telemetry_1 = require("../telemetry");
const commandUtils_1 = require("./commandUtils");
const forceLightningLwcStart_1 = require("./forceLightningLwcStart");
var PreviewPlatformType;
(function (PreviewPlatformType) {
    PreviewPlatformType[PreviewPlatformType["Desktop"] = 1] = "Desktop";
    PreviewPlatformType[PreviewPlatformType["Android"] = 2] = "Android";
    PreviewPlatformType[PreviewPlatformType["iOS"] = 3] = "iOS";
})(PreviewPlatformType || (PreviewPlatformType = {}));
var PlatformName;
(function (PlatformName) {
    PlatformName["Desktop"] = "Desktop";
    PlatformName["Android"] = "Android";
    PlatformName["iOS"] = "iOS";
})(PlatformName = exports.PlatformName || (exports.PlatformName = {}));
exports.platformOptions = [
    {
        label: messages_1.nls.localize('force_lightning_lwc_preview_desktop_label'),
        detail: messages_1.nls.localize('force_lightning_lwc_preview_desktop_description'),
        alwaysShow: true,
        picked: true,
        id: PreviewPlatformType.Desktop,
        platformName: "Desktop" /* Desktop */,
        defaultTargetName: ''
    },
    {
        label: messages_1.nls.localize('force_lightning_lwc_android_label'),
        detail: messages_1.nls.localize('force_lightning_lwc_android_description'),
        alwaysShow: true,
        picked: false,
        id: PreviewPlatformType.Android,
        platformName: "Android" /* Android */,
        defaultTargetName: 'SFDXEmulator'
    },
    {
        label: messages_1.nls.localize('force_lightning_lwc_ios_label'),
        detail: messages_1.nls.localize('force_lightning_lwc_ios_description'),
        alwaysShow: true,
        picked: false,
        id: PreviewPlatformType.iOS,
        platformName: "iOS" /* iOS */,
        defaultTargetName: 'SFDXSimulator'
    }
];
const logName = 'force_lightning_lwc_preview';
const commandName = messages_1.nls.localize('force_lightning_lwc_preview_text');
const sfdxDeviceListCommand = 'force:lightning:local:device:list';
const sfdxMobilePreviewCommand = 'force:lightning:lwc:preview';
const androidSuccessString = 'Launching... Opening Browser';
function forceLightningLwcPreview(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = process.hrtime();
        if (!sourceUri) {
            if (vscode.window.activeTextEditor) {
                sourceUri = vscode.window.activeTextEditor.document.uri;
            }
            else {
                const message = messages_1.nls.localize('force_lightning_lwc_preview_file_undefined', sourceUri);
                commandUtils_1.showError(new Error(message), logName, commandName);
                return;
            }
        }
        const resourcePath = sourceUri.fsPath;
        if (!resourcePath) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_file_undefined', resourcePath);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        if (!fs.existsSync(resourcePath)) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_file_nonexist', resourcePath);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        const isSFDX = true; // TODO support non SFDX projects
        const isDirectory = fs.lstatSync(resourcePath).isDirectory();
        const componentName = isDirectory
            ? lightning_lsp_common_1.componentUtil.moduleFromDirectory(resourcePath, isSFDX)
            : lightning_lsp_common_1.componentUtil.moduleFromFile(resourcePath, isSFDX);
        if (!componentName) {
            const message = messages_1.nls.localize('force_lightning_lwc_preview_unsupported', resourcePath);
            commandUtils_1.showError(new Error(message), logName, commandName);
            return;
        }
        yield executePreview(startTime, componentName, resourcePath);
    });
}
exports.forceLightningLwcPreview = forceLightningLwcPreview;
/**
 * Performs the action of previewing the LWC. It takes care of prompting the user
 * and gathering all info needed to preview the LWC. This includes prompting the user
 * to select a platform, a target device, a target native app (or browser), etc.
 * Previewing on Android or iOS are handled by the @salesforce/lwc-dev-mobile sfdx package.
 *
 * @param startTime start time of the preview command
 * @param componentName name of the lwc
 * @param resourcePath path to the lwc
 */
function executePreview(startTime, componentName, resourcePath) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandCancelledMessage = messages_1.nls.localize('force_lightning_lwc_operation_cancelled');
        // 1. Prompt user to select a platform
        const platformSelection = yield selectPlatform();
        if (!platformSelection) {
            vscode.window.showWarningMessage(commandCancelledMessage);
            return;
        }
        if (platformSelection.id === PreviewPlatformType.Desktop) {
            yield startServer(true, componentName, startTime);
            return;
        }
        // 2. Prompt user to select a target device
        let targetDevice;
        try {
            const targetName = yield selectTargetDevice(platformSelection);
            if (targetName === undefined) {
                vscode.window.showInformationMessage(commandCancelledMessage);
                return;
            }
            else {
                targetDevice = targetName;
            }
        }
        catch (_a) {
            // exception has already been logged
            return;
        }
        // 3. Determine project root directory and path to the config file
        const projectRootDir = getProjectRootDirectory(resourcePath);
        const configFilePath = projectRootDir && path.join(projectRootDir, 'mobile-apps.json');
        // 4. Prompt user to select a target app (if any)
        const targetApp = yield selectTargetApp(platformSelection, configFilePath);
        if (targetApp === undefined) {
            vscode.window.showInformationMessage(commandCancelledMessage);
            return;
        }
        yield startServer(false, componentName, startTime);
        // 5. Preview on mobile device
        yield executeMobilePreview(platformSelection, targetDevice, targetApp, projectRootDir, configFilePath, componentName, startTime);
    });
}
/**
 * Starts the lwc server if it is not already running.
 *
 * @param isDesktop if desktop browser is selected
 * @param componentName name of the component to preview
 * @param startTime start time of the preview command
 */
function startServer(isDesktop, componentName, startTime) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!devServerService_1.DevServerService.instance.isServerHandlerRegistered()) {
            console.log(`${logName}: server was not running, starting...`);
            const preconditionChecker = new src_1.SfdxWorkspaceChecker();
            const parameterGatherer = new src_1.EmptyParametersGatherer();
            const executor = new forceLightningLwcStart_1.ForceLightningLwcStartExecutor({
                openBrowser: isDesktop,
                componentName
            });
            const commandlet = new src_1.SfdxCommandlet(preconditionChecker, parameterGatherer, executor);
            yield commandlet.run();
            telemetry_1.telemetryService.sendCommandEvent(logName, startTime);
        }
        else if (isDesktop) {
            try {
                const fullUrl = devServerService_1.DevServerService.instance.getComponentPreviewUrl(componentName);
                yield commandUtils_1.openBrowser(fullUrl);
                telemetry_1.telemetryService.sendCommandEvent(logName, startTime);
            }
            catch (e) {
                commandUtils_1.showError(e, logName, commandName);
            }
        }
    });
}
/**
 * Prompts the user to select a platform to preview the LWC on.
 * @returns the selected platform or undefined if no selection was made.
 */
function selectPlatform() {
    return __awaiter(this, void 0, void 0, function* () {
        const platformSelection = yield vscode.window.showQuickPick(exports.platformOptions, {
            placeHolder: messages_1.nls.localize('force_lightning_lwc_platform_selection')
        });
        return platformSelection;
    });
}
/**
 * Prompts the user to select a device to preview the LWC on.
 *
 * @param platformSelection the selected platform
 * @returns the name of the selected device or undefined if no selection was made.
 */
function selectTargetDevice(platformSelection) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAndroid = platformSelection.id === PreviewPlatformType.Android;
        const lastTarget = previewService_1.PreviewService.instance.getRememberedDevice(platformSelection.platformName);
        let target = platformSelection.defaultTargetName;
        let createDevicePlaceholderText = isAndroid
            ? messages_1.nls.localize('force_lightning_lwc_android_target_default')
            : messages_1.nls.localize('force_lightning_lwc_ios_target_default');
        // Remember device setting enabled and previous device retrieved.
        if (previewService_1.PreviewService.instance.isRememberedDeviceEnabled() && lastTarget) {
            const message = isAndroid
                ? 'force_lightning_lwc_android_target_remembered'
                : 'force_lightning_lwc_ios_target_remembered';
            createDevicePlaceholderText = messages_1.nls.localize(message, lastTarget);
            target = lastTarget;
        }
        const deviceListOutput = new cli_1.CommandOutput();
        const deviceListCommand = new cli_1.SfdxCommandBuilder()
            .withArg(sfdxDeviceListCommand)
            .withFlag('-p', platformSelection.platformName)
            .withJson()
            .build();
        let deviceListExecutionExitCode;
        const deviceListCancellationTokenSource = new vscode.CancellationTokenSource();
        const deviceListCancellationToken = deviceListCancellationTokenSource.token;
        const deviceListExecutor = new cli_1.CliCommandExecutor(deviceListCommand, {});
        const deviceListExecution = deviceListExecutor.execute(deviceListCancellationToken);
        deviceListExecution.processExitSubject.subscribe(exitCode => {
            deviceListExecutionExitCode = exitCode;
        });
        const items = [];
        const createNewDeviceItem = {
            label: messages_1.nls.localize('force_lightning_lwc_preview_create_virtual_device_label'),
            detail: messages_1.nls.localize('force_lightning_lwc_preview_create_virtual_device_detail'),
            name: messages_1.nls.localize('force_lightning_lwc_preview_create_virtual_device_label')
        };
        let targetName;
        try {
            const result = yield deviceListOutput.getCmdResult(deviceListExecution);
            const jsonString = result.substring(result.indexOf('{'));
            // populate quick pick list of devices from the parsed JSON data
            if (isAndroid) {
                const devices = JSON.parse(jsonString)
                    .result;
                devices.forEach(device => {
                    const label = device.displayName;
                    const detail = `${device.target}, ${device.api}`;
                    const name = device.name;
                    items.push({ label, detail, name });
                });
            }
            else {
                const devices = JSON.parse(jsonString)
                    .result;
                devices.forEach(device => {
                    const label = device.name;
                    const detail = device.runtimeId;
                    const name = device.name;
                    items.push({ label, detail, name });
                });
            }
        }
        catch (e) {
            // If device enumeration fails due to exit code 127
            // (i.e. lwc on mobile sfdx plugin is not installed)
            // then show an error message and exit. For other reasons,
            // silently fail and proceed with an empty list of devices.
            const error = String(e) || '';
            if (deviceListExecutionExitCode === 127 ||
                error.includes('not a sfdx command')) {
                commandUtils_1.showError(new Error(messages_1.nls.localize('force_lightning_lwc_no_mobile_plugin')), logName, commandName);
                throw e;
            }
        }
        // if there are any devices available, show a pick list.
        let selectedItem;
        if (items.length > 0) {
            items.unshift(createNewDeviceItem);
            selectedItem = yield vscode.window.showQuickPick(items, {
                placeHolder: messages_1.nls.localize('force_lightning_lwc_preview_select_virtual_device')
            });
            if (selectedItem === undefined) {
                // user cancelled operation
                return undefined;
            }
            else {
                targetName = selectedItem.name;
            }
        }
        // if there are no devices available or user chooses to create
        // a new device then show an inputbox and ask for further info.
        if (targetName === undefined || selectedItem === createNewDeviceItem) {
            targetName = yield vscode.window.showInputBox({
                placeHolder: createDevicePlaceholderText
            });
            if (targetName === undefined) {
                // user cancelled operation
                return undefined;
            }
        }
        // new target device entered
        if (targetName && targetName !== '') {
            previewService_1.PreviewService.instance.updateRememberedDevice(platformSelection.platformName, targetName);
            target = targetName;
        }
        return target;
    });
}
/**
 * Prompts the user to select an app to preview the LWC on. Defaults to browser.
 *
 * @param platformSelection the selected platform
 * @param configFile path to a config file
 * @returns the name of the selected device or undefined if user cancels selection.
 */
function selectTargetApp(platformSelection, configFile) {
    return __awaiter(this, void 0, void 0, function* () {
        let targetApp = 'browser';
        const items = [];
        const browserItem = {
            label: messages_1.nls.localize('force_lightning_lwc_browserapp_label'),
            detail: messages_1.nls.localize('force_lightning_lwc_browserapp_description')
        };
        if (configFile === undefined || fs.existsSync(configFile) === false) {
            return targetApp;
        }
        try {
            const fileContent = fs.readFileSync(configFile, 'utf8');
            const json = JSON.parse(fileContent);
            const appDefinitionsForSelectedPlatform = platformSelection.id === PreviewPlatformType.Android
                ? json.apps.android
                : json.apps.ios;
            const apps = Array.from(appDefinitionsForSelectedPlatform);
            apps.forEach(app => {
                const label = app.name;
                const detail = app.id;
                items.push({ label, detail });
            });
        }
        catch (_a) {
            // silengtly fail and default to previewing on browser
        }
        // if there are any devices available, show a pick list.
        if (items.length > 0) {
            items.unshift(browserItem);
            const selectedItem = yield vscode.window.showQuickPick(items, {
                placeHolder: messages_1.nls.localize('force_lightning_lwc_preview_select_target_app')
            });
            if (selectedItem) {
                // if user did not select the browser option then take the app id
                // from the detail property of the selected item
                if (selectedItem !== browserItem) {
                    targetApp = selectedItem.detail;
                }
            }
            else {
                // user cancelled operation
                targetApp = undefined;
            }
        }
        return targetApp;
    });
}
/**
 * Prompts the user to select a device to preview the LWC on.
 *
 * @param platformSelection the selected platform
 * @param targetDevice the selected device
 * @param targetApp the id of the native app to preview the component in, or browser
 * @param projectDir the path to the project root directory
 * @param configFile the path to the preview config file
 * @param componentName name of the component to preview
 * @param startTime start time of the preview command
 */
function executeMobilePreview(platformSelection, targetDevice, targetApp, projectDir, configFile, componentName, startTime) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAndroid = platformSelection.id === PreviewPlatformType.Android;
        let commandBuilder = new cli_1.SfdxCommandBuilder()
            .withDescription(commandName)
            .withArg(sfdxMobilePreviewCommand)
            .withFlag('-p', platformSelection.platformName)
            .withFlag('-t', targetDevice)
            .withFlag('-n', componentName)
            .withFlag('-a', targetApp);
        if (projectDir) {
            commandBuilder = commandBuilder.withFlag('-d', projectDir);
        }
        if (configFile && targetApp !== 'browser') {
            commandBuilder = commandBuilder.withFlag('-f', configFile);
        }
        const previewCommand = commandBuilder
            .withFlag('--loglevel', previewService_1.PreviewService.instance.getLogLevel())
            .build();
        const previewExecutor = new cli_1.CliCommandExecutor(previewCommand, {
            env: { SFDX_JSON_TO_STDOUT: 'true' }
        });
        const previewCancellationTokenSource = new vscode.CancellationTokenSource();
        const previewCancellationToken = previewCancellationTokenSource.token;
        const previewExecution = previewExecutor.execute(previewCancellationToken);
        telemetry_1.telemetryService.sendCommandEvent(logName, startTime);
        channel_1.channelService.streamCommandOutput(previewExecution);
        channel_1.channelService.showChannelOutput();
        previewExecution.processExitSubject.subscribe((exitCode) => __awaiter(this, void 0, void 0, function* () {
            if (exitCode !== 0) {
                const message = isAndroid
                    ? messages_1.nls.localize('force_lightning_lwc_android_failure', targetDevice)
                    : messages_1.nls.localize('force_lightning_lwc_ios_failure', targetDevice);
                commandUtils_1.showError(new Error(message), logName, commandName);
            }
            else if (!isAndroid) {
                commands_1.notificationService
                    .showSuccessfulExecution(previewExecution.command.toString(), channel_1.channelService)
                    .catch();
                vscode.window.showInformationMessage(messages_1.nls.localize('force_lightning_lwc_ios_start', targetDevice));
            }
        }));
        // TODO: Remove this when SFDX Plugin launches Android Emulator as separate process.
        // listen for Android Emulator finished
        if (isAndroid) {
            previewExecution.stdoutSubject.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
                if (data && data.toString().includes(androidSuccessString)) {
                    commands_1.notificationService
                        .showSuccessfulExecution(previewExecution.command.toString(), channel_1.channelService)
                        .catch();
                    vscode.window.showInformationMessage(messages_1.nls.localize('force_lightning_lwc_android_start', targetDevice));
                }
            }));
        }
    });
}
/**
 * Given a path, it recursively goes through that directory and upwards, until it finds
 * a config file named sfdx-project.json and returns the path to the folder containg it.
 *
 * @param startPath starting path to search for the config file.
 * @returns the path to the folder containing the config file, or undefined if config file not found
 */
function getProjectRootDirectory(startPath) {
    if (!fs.existsSync(startPath)) {
        return undefined;
    }
    const searchingForFile = 'sfdx-project.json';
    let dir = fs.lstatSync(startPath).isDirectory()
        ? startPath
        : path.dirname(startPath);
    while (dir) {
        const fileName = path.join(dir, searchingForFile);
        if (fs.existsSync(fileName)) {
            return dir;
        }
        else {
            dir = directoryLevelUp(dir);
        }
    }
    // couldn't determine the root dir
    return undefined;
}
exports.getProjectRootDirectory = getProjectRootDirectory;
/**
 * Given a path to a directory, returns a path that is one level up.
 *
 * @param directory path to a directory
 * @returns path to a directory that is one level up, or undefined if cannot go one level up.
 */
function directoryLevelUp(directory) {
    const levelUp = path.dirname(directory);
    if (levelUp === directory) {
        // we're at the root and can't go any further up
        return undefined;
    }
    return levelUp;
}
exports.directoryLevelUp = directoryLevelUp;
//# sourceMappingURL=forceLightningLwcPreview.js.map