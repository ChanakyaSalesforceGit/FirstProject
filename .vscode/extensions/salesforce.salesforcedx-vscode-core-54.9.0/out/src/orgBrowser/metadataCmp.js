"use strict";
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
const registry_1 = require("@salesforce/source-deploy-retrieve/lib/src/registry");
const fs = require("fs");
const path = require("path");
const context_1 = require("../context");
const messages_1 = require("../messages");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
const validManageableStates = new Set([
    'unmanaged',
    'installedEditable',
    'deprecatedEditable',
    undefined // not part of a package
]);
const STANDARDVALUESET_FULLNAME = 'StandardValueSet';
exports.CUSTOMOBJECTS_FULLNAME = 'CustomObject';
class ComponentUtils {
    getComponentsPath(metadataType, defaultUsernameOrAlias, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!util_1.hasRootWorkspace()) {
                const err = messages_1.nls.localize('cannot_determine_workspace');
                telemetry_1.telemetryService.sendException('metadata_cmp_workspace', err);
                throw new Error(err);
            }
            const username = yield util_1.OrgAuthInfo.getUsername(defaultUsernameOrAlias);
            const fileName = `${folderName ? `${metadataType}_${folderName}` : metadataType}.json`;
            const componentsPath = path.join(util_1.getRootWorkspacePath(), '.sfdx', 'orgs', username, 'metadata', fileName);
            return componentsPath;
        });
    }
    buildComponentsList(metadataType, componentsFile, componentsPath) {
        try {
            if (helpers_1.isNullOrUndefined(componentsFile)) {
                componentsFile = fs.readFileSync(componentsPath, 'utf8');
            }
            const jsonObject = JSON.parse(componentsFile);
            let cmpArray = jsonObject.result;
            const components = [];
            if (!helpers_1.isNullOrUndefined(cmpArray)) {
                cmpArray = cmpArray instanceof Array ? cmpArray : [cmpArray];
                for (const cmp of cmpArray) {
                    const { fullName, manageableState } = cmp;
                    if (!helpers_1.isNullOrUndefined(fullName) &&
                        validManageableStates.has(manageableState)) {
                        components.push(fullName);
                    }
                }
            }
            telemetry_1.telemetryService.sendEventData('Metadata Components quantity', { metadataType }, { metadataComponents: components.length });
            return components.sort();
        }
        catch (e) {
            telemetry_1.telemetryService.sendException('metadata_cmp_build_cmp_list', e.message);
            throw new Error(e);
        }
    }
    buildCustomObjectFieldsList(result, componentsPath) {
        if (helpers_1.isNullOrUndefined(result)) {
            result = fs.readFileSync(componentsPath, 'utf8');
        }
        const jsonResult = JSON.parse(result);
        const fields = jsonResult.result.map((field) => {
            switch (field.type) {
                case 'string':
                case 'textarea':
                case 'email':
                    return `${field.name} (${field.type}(${field.length}))`;
                case 'reference':
                    return `${field.relationshipName} (reference)`;
                default:
                    return `${field.name} (${field.type})`;
            }
        });
        return fields;
    }
    fetchAndSaveMetadataComponentProperties(metadataType, connection, componentsPath, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const metadataQuery = { type: metadataType };
            if (folderName) {
                metadataQuery.folder = folderName;
            }
            const metadataFileProperties = yield connection.metadata.list(metadataQuery);
            const result = { status: 0, result: metadataFileProperties };
            const jsonResult = JSON.stringify(result, null, 2);
            fs.writeFileSync(componentsPath, jsonResult);
            return jsonResult;
        });
    }
    fetchAndSaveSObjectFieldsProperties(connection, componentsPath, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const describeSObjectFields = yield connection.describe(folderName);
            const describeSObjectFieldsList = describeSObjectFields.fields;
            const result = { status: 0, result: describeSObjectFieldsList };
            const jsonResult = JSON.stringify(result, null, 2);
            fs.writeFileSync(componentsPath, jsonResult);
            return jsonResult;
        });
    }
    loadComponents(defaultOrg, metadataType, folderName, forceRefresh) {
        return __awaiter(this, void 0, void 0, function* () {
            const componentsPath = yield this.getComponentsPath(metadataType, defaultOrg, folderName);
            let componentsList;
            const freshFetch = (forceRefresh || !fs.existsSync(componentsPath));
            const connection = yield context_1.workspaceContext.getConnection();
            if (metadataType === exports.CUSTOMOBJECTS_FULLNAME && folderName) {
                if (freshFetch) {
                    componentsList = yield this.fetchCustomObjectsFields(connection, componentsPath, folderName);
                }
                else {
                    componentsList = this.fetchExistingCustomObjectsFields(componentsPath);
                }
            }
            else if (metadataType === STANDARDVALUESET_FULLNAME) {
                componentsList = registry_1.standardValueSet.fullnames;
            }
            else {
                if (freshFetch) {
                    componentsList = yield this.fetchMetadataComponents(metadataType, connection, componentsPath, folderName);
                }
                else {
                    componentsList = this.fetchExistingMetadataComponents(metadataType, componentsPath);
                }
            }
            return componentsList;
        });
    }
    /**
     * Retrieves a list of all fields of the standard or custom object.
     * @param connection instance of Connection
     * @param componentsPath json file path of the component
     * @param folderName name of the custom or standard object listed under Custom Objects
     * @returns list of name of fields of the standard or custom object
     */
    fetchCustomObjectsFields(connection, componentsPath, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fetchAndSaveSObjectFieldsProperties(connection, componentsPath, folderName);
            const fieldList = this.buildCustomObjectFieldsList(result, componentsPath);
            return fieldList;
        });
    }
    /**
     * Builds list of components from existing json file at the componentsPath
     * @param metadataType name of metadata type
     * @param componentsPath existing json file path of the component
     * @returns list of name of metadata components
     */
    fetchExistingMetadataComponents(metadataType, componentsPath) {
        return this.buildComponentsList(metadataType, undefined, componentsPath);
    }
    /**
     * Retrieves a list of metadata components
     * @param metadataType name of metadata component
     * @param connection instance of connection
     * @param componentsPath json file path of the component
     * @param folderName name of the folders listed under metadata components like Email Templates, Documents, Dashboards or Reports
     * @returns a list of name of metadata components
     */
    fetchMetadataComponents(metadataType, connection, componentsPath, folderName) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.fetchAndSaveMetadataComponentProperties(metadataType, connection, componentsPath, folderName);
            const componentList = this.buildComponentsList(metadataType, result, undefined);
            return componentList;
        });
    }
    /**
     * Builds a list of all fields of the standard or custom object from existing json file at the componentsPath
     * @param componentsPath existing json file path of the component
     * @returns a list of all fields of the standard or custom object
     */
    fetchExistingCustomObjectsFields(componentsPath) {
        return this.buildCustomObjectFieldsList(undefined, componentsPath);
    }
}
exports.ComponentUtils = ComponentUtils;
//# sourceMappingURL=metadataCmp.js.map