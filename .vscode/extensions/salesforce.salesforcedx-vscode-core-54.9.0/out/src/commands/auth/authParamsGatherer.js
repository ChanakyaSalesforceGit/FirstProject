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
const vscode = require("vscode");
const messages_1 = require("../../messages");
const sfdxProject_1 = require("../../sfdxProject");
exports.DEFAULT_ALIAS = 'vscodeOrg';
exports.PRODUCTION_URL = 'https://login.salesforce.com';
exports.SANDBOX_URL = 'https://test.salesforce.com';
exports.INSTANCE_URL_PLACEHOLDER = 'https://na35.salesforce.com';
function inputInstanceUrl() {
    return __awaiter(this, void 0, void 0, function* () {
        const instanceUrlInputOptions = {
            prompt: messages_1.nls.localize('parameter_gatherer_enter_instance_url'),
            placeHolder: exports.INSTANCE_URL_PLACEHOLDER,
            validateInput: AuthParamsGatherer.validateUrl,
            ignoreFocusOut: true
        };
        const instanceUrl = yield vscode.window.showInputBox(instanceUrlInputOptions);
        return instanceUrl;
    });
}
function inputAlias() {
    return __awaiter(this, void 0, void 0, function* () {
        const aliasInputOptions = {
            prompt: messages_1.nls.localize('parameter_gatherer_enter_alias_name'),
            placeHolder: exports.DEFAULT_ALIAS,
            ignoreFocusOut: true
        };
        const alias = yield vscode.window.showInputBox(aliasInputOptions);
        return alias;
    });
}
function inputAccessToken() {
    return __awaiter(this, void 0, void 0, function* () {
        const accessToken = yield vscode.window.showInputBox({
            value: '',
            prompt: messages_1.nls.localize('parameter_gatherer_enter_session_id'),
            placeHolder: messages_1.nls.localize('parameter_gatherer_enter_session_id_placeholder'),
            password: true,
            ignoreFocusOut: true,
            validateInput: text => {
                return text && text.length > 0
                    ? null
                    : messages_1.nls.localize('parameter_gatherer_enter_session_id_diagnostic_message');
            }
        });
        return accessToken;
    });
}
class OrgTypeItem {
    constructor(localizeLabel, localizeDetail) {
        this.label = messages_1.nls.localize(localizeLabel);
        this.detail = messages_1.nls.localize(localizeDetail);
    }
}
exports.OrgTypeItem = OrgTypeItem;
class AuthParamsGatherer {
    constructor() {
        this.orgTypes = {
            project: new OrgTypeItem('auth_project_label', 'auth_project_detail'),
            production: new OrgTypeItem('auth_prod_label', 'auth_prod_detail'),
            sandbox: new OrgTypeItem('auth_sandbox_label', 'auth_sandbox_detail'),
            custom: new OrgTypeItem('auth_custom_label', 'auth_custom_detail')
        };
    }
    getProjectLoginUrl() {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield sfdxProject_1.SfdxProjectConfig.getValue('sfdcLoginUrl'));
        });
    }
    getQuickPickItems() {
        return __awaiter(this, void 0, void 0, function* () {
            const projectUrl = yield this.getProjectLoginUrl();
            const items = [
                this.orgTypes.production,
                this.orgTypes.sandbox,
                this.orgTypes.custom
            ];
            if (projectUrl) {
                const { project } = this.orgTypes;
                project.detail = `${messages_1.nls.localize('auth_project_detail')} (${projectUrl})`;
                items.unshift(project);
            }
            return items;
        });
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const quickPickItems = yield this.getQuickPickItems();
            const selection = yield vscode.window.showQuickPick(quickPickItems);
            if (!selection) {
                return { type: 'CANCEL' };
            }
            const orgType = selection.label;
            let loginUrl;
            if (orgType === this.orgTypes.custom.label) {
                const customUrlInputOptions = {
                    prompt: messages_1.nls.localize('parameter_gatherer_enter_custom_url'),
                    placeHolder: exports.PRODUCTION_URL,
                    validateInput: AuthParamsGatherer.validateUrl
                };
                loginUrl = yield vscode.window.showInputBox(customUrlInputOptions);
                if (loginUrl === undefined) {
                    return { type: 'CANCEL' };
                }
            }
            else if (orgType === this.orgTypes.project.label) {
                loginUrl = yield this.getProjectLoginUrl();
            }
            else {
                loginUrl = orgType === 'Sandbox' ? exports.SANDBOX_URL : exports.PRODUCTION_URL;
            }
            const aliasInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_alias_name'),
                placeHolder: exports.DEFAULT_ALIAS
            };
            const alias = yield vscode.window.showInputBox(aliasInputOptions);
            // Hitting enter with no alias will default the alias to 'vscodeOrg'
            if (alias === undefined) {
                return { type: 'CANCEL' };
            }
            return {
                type: 'CONTINUE',
                data: {
                    alias: alias || exports.DEFAULT_ALIAS,
                    loginUrl: loginUrl || exports.PRODUCTION_URL
                }
            };
        });
    }
}
exports.AuthParamsGatherer = AuthParamsGatherer;
AuthParamsGatherer.validateUrl = (url) => {
    const expr = /https?:\/\/(.*)/;
    if (expr.test(url)) {
        return null;
    }
    return messages_1.nls.localize('auth_invalid_url');
};
class AccessTokenParamsGatherer {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const instanceUrl = yield inputInstanceUrl();
            if (instanceUrl === undefined) {
                return { type: 'CANCEL' };
            }
            const alias = yield inputAlias();
            // Hitting enter with no alias will default the alias to 'vscodeOrg'
            if (alias === undefined) {
                return { type: 'CANCEL' };
            }
            const accessToken = yield inputAccessToken();
            if (accessToken === undefined) {
                return { type: 'CANCEL' };
            }
            return {
                type: 'CONTINUE',
                data: {
                    accessToken,
                    alias: alias || exports.DEFAULT_ALIAS,
                    instanceUrl
                }
            };
        });
    }
}
exports.AccessTokenParamsGatherer = AccessTokenParamsGatherer;
class ScratchOrgLogoutParamsGatherer {
    constructor(username, alias) {
        this.username = username;
        this.alias = alias;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = messages_1.nls.localize('auth_logout_scratch_prompt', this.alias || this.username);
            const logoutResponse = messages_1.nls.localize('auth_logout_scratch_logout');
            const confirm = yield vscode.window.showInformationMessage(prompt, { modal: true }, ...[logoutResponse]);
            if (confirm !== logoutResponse) {
                return { type: 'CANCEL' };
            }
            return {
                type: 'CONTINUE',
                data: this.username
            };
        });
    }
}
exports.ScratchOrgLogoutParamsGatherer = ScratchOrgLogoutParamsGatherer;
//# sourceMappingURL=authParamsGatherer.js.map