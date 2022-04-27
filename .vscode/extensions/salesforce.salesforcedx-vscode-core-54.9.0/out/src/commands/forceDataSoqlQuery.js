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
const vscode = require("vscode");
const messages_1 = require("../messages");
const util_1 = require("./util");
class ForceDataSoqlQueryExecutor extends util_1.SfdxCommandletExecutor {
    build(data) {
        let command = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_data_soql_query_input_text'))
            .withArg('force:data:soql:query')
            .withFlag('--query', `${data.query}`)
            .withLogName('force_data_soql_query');
        if (data.api === ApiType.Tooling) {
            command = command
                .withArg('--usetoolingapi')
                .withLogName('force_data_soql_query_tooling');
        }
        return command.build();
    }
}
class GetQueryAndApiInputs {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const editor = yield vscode.window.activeTextEditor;
            let query;
            if (!editor) {
                const userInputOptions = {
                    prompt: messages_1.nls.localize('parameter_gatherer_enter_soql_query')
                };
                query = yield vscode.window.showInputBox(userInputOptions);
            }
            else {
                const document = editor.document;
                if (editor.selection.isEmpty) {
                    const userInputOptions = {
                        prompt: messages_1.nls.localize('parameter_gatherer_enter_soql_query')
                    };
                    query = yield vscode.window.showInputBox(userInputOptions);
                }
                else {
                    query = document.getText(editor.selection);
                }
            }
            query = query
                .replace('[', '')
                .replace(']', '')
                .replace(/(\r\n|\n)/g, ' ');
            if (!query) {
                return { type: 'CANCEL' };
            }
            const restApi = {
                api: ApiType.REST,
                label: messages_1.nls.localize('REST_API'),
                description: messages_1.nls.localize('REST_API_description')
            };
            const toolingApi = {
                api: ApiType.Tooling,
                label: messages_1.nls.localize('tooling_API'),
                description: messages_1.nls.localize('tooling_API_description')
            };
            const apiItems = [restApi, toolingApi];
            const selection = yield vscode.window.showQuickPick(apiItems);
            return selection
                ? { type: 'CONTINUE', data: { query, api: selection.api } }
                : { type: 'CANCEL' };
        });
    }
}
exports.GetQueryAndApiInputs = GetQueryAndApiInputs;
var ApiType;
(function (ApiType) {
    ApiType[ApiType["REST"] = 0] = "REST";
    ApiType[ApiType["Tooling"] = 1] = "Tooling";
})(ApiType = exports.ApiType || (exports.ApiType = {}));
const workspaceChecker = new util_1.SfdxWorkspaceChecker();
function forceDataSoqlQuery(explorerDir) {
    return __awaiter(this, void 0, void 0, function* () {
        const parameterGatherer = new GetQueryAndApiInputs();
        const commandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceDataSoqlQueryExecutor());
        yield commandlet.run();
    });
}
exports.forceDataSoqlQuery = forceDataSoqlQuery;
//# sourceMappingURL=forceDataSoqlQuery.js.map