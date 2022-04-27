"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
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
const fs = require("fs");
const util_1 = require("../commands/util");
const util_2 = require("../util");
class ForceListMetadataExecutor extends util_1.SfdxCommandletExecutor {
    constructor(metadataType, defaultUsernameOrAlias, folder) {
        super();
        this.metadataType = metadataType;
        this.defaultUsernameOrAlias = defaultUsernameOrAlias;
        this.folder = folder;
    }
    build(data) {
        const builder = new cli_1.SfdxCommandBuilder()
            .withArg('force:mdapi:listmetadata')
            .withFlag('-m', this.metadataType)
            .withFlag('-u', this.defaultUsernameOrAlias)
            .withLogName('force_mdapi_listmetadata')
            .withJson();
        if (this.folder) {
            builder.withFlag('--folder', this.folder);
        }
        return builder.build();
    }
    execute() {
        const startTime = process.hrtime();
        const execution = new cli_1.CliCommandExecutor(this.build({}), {
            cwd: util_2.getRootWorkspacePath()
        }).execute();
        execution.processExitSubject.subscribe(() => {
            this.logMetric(execution.command.logName, startTime);
        });
        return execution;
    }
}
exports.ForceListMetadataExecutor = ForceListMetadataExecutor;
function forceListMetadata(metadataType, defaultUsernameOrAlias, outputPath, folder) {
    return __awaiter(this, void 0, void 0, function* () {
        const forceListMetadataExecutor = new ForceListMetadataExecutor(metadataType, defaultUsernameOrAlias, folder);
        const execution = forceListMetadataExecutor.execute();
        const cmdOutput = new cli_1.CommandOutput();
        const result = yield cmdOutput.getCmdResult(execution);
        fs.writeFileSync(outputPath, result);
        return result;
    });
}
exports.forceListMetadata = forceListMetadata;
//# sourceMappingURL=forceListMetadata.js.map