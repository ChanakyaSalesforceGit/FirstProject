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
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const i18n_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/i18n");
const fs = require("fs");
const path = require("path");
const commands_1 = require("../commands");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
class TypeUtils {
    getTypesFolder(usernameOrAlias) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!util_1.hasRootWorkspace()) {
                const err = messages_1.nls.localize('cannot_determine_workspace');
                telemetry_1.telemetryService.sendException('metadata_type_workspace', err);
                throw new Error(err);
            }
            const workspaceRootPath = util_1.getRootWorkspacePath();
            const username = yield util_1.OrgAuthInfo.getUsername(usernameOrAlias);
            const metadataTypesPath = path.join(workspaceRootPath, '.sfdx', 'orgs', username, 'metadata');
            return metadataTypesPath;
        });
    }
    buildTypesList(metadataFile, metadataTypesPath) {
        try {
            if (helpers_1.isNullOrUndefined(metadataFile)) {
                metadataFile = fs.readFileSync(metadataTypesPath, 'utf8');
            }
            const jsonObject = JSON.parse(metadataFile);
            let metadataTypeObjects = jsonObject.result
                .metadataObjects;
            metadataTypeObjects = metadataTypeObjects.filter(type => !helpers_1.isNullOrUndefined(type.xmlName) &&
                !TypeUtils.UNSUPPORTED_TYPES.has(type.xmlName));
            telemetry_1.telemetryService.sendEventData('Metadata Types Quantity', undefined, {
                metadataTypes: metadataTypeObjects.length
            });
            for (const mdTypeObject of metadataTypeObjects) {
                mdTypeObject.label = messages_1.nls
                    .localize(mdTypeObject.xmlName)
                    .startsWith(i18n_1.MISSING_LABEL_MSG)
                    ? mdTypeObject.xmlName
                    : messages_1.nls.localize(mdTypeObject.xmlName);
            }
            return metadataTypeObjects.sort((a, b) => (a.label > b.label ? 1 : -1));
        }
        catch (e) {
            telemetry_1.telemetryService.sendException('metadata_type_build_types_list', e.message);
            throw new Error(e);
        }
    }
    loadTypes(defaultOrg, forceRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const typesFolder = yield this.getTypesFolder(defaultOrg);
            const typesPath = path.join(typesFolder, 'metadataTypes.json');
            let typesList;
            if (forceRefresh || !fs.existsSync(typesPath)) {
                const result = yield commands_1.forceDescribeMetadata(typesFolder);
                typesList = this.buildTypesList(result, undefined);
            }
            else {
                typesList = this.buildTypesList(undefined, typesPath);
            }
            return typesList;
        });
    }
    getFolderForType(metadataType) {
        switch (metadataType) {
            case 'CustomObject':
                return metadataType;
            case 'EmailTemplate':
                return 'EmailFolder';
            default:
                return `${metadataType}Folder`;
        }
    }
}
exports.TypeUtils = TypeUtils;
TypeUtils.FOLDER_TYPES = new Set([
    'CustomObject',
    'Dashboard',
    'Document',
    'EmailTemplate',
    'Report'
]);
TypeUtils.UNSUPPORTED_TYPES = new Set([
    'InstalledPackage',
    'Profile',
    'Scontrol'
]);
//# sourceMappingURL=metadataType.js.map