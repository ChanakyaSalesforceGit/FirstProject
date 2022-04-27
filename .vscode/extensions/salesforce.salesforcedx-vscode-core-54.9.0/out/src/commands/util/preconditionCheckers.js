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
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const vscode_1 = require("vscode");
const notifications_1 = require("../../notifications");
const predicates_1 = require("../../predicates");
const util_1 = require("../../util");
class SfdxWorkspaceChecker {
    check() {
        const result = predicates_1.isSfdxProjectOpened.apply(vscode_1.workspace);
        if (!result.result) {
            notifications_1.notificationService.showErrorMessage(result.message);
            return false;
        }
        return true;
    }
}
exports.SfdxWorkspaceChecker = SfdxWorkspaceChecker;
class EmptyPreChecker {
    check() {
        return true;
    }
}
exports.EmptyPreChecker = EmptyPreChecker;
class DevUsernameChecker {
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            if (helpers_1.isNullOrUndefined(yield util_1.OrgAuthInfo.getDefaultDevHubUsernameOrAlias(true))) {
                return Promise.resolve(false);
            }
            return Promise.resolve(true);
        });
    }
}
exports.DevUsernameChecker = DevUsernameChecker;
class CompositePreconditionChecker {
    constructor(...checks) {
        this.checks = checks;
    }
    check() {
        return __awaiter(this, void 0, void 0, function* () {
            for (const output of this.checks) {
                const input = yield output.check();
                if (input === false) {
                    return Promise.resolve(false);
                }
            }
            return Promise.resolve(true);
        });
    }
}
exports.CompositePreconditionChecker = CompositePreconditionChecker;
//# sourceMappingURL=preconditionCheckers.js.map