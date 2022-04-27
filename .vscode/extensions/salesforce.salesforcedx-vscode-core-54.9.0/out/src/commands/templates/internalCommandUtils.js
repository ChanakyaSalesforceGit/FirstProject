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
const fs = require("fs");
const settings_1 = require("../../settings");
class InternalDevWorkspaceChecker {
    check() {
        return settings_1.sfdxCoreSettings.getInternalDev();
    }
}
exports.InternalDevWorkspaceChecker = InternalDevWorkspaceChecker;
class FileInternalPathGatherer {
    constructor(uri) {
        this.filePath = uri.fsPath;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const outputdir = this.filePath;
            const isDir = fs.existsSync(outputdir) && fs.lstatSync(outputdir).isDirectory();
            if (isDir) {
                return { type: 'CONTINUE', data: { outputdir } };
            }
            return { type: 'CANCEL' };
        });
    }
}
exports.FileInternalPathGatherer = FileInternalPathGatherer;
//# sourceMappingURL=internalCommandUtils.js.map