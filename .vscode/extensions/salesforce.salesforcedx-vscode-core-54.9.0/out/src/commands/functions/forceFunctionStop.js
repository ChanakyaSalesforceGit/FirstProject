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
const channels_1 = require("../../channels");
const messages_1 = require("../../messages");
const notifications_1 = require("../../notifications");
const telemetry_1 = require("../../telemetry");
const functionService_1 = require("./functionService");
const LOG_NAME = 'force_function_stop';
/**
 * Stop all running function containers.
 * Currently, we don't support stopping individual containers,
 * because we don't support running multiple containers.
 */
function forceFunctionStop() {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = process.hrtime();
        if (functionService_1.FunctionService.instance.isFunctionStarted()) {
            channels_1.channelService.appendLine(messages_1.nls.localize('force_function_stop_in_progress'));
            yield functionService_1.FunctionService.instance.stopFunction();
            notifications_1.notificationService
                .showSuccessfulExecution(messages_1.nls.localize('force_function_stop_text'))
                .catch(() => { });
            telemetry_1.telemetryService.sendCommandEvent(LOG_NAME, startTime, {
                language: functionService_1.FunctionService.instance.getFunctionLanguage()
            });
        }
        else {
            notifications_1.notificationService.showWarningMessage(messages_1.nls.localize('force_function_stop_not_started'));
        }
    });
}
exports.forceFunctionStop = forceFunctionStop;
//# sourceMappingURL=forceFunctionStop.js.map