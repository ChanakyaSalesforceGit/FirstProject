"use strict";
/*
 * Copyright (c) 2022, salesforce.com, inc.
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
const util_1 = require("../util");
const forceFunctionStart_1 = require("./forceFunctionStart");
exports.CONTAINER_START_TEXT_KEY = 'force_function_container_start_text';
exports.FUNCTION_CONTAINER_LOG_NAME = 'force_function_container_start';
/**
 * Executes sfdx run:function:start --verbose
 * @param sourceUri
 */
exports.forceFunctionContainerStartCommand = (sourceUri) => __awaiter(void 0, void 0, void 0, function* () {
    const validSourceUri = forceFunctionStart_1.validateStartFunctionsUri(sourceUri);
    if (!validSourceUri) {
        return;
    }
    const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.FilePathGatherer(validSourceUri), new forceFunctionStart_1.ForceFunctionContainerStartExecutor(exports.CONTAINER_START_TEXT_KEY, exports.FUNCTION_CONTAINER_LOG_NAME));
    yield commandlet.run();
});
//# sourceMappingURL=forceFunctionContainerStartCommand.js.map