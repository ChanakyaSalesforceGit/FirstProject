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
const vscode = require("vscode");
const messages_1 = require("../messages");
const devServerService_1 = require("../service/devServerService");
const telemetry_1 = require("../telemetry");
const commandUtils_1 = require("./commandUtils");
const logName = 'force_lightning_lwc_open';
const commandName = messages_1.nls.localize('force_lightning_lwc_open_text');
function forceLightningLwcOpen() {
    return __awaiter(this, void 0, void 0, function* () {
        const startTime = process.hrtime();
        if (devServerService_1.DevServerService.instance.isServerHandlerRegistered()) {
            try {
                yield commandUtils_1.openBrowser(devServerService_1.DevServerService.instance.getBaseUrl());
                telemetry_1.telemetryService.sendCommandEvent(logName, startTime);
            }
            catch (e) {
                commandUtils_1.showError(e, logName, commandName);
            }
        }
        else {
            console.log(`${logName}: server was not running, starting...`);
            yield vscode.commands.executeCommand('sfdx.force.lightning.lwc.start');
            telemetry_1.telemetryService.sendCommandEvent(logName, startTime);
        }
    });
}
exports.forceLightningLwcOpen = forceLightningLwcOpen;
//# sourceMappingURL=forceLightningLwcOpen.js.map