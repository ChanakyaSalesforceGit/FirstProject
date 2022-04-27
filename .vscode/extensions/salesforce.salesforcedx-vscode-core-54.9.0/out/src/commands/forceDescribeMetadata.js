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
const path = require("path");
const shelljs_1 = require("shelljs");
const util_1 = require("../commands/util");
const util_2 = require("../util");
class ForceDescribeMetadataExecutor extends util_1.SfdxCommandletExecutor {
    constructor() {
        super();
    }
    build(data) {
        return new cli_1.SfdxCommandBuilder()
            .withArg('force:mdapi:describemetadata')
            .withJson()
            .withLogName('force_mdapi_describemetadata')
            .build();
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
exports.ForceDescribeMetadataExecutor = ForceDescribeMetadataExecutor;
function forceDescribeMetadata(outputFolder) {
    return __awaiter(this, void 0, void 0, function* () {
        const forceDescribeMetadataExecutor = new ForceDescribeMetadataExecutor();
        const execution = forceDescribeMetadataExecutor.execute();
        if (!fs.existsSync(outputFolder)) {
            shelljs_1.mkdir('-p', outputFolder);
        }
        const filePath = path.join(outputFolder, 'metadataTypes.json');
        const cmdOutput = new cli_1.CommandOutput();
        const result = yield cmdOutput.getCmdResult(execution);
        fs.writeFileSync(filePath, result);
        return result;
    });
}
exports.forceDescribeMetadata = forceDescribeMetadata;
//# sourceMappingURL=forceDescribeMetadata.js.map