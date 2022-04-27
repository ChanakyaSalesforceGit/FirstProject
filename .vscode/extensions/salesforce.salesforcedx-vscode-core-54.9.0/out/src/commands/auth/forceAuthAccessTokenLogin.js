"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
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
const core_1 = require("@salesforce/core");
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const index_1 = require("../../channels/index");
const messages_1 = require("../../messages");
const util_1 = require("../util");
const authParamsGatherer_1 = require("./authParamsGatherer");
class ForceAuthAccessTokenExecutor extends src_1.LibraryCommandletExecutor {
    constructor() {
        super(messages_1.nls.localize('force_auth_access_token_authorize_org_text'), 'force_auth_access_token', index_1.OUTPUT_CHANNEL);
    }
    run(response, progress, token) {
        return __awaiter(this, void 0, void 0, function* () {
            const { instanceUrl, accessToken, alias } = response.data;
            try {
                const authInfo = yield core_1.AuthInfo.create({
                    accessTokenOptions: { accessToken, instanceUrl }
                });
                yield authInfo.save();
                yield authInfo.setAlias(alias);
                yield authInfo.setAsDefault({
                    defaultUsername: true
                });
            }
            catch (error) {
                if (error.message && error.message.includes('Bad_OAuth_Token')) {
                    // Provide a user-friendly message for invalid / expired session ID
                    index_1.channelService.appendLine(messages_1.nls.localize('force_auth_access_token_login_bad_oauth_token_message'));
                }
                throw error;
            }
            return true;
        });
    }
}
exports.ForceAuthAccessTokenExecutor = ForceAuthAccessTokenExecutor;
const workspaceChecker = new util_1.SfdxWorkspaceChecker();
const parameterGatherer = new authParamsGatherer_1.AccessTokenParamsGatherer();
function forceAuthAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceAuthAccessTokenExecutor());
        yield commandlet.run();
    });
}
exports.forceAuthAccessToken = forceAuthAccessToken;
//# sourceMappingURL=forceAuthAccessTokenLogin.js.map