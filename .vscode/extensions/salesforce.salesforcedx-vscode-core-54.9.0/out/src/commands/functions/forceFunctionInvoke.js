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
const util_1 = require("../../util");
const util_2 = require("../util");
const functionService_1 = require("./functionService");
const functions_core_1 = require("@heroku/functions-core");
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const fs = require("fs");
class ForceFunctionInvoke extends src_1.LibraryCommandletExecutor {
    constructor(debug = false) {
        super(messages_1.nls.localize('force_function_invoke_text'), debug ? 'force_function_debug_invoke' : 'force_function_invoke', channels_1.OUTPUT_CHANNEL);
        this.telemetry.addProperty('language', functionService_1.FunctionService.instance.getFunctionLanguage());
    }
    run(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const defaultUsername = yield util_1.OrgAuthInfo.getDefaultUsernameOrAlias(false);
            const url = 'http://localhost:8080';
            const data = fs.readFileSync(response.data, 'utf8');
            try {
                channels_1.channelService.appendLine(`POST ${url}`);
                const functionResponse = yield functions_core_1.runFunction({
                    url,
                    payload: data,
                    targetusername: defaultUsername
                });
                channels_1.channelService.appendLine(JSON.stringify(functionResponse.data, undefined, 4));
            }
            catch (error) {
                channels_1.channelService.appendLine(error);
                if (error.response) {
                    channels_1.channelService.appendLine(error.response);
                    channels_1.channelService.appendLine(JSON.stringify(error.response.data, undefined, 4));
                }
                return false;
            }
            return true;
        });
    }
}
exports.ForceFunctionInvoke = ForceFunctionInvoke;
function forceFunctionInvoke(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new util_2.FilePathGatherer(sourceUri), new ForceFunctionInvoke());
        yield commandlet.run();
    });
}
exports.forceFunctionInvoke = forceFunctionInvoke;
function forceFunctionDebugInvoke(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        const localRoot = functionService_1.FunctionService.getFunctionDir(sourceUri.fsPath);
        if (!localRoot) {
            const warningMessage = messages_1.nls.localize('force_function_start_warning_no_toml');
            notifications_1.notificationService.showWarningMessage(warningMessage);
            telemetry_1.telemetryService.sendException('force_function_debug_invoke_no_toml', warningMessage);
            return;
        }
        yield functionService_1.FunctionService.instance.debugFunction(localRoot);
        const commandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new util_2.FilePathGatherer(sourceUri), new ForceFunctionInvoke(true));
        yield commandlet.run();
        yield functionService_1.FunctionService.instance.stopDebuggingFunction(localRoot);
    });
}
exports.forceFunctionDebugInvoke = forceFunctionDebugInvoke;
//# sourceMappingURL=forceFunctionInvoke.js.map