"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const statuses_1 = require("../statuses");
function forceTaskStop(task) {
    if (task instanceof statuses_1.Task) {
        // See https://github.com/Microsoft/vscode-docs/blob/master/docs/extensionAPI/extension-points.md#contributesmenus
        // For best case inference efforts on what to pass in
        statuses_1.taskViewService.terminateTask(task);
    }
    else {
        statuses_1.taskViewService.terminateTask();
    }
}
exports.forceTaskStop = forceTaskStop;
//# sourceMappingURL=forceTaskStop.js.map