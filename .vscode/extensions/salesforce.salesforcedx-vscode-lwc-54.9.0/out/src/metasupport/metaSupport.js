"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
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
const path = require("path");
const vscode = require("vscode");
const channel_1 = require("../channel");
const messages_1 = require("../messages");
const EXTENSION_NAME = 'salesforce.salesforcedx-vscode-lwc';
class MetaSupport {
    static initializeSupport() {
        if (!MetaSupport.instance) {
            MetaSupport.instance = new MetaSupport();
        }
        return MetaSupport.instance;
    }
    /**
     * Returns path to the XSD and XML files from the extension folder.
     * TODO: use npm install to deliever these files.
     * @param targetFileName - a list of file names
     * @returns - a list of path for each file name
     */
    getLocalFilePath(targetFileNames) {
        const thisExtPath = vscode.extensions.getExtension(EXTENSION_NAME)
            .extensionPath;
        const listOfPaths = [];
        targetFileNames.forEach(targetFileName => {
            listOfPaths.push(path.join(thisExtPath, 'resources', 'static', targetFileName));
        });
        return listOfPaths;
    }
    /**
     * A Promise to setup Redhat XML API
     * @param inputCatalogs - a list of catalog file names
     * @param inputFileAssociations - a list of dictionary specifying file associations
     * @returns - None
     */
    setupRedhatXml(inputCatalogs, inputFileAssociations) {
        return __awaiter(this, void 0, void 0, function* () {
            const redHatExtension = vscode.extensions.getExtension('redhat.vscode-xml');
            try {
                const extensionApi = yield redHatExtension.activate();
                extensionApi.addXMLCatalogs(inputCatalogs);
                extensionApi.addXMLFileAssociations(inputFileAssociations);
            }
            catch (error) {
                channel_1.channelService.appendLine(messages_1.nls.localize('force_lightning_lwc_fail_redhat_extension'));
                const errorMsg = error.message ? error.message : error;
                channel_1.channelService.appendLine(errorMsg);
            }
        });
    }
    /**
     * This function checks the enviornment and passes relevant settings
     * to set up RedHat XML
     */
    getMetaSupport() {
        return __awaiter(this, void 0, void 0, function* () {
            // redHatExtension API reference: https://github.com/redhat-developer/vscode-xml/pull/292
            const redHatExtension = vscode.extensions.getExtension('redhat.vscode-xml');
            if (redHatExtension === undefined) {
                channel_1.channelService.appendLine(messages_1.nls.localize('force_lightning_lwc_no_redhat_extension_found'));
            }
            else if (redHatExtension) {
                const pluginVersionNumber = redHatExtension.packageJSON['version'];
                // checks if the installed plugin version is exactly 0.14.0 or 0.16+,
                // 0.15.0 has a regression and 0.13.0 or earlier versions are not supported
                const major = parseInt(pluginVersionNumber.split('.')[0], 10);
                const minor = parseInt(pluginVersionNumber.split('.')[1], 10);
                if (major >= 1 || minor === 14 || minor >= 16) {
                    const catalogs = this.getLocalFilePath(['js-meta-home.xml']);
                    const fileAssociations = [
                        {
                            systemId: this.getLocalFilePath(['js-meta.xsd'])[0],
                            pattern: '**/*js-meta.xml'
                        }
                    ];
                    yield this.setupRedhatXml(catalogs, fileAssociations);
                }
                else if (minor === 15) {
                    channel_1.channelService.appendLine(messages_1.nls.localize('force_lightning_lwc_redhat_extension_regression'));
                }
                else {
                    channel_1.channelService.appendLine(messages_1.nls.localize('force_lightning_lwc_deprecated_redhat_extension'));
                }
            }
        });
    }
}
exports.MetaSupport = MetaSupport;
//# sourceMappingURL=metaSupport.js.map