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
const messages_1 = require("../messages");
const util_1 = require("./util");
class ForceOrgDisplay extends util_1.SfdxCommandletExecutor {
    constructor(flag) {
        super();
        this.flag = flag;
    }
    build(data) {
        const builder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_org_display_default_text'))
            .withArg('force:org:display')
            .withLogName('force_org_display_default');
        if (this.flag === '--targetusername' && data.username) {
            builder
                .withDescription(messages_1.nls.localize('force_org_display_username_text'))
                .withFlag(this.flag, data.username);
        }
        return builder.build();
    }
}
exports.ForceOrgDisplay = ForceOrgDisplay;
const workspaceChecker = new util_1.SfdxWorkspaceChecker();
function forceOrgDisplay() {
    return __awaiter(this, void 0, void 0, function* () {
        // tslint:disable-next-line:no-invalid-this
        const flag = this ? this.flag : undefined;
        const parameterGatherer = flag
            ? new util_1.SelectUsername()
            : new util_1.EmptyParametersGatherer();
        const executor = new ForceOrgDisplay(flag);
        const commandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, executor);
        yield commandlet.run();
    });
}
exports.forceOrgDisplay = forceOrgDisplay;
//# sourceMappingURL=forceOrgDisplay.js.map