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
const channels_1 = require("../../../channels");
const messages_1 = require("../../../messages");
const notifications_1 = require("../../../notifications");
const telemetry_1 = require("../../../telemetry");
const functionService_1 = require("../functionService");
const constants_1 = require("../types/constants");
const ForceFunctionStartExecutor_1 = require("./ForceFunctionStartExecutor");
var BINARY_EVENT_ENUM;
(function (BINARY_EVENT_ENUM) {
    BINARY_EVENT_ENUM["CONTAINER"] = "container";
    BINARY_EVENT_ENUM["ERROR"] = "error";
    BINARY_EVENT_ENUM["LOG"] = "log";
    BINARY_EVENT_ENUM["PACK"] = "pack";
})(BINARY_EVENT_ENUM = exports.BINARY_EVENT_ENUM || (exports.BINARY_EVENT_ENUM = {}));
const DOCKER_NOT_INSTALLED_KEY = 'force_function_start_warning_docker_not_installed_or_not_started';
const DOCKER_NOT_INSTALLED_TYPE = 'force_function_start_docker_plugin_not_installed_or_started';
const DOCKER_MISSING_ERROR = 'Cannot connect to the Docker daemon';
class ForceFunctionContainerStartExecutor extends ForceFunctionStartExecutor_1.ForceFunctionStartExecutor {
    setupFunctionListeners(functionDirPath, functionDisposable) {
        return __awaiter(this, void 0, void 0, function* () {
            this.functionsBinary = yield functions_core_1.getFunctionsBinary();
            const writeMsg = (msg) => {
                const outputMsg = msg.text;
                if (outputMsg) {
                    channels_1.channelService.appendLine(outputMsg);
                    const matches = String(outputMsg).match(constants_1.FUNCTION_RUNTIME_DETECTION_PATTERN);
                    const [, firstMatch] = matches !== null && matches !== void 0 ? matches : [];
                    if (firstMatch) {
                        functionService_1.FunctionService.instance.updateFunction(functionDirPath, firstMatch, false);
                    }
                }
            };
            const handleError = (error) => {
                var _a;
                functionDisposable.dispose();
                let unexpectedError = true;
                if ((_a = error.text) === null || _a === void 0 ? void 0 : _a.includes(DOCKER_MISSING_ERROR)) {
                    const errorNotificationMessage = messages_1.nls.localize(DOCKER_NOT_INSTALLED_KEY);
                    unexpectedError = false;
                    telemetry_1.telemetryService.sendException(DOCKER_NOT_INSTALLED_TYPE, errorNotificationMessage);
                    notifications_1.notificationService.showErrorMessage(errorNotificationMessage);
                    channels_1.channelService.appendLine(errorNotificationMessage);
                }
                if (unexpectedError) {
                    const errorNotificationMessage = messages_1.nls.localize(this.UNEXPECTED_ERROR_KEY);
                    telemetry_1.telemetryService.sendException(this.UNEXPECTED_ERROR_KEY, errorNotificationMessage);
                    notifications_1.notificationService.showErrorMessage(errorNotificationMessage);
                    channels_1.channelService.appendLine(errorNotificationMessage);
                }
                channels_1.channelService.showChannelOutput();
            };
            this.functionsBinary.on(BINARY_EVENT_ENUM.PACK, writeMsg);
            this.functionsBinary.on(BINARY_EVENT_ENUM.CONTAINER, writeMsg);
            this.functionsBinary.on(BINARY_EVENT_ENUM.LOG, (msg) => {
                if (msg.level === 'debug')
                    return;
                if (msg.level === 'error') {
                    handleError(msg);
                }
                if (msg.text) {
                    writeMsg(msg);
                }
                // evergreen:benny:message {"type":"log","timestamp":"2021-05-10T10:00:27.953248-05:00","level":"info","fields":{"debugPort":"9229","localImageName":"jvm-fn-init","network":"","port":"8080"}} +21ms
                if (msg.fields && msg.fields.localImageName) {
                    channels_1.channelService.appendLine(`'Running on port' :${msg.fields.port}`);
                    channels_1.channelService.appendLine(`'Debugger running on port' :${msg.fields.debugPort}`);
                }
            });
            // Allows for showing custom notifications
            // and sending custom telemetry data for predefined errors
            this.functionsBinary.on(BINARY_EVENT_ENUM.ERROR, handleError);
        });
    }
    cancelFunction(registeredStartedFunctionDisposable) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.functionsBinary !== undefined) {
                this.functionsBinary.cancel();
            }
            this.functionsBinary = undefined;
            registeredStartedFunctionDisposable.dispose();
        });
    }
    buildFunction(functionName, functionDirPath) {
        return __awaiter(this, void 0, void 0, function* () {
            channels_1.channelService.appendLine(`Building ${functionName}`);
            if (!this.functionsBinary) {
                throw new Error('Unable to find binary for building function.');
            }
            yield this.functionsBinary.build(functionName, {
                verbose: true,
                path: functionDirPath
            });
        });
    }
    startFunction(functionName) {
        channels_1.channelService.appendLine(`Starting ${functionName} in container`);
        if (!this.functionsBinary) {
            throw new Error('Unable to start function with no binary.');
        }
        this.functionsBinary.run(functionName, {}).catch(err => {
            console.log(err);
        });
    }
}
exports.ForceFunctionContainerStartExecutor = ForceFunctionContainerStartExecutor;
//# sourceMappingURL=ForceFunctionContainerStartExecutor.js.map