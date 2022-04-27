"use strict";
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
function isDemoMode() {
    return process.env.SFDX_ENV ? process.env.SFDX_ENV === 'DEMO' : false;
}
exports.isDemoMode = isDemoMode;
function isProdOrg(response) {
    return response.result.trialExpirationDate ? false : true;
}
exports.isProdOrg = isProdOrg;
//# sourceMappingURL=demo-mode.js.map