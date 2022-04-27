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
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const util_1 = require("util");
const vscode = require("vscode");
const telemetry_1 = require("../telemetry");
const util_2 = require("../util");
var OrgType;
(function (OrgType) {
    OrgType[OrgType["SourceTracked"] = 0] = "SourceTracked";
    OrgType[OrgType["NonSourceTracked"] = 1] = "NonSourceTracked";
})(OrgType = exports.OrgType || (exports.OrgType = {}));
function getWorkspaceOrgType(defaultUsernameOrAlias) {
    return __awaiter(this, void 0, void 0, function* () {
        if (util_1.isNullOrUndefined(defaultUsernameOrAlias)) {
            const e = new Error();
            e.name = 'NoDefaultusernameSet';
            throw e;
        }
        const username = yield util_2.OrgAuthInfo.getUsername(defaultUsernameOrAlias);
        const isScratchOrg = yield util_2.OrgAuthInfo.isAScratchOrg(username).catch(err => telemetry_1.telemetryService.sendException('get_workspace_org_type_scratch_org', err.message));
        return isScratchOrg ? OrgType.SourceTracked : OrgType.NonSourceTracked;
    });
}
exports.getWorkspaceOrgType = getWorkspaceOrgType;
function setWorkspaceOrgTypeWithOrgType(orgType) {
    setDefaultUsernameHasChangeTracking(orgType === OrgType.SourceTracked);
    setDefaultUsernameHasNoChangeTracking(orgType === OrgType.NonSourceTracked);
}
exports.setWorkspaceOrgTypeWithOrgType = setWorkspaceOrgTypeWithOrgType;
function setupWorkspaceOrgType(defaultUsernameOrAlias) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            setHasDefaultUsername(!!defaultUsernameOrAlias);
            const orgType = yield getWorkspaceOrgType(defaultUsernameOrAlias);
            setWorkspaceOrgTypeWithOrgType(orgType);
        }
        catch (e) {
            telemetry_1.telemetryService.sendException('send_workspace_org_type', e.message);
            switch (e.name) {
                case 'NamedOrgNotFound':
                    // If the info for a default username cannot be found,
                    // then assume that the org can be of either type
                    setDefaultUsernameHasChangeTracking(true);
                    setDefaultUsernameHasNoChangeTracking(true);
                    break;
                case 'NoDefaultusernameSet':
                    setDefaultUsernameHasChangeTracking(false);
                    setDefaultUsernameHasNoChangeTracking(false);
                    break;
                default:
                    setDefaultUsernameHasChangeTracking(true);
                    setDefaultUsernameHasNoChangeTracking(true);
            }
        }
    });
}
exports.setupWorkspaceOrgType = setupWorkspaceOrgType;
function setDefaultUsernameHasChangeTracking(val) {
    vscode.commands.executeCommand('setContext', 'sfdx:default_username_has_change_tracking', val);
}
function setDefaultUsernameHasNoChangeTracking(val) {
    vscode.commands.executeCommand('setContext', 'sfdx:default_username_has_no_change_tracking', val);
}
function setHasDefaultUsername(val) {
    vscode.commands.executeCommand('setContext', 'sfdx:has_default_username', val);
}
function getDefaultUsernameOrAlias() {
    return __awaiter(this, void 0, void 0, function* () {
        if (util_2.hasRootWorkspace()) {
            return yield util_2.OrgAuthInfo.getDefaultUsernameOrAlias(true);
        }
    });
}
exports.getDefaultUsernameOrAlias = getDefaultUsernameOrAlias;
//# sourceMappingURL=workspaceOrgType.js.map