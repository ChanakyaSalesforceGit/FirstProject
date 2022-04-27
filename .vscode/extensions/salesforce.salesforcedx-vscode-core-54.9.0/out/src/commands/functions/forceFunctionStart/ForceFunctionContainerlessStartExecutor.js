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
class ForceFunctionContainerlessStartExecutor extends ForceFunctionStartExecutor_1.ForceFunctionStartExecutor {
    setupFunctionListeners() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('No listeners for containerless function.');
        });
    }
    cancelFunction(registeredStartedFunctionDisposable) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: how to stop the localRun
            registeredStartedFunctionDisposable.dispose();
        });
    }
    buildFunction() {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('No build for containerless function');
        });
    }
    startFunction(functionName, functionDirPath) {
        const functionLanguage = functionService_1.FunctionService.instance.getFunctionType();
        channels_1.channelService.appendLine(`Starting ${functionName} of type ${functionLanguage}`);
        const localRun = new functions_core_1.LocalRun(functionLanguage, {
            path: functionDirPath,
            port: constants_1.FUNCTION_DEFAULT_PORT,
            debugPort: constants_1.FUNCTION_DEFAULT_DEBUG_PORT
        });
        const debugType = functionLanguage === functionService_1.functionType.JAVA ? 'java' : 'node';
        functionService_1.FunctionService.instance.updateFunction(functionDirPath, debugType, true);
        localRun
            .exec()
            .then(msg => {
            console.log(`localRun resolved in ForceFunctionContainerlessStartExecutor with message: ${msg}`);
        })
            .catch((err) => {
            const errorNotificationMessage = messages_1.nls.localize(this.UNEXPECTED_ERROR_KEY);
            telemetry_1.telemetryService.sendException(this.UNEXPECTED_ERROR_KEY, err.message);
            notifications_1.notificationService.showErrorMessage(errorNotificationMessage);
            channels_1.channelService.appendLine(errorNotificationMessage);
            if (err.message) {
                channels_1.channelService.appendLine(err.message);
            }
            channels_1.channelService.showChannelOutput();
        });
    }
}
exports.ForceFunctionContainerlessStartExecutor = ForceFunctionContainerlessStartExecutor;
//# sourceMappingURL=ForceFunctionContainerlessStartExecutor.js.map