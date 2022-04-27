"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
/**
 * Reformats errors thrown by beta deploy/retrieve logic.
 *
 * @param e Error to reformat
 * @returns A newly formatted error
 */
function formatException(e) {
    e.message = e.message.replace(src_1.getRootWorkspacePath(), '');
    return e;
}
exports.formatException = formatException;
function createComponentCount(components) {
    const quantities = {};
    for (const component of components) {
        const { name: typeName } = component.type;
        const typeCount = quantities[typeName];
        quantities[typeName] = typeCount ? typeCount + 1 : 1;
    }
    return Object.keys(quantities).map(type => ({
        type,
        quantity: quantities[type]
    }));
}
exports.createComponentCount = createComponentCount;
//# sourceMappingURL=betaDeployRetrieve.js.map