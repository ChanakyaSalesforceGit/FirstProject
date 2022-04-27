"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const context_1 = require("../context");
const messages_1 = require("../messages");
class PersistentStorageService {
    constructor(context) {
        this.storage = context.globalState;
    }
    static initialize(context) {
        PersistentStorageService.instance = new PersistentStorageService(context);
    }
    static getInstance() {
        if (!PersistentStorageService.instance) {
            const errorMsg = messages_1.nls.localize('conflict_detect_initialization_error');
            throw new Error(errorMsg);
        }
        return PersistentStorageService.instance;
    }
    getPropertiesForFile(key) {
        return this.storage.get(key);
    }
    setPropertiesForFile(key, conflictFileProperties) {
        this.storage.update(key, conflictFileProperties);
    }
    setPropertiesForFilesRetrieve(fileProperties) {
        const fileArray = Array.isArray(fileProperties) ? fileProperties : [fileProperties];
        for (const fileProperty of fileArray) {
            this.setPropertiesForFile(this.makeKey(fileProperty.type, fileProperty.fullName), {
                lastModifiedDate: fileProperty.lastModifiedDate
            });
        }
    }
    makeKey(type, fullName) {
        const orgUserName = context_1.workspaceContext.username;
        const projectPath = src_1.getRootWorkspacePath();
        return `${orgUserName}#${projectPath}#${type}#${fullName}`;
    }
}
exports.PersistentStorageService = PersistentStorageService;
//# sourceMappingURL=persistentStorageService.js.map