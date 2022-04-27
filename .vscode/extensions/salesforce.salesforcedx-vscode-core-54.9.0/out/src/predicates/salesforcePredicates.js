"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const predicates_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/predicates");
const fs = require("fs");
const path = require("path");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
const util_1 = require("../util");
class IsSfdxProjectOpened {
    apply(item) {
        if (!util_1.hasRootWorkspace()) {
            return predicates_1.PredicateResponse.of(false, messages_1.nls.localize('predicates_no_folder_opened_text'));
        }
        else if (!fs.existsSync(path.join(util_1.getRootWorkspacePath(), constants_1.SFDX_PROJECT_FILE))) {
            return predicates_1.PredicateResponse.of(false, messages_1.nls.localize('predicates_no_sfdx_project_found_text'));
        }
        else {
            return predicates_1.PredicateResponse.true();
        }
    }
}
exports.IsSfdxProjectOpened = IsSfdxProjectOpened;
//# sourceMappingURL=salesforcePredicates.js.map