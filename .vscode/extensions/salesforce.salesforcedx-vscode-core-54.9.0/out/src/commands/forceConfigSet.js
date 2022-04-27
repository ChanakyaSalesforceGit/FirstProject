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
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const messages_1 = require("../messages");
const util_1 = require("./util");
class ForceConfigSetExecutor extends util_1.SfdxCommandletExecutor {
    constructor(usernameOrAlias) {
        super();
        this.showChannelOutput = false;
        this.usernameOrAlias = `${usernameOrAlias}`.split(',')[0];
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_config_set_org_text'))
            .withArg('force:config:set')
            .withArg(`defaultusername=${this.usernameOrAlias}`)
            .build();
    }
}
exports.ForceConfigSetExecutor = ForceConfigSetExecutor;
const workspaceChecker = new util_1.SfdxWorkspaceChecker();
const parameterGatherer = new util_1.EmptyParametersGatherer();
function forceConfigSet(usernameOrAlias) {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForceConfigSetExecutor(usernameOrAlias));
        yield commandlet.run();
    });
}
exports.forceConfigSet = forceConfigSet;
//# sourceMappingURL=forceConfigSet.js.map