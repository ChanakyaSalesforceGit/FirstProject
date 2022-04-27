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
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const path = require("path");
const messages_1 = require("../../messages");
const util_1 = require("../../util");
const util_2 = require("../util");
const util_3 = require("../util");
const parameterGatherers_1 = require("../util/parameterGatherers");
const postconditionCheckers_1 = require("../util/postconditionCheckers");
const baseTemplateCommand_1 = require("./baseTemplateCommand");
const metadataTypeConstants_1 = require("./metadataTypeConstants");
class ForceLightningLwcTestCreateExecutor extends baseTemplateCommand_1.BaseTemplateCommand {
    constructor() {
        super();
    }
    build(data) {
        this.metadata = metadataTypeConstants_1.LWC_TYPE;
        const builder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_lightning_lwc_test_create_text'))
            .withArg('force:lightning:lwc:test:create')
            .withFlag('--filepath', path.join(util_1.getRootWorkspacePath(), data.outputdir, data.fileName + '.js'))
            .withLogName('force_lightning_web_component_test_create');
        return builder.build();
    }
    getSourcePathStrategy() {
        return util_2.PathStrategyFactory.createLwcTestStrategy();
    }
}
exports.ForceLightningLwcTestCreateExecutor = ForceLightningLwcTestCreateExecutor;
const filePathGatherer = new parameterGatherers_1.SelectLwcComponentDir();
const metadataTypeGatherer = new util_3.MetadataTypeGatherer(metadataTypeConstants_1.LWC_TYPE);
function forceLightningLwcTestCreate() {
    return __awaiter(this, void 0, void 0, function* () {
        const commandlet = new util_2.SfdxCommandlet(new util_2.SfdxWorkspaceChecker(), new util_2.CompositeParametersGatherer(metadataTypeGatherer, filePathGatherer), new ForceLightningLwcTestCreateExecutor(), new postconditionCheckers_1.OverwriteComponentPrompt());
        yield commandlet.run();
    });
}
exports.forceLightningLwcTestCreate = forceLightningLwcTestCreate;
//# sourceMappingURL=forceLightningLwcTestCreate.js.map