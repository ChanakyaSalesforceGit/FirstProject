"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const sfdxCoreSettings_1 = require("./sfdxCoreSettings");
exports.sfdxCoreSettings = sfdxCoreSettings_1.SfdxCoreSettings.getInstance();
var pushOrDeployOnSave_1 = require("./pushOrDeployOnSave");
exports.DeployQueue = pushOrDeployOnSave_1.DeployQueue;
exports.registerPushOrDeployOnSave = pushOrDeployOnSave_1.registerPushOrDeployOnSave;
exports.pathIsInPackageDirectory = pushOrDeployOnSave_1.pathIsInPackageDirectory;
//# sourceMappingURL=index.js.map