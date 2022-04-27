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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const helpers_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/helpers");
const vscode = require("vscode");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
const util_1 = require("./util");
class ForcePackageInstallExecutor extends util_1.SfdxCommandletExecutor {
    constructor(options = { packageId: '', installationKey: '' }) {
        super();
        this.options = options;
    }
    build(data) {
        const builder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_package_install_text'))
            .withArg('force:package:install')
            .withFlag('--package', data.packageId)
            .withLogName('force_package_install');
        if (data.installationKey) {
            builder.withFlag('--installationkey', data.installationKey);
        }
        return builder.build();
    }
}
exports.ForcePackageInstallExecutor = ForcePackageInstallExecutor;
class SelectPackageID {
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageIdInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_package_id'),
                placeHolder: messages_1.nls.localize('package_id_gatherer_placeholder'),
                validateInput: value => {
                    return helpers_1.isRecordIdFormat(value, constants_1.PKG_ID_PREFIX) || value === ''
                        ? null
                        : messages_1.nls.localize('package_id_validation_error');
                }
            };
            const packageId = yield vscode.window.showInputBox(packageIdInputOptions);
            return packageId
                ? { type: 'CONTINUE', data: { packageId } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectPackageID = SelectPackageID;
class SelectInstallationKey {
    constructor(prefillValueProvider) {
        this.prefillValueProvider = prefillValueProvider;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const installationKeyInputOptions = {
                prompt: messages_1.nls.localize('parameter_gatherer_enter_installation_key_if_necessary')
            };
            if (this.prefillValueProvider) {
                installationKeyInputOptions.value = this.prefillValueProvider();
            }
            const installationKey = yield vscode.window.showInputBox(installationKeyInputOptions);
            return installationKey || installationKey === ''
                ? { type: 'CONTINUE', data: { installationKey } }
                : { type: 'CANCEL' };
        });
    }
}
exports.SelectInstallationKey = SelectInstallationKey;
const workspaceChecker = new util_1.EmptyPreChecker();
const parameterGatherer = new util_1.CompositeParametersGatherer(new SelectPackageID(), new SelectInstallationKey());
const sfdxPackageInstallCommandlet = new util_1.SfdxCommandlet(workspaceChecker, parameterGatherer, new ForcePackageInstallExecutor());
function forcePackageInstall() {
    return __awaiter(this, void 0, void 0, function* () {
        yield sfdxPackageInstallCommandlet.run();
    });
}
exports.forcePackageInstall = forcePackageInstall;
//# sourceMappingURL=forcePackageInstall.js.map