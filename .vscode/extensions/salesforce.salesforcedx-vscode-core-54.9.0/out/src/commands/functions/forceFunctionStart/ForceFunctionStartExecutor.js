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
const functions_core_1 = require("@heroku/functions-core");
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const path = require("path");
const channels_1 = require("../../../channels");
const messages_1 = require("../../../messages");
const notifications_1 = require("../../../notifications");
const telemetry_1 = require("../../../telemetry");
const util_1 = require("../../../util");
const functionService_1 = require("../functionService");
const constants_1 = require("../types/constants");
class ForceFunctionStartExecutor extends src_1.LibraryCommandletExecutor {
    constructor(startMessageKey, logName) {
        super(messages_1.nls.localize(startMessageKey), logName, channels_1.OUTPUT_CHANNEL);
        this.UNEXPECTED_ERROR_KEY = 'force_function_start_unexpected_error';
        this.cancellable = true;
    }
    run(response, progress, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceFsPath = response.data;
            const functionDirPath = functionService_1.FunctionService.getFunctionDir(sourceFsPath);
            if (!functionDirPath) {
                const warningMessage = messages_1.nls.localize('force_function_start_warning_no_toml');
                notifications_1.notificationService.showWarningMessage(warningMessage);
                telemetry_1.telemetryService.sendException('force_function_start_no_toml', warningMessage);
                return false;
            }
            channels_1.channelService.showChannelOutput();
            try {
                yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(false).then(defaultUsernameorAlias => {
                    if (!defaultUsernameorAlias) {
                        const message = messages_1.nls.localize('force_function_start_no_org_auth');
                        channels_1.channelService.appendLine(message);
                        channels_1.channelService.showChannelOutput();
                        notifications_1.notificationService.showInformationMessage(message);
                    }
                });
            }
            catch (error) {
                // ignore, getDefaultUsernameOrAlias catches the error and logs telemetry
            }
            const registeredStartedFunctionDisposable = functionService_1.FunctionService.instance.registerStartedFunction({
                rootDir: functionDirPath,
                port: constants_1.FUNCTION_DEFAULT_PORT,
                debugPort: constants_1.FUNCTION_DEFAULT_DEBUG_PORT,
                // Note this defaults to node but will be updated by the updateFunction method after the function is started if necessary.
                debugType: 'node',
                terminate: () => {
                    return new Promise(resolve => resolve(this.cancelFunction(registeredStartedFunctionDisposable)));
                },
                isContainerLess: false
            });
            this.telemetry.addProperty('language', functionService_1.FunctionService.instance.getFunctionLanguage());
            yield this.setupFunctionListeners(functionDirPath, registeredStartedFunctionDisposable);
            token === null || token === void 0 ? void 0 : token.onCancellationRequested(() => {
                this.cancelFunction(registeredStartedFunctionDisposable);
                registeredStartedFunctionDisposable.dispose();
            });
            channels_1.channelService.appendLine('Parsing project.toml');
            const descriptor = yield functions_core_1.getProjectDescriptor(path.join(functionDirPath, 'project.toml'));
            const functionName = descriptor.com.salesforce.id;
            this.buildFunction(functionName, functionDirPath);
            channels_1.channelService.appendLine(`Starting ${functionName}`);
            this.startFunction(functionName, functionDirPath);
            return true;
        });
    }
}
exports.ForceFunctionStartExecutor = ForceFunctionStartExecutor;
//# sourceMappingURL=ForceFunctionStartExecutor.js.map