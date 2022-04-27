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
/*
 * Copyright (c) 2018, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require("path");
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const vscode = require("vscode");
const sfdxCommandlet_1 = require("./util/sfdxCommandlet");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const telemetry_1 = require("../telemetry");
const util_1 = require("../util");
class ForceSourceDeleteExecutor extends sfdxCommandlet_1.SfdxCommandletExecutor {
    build(data) {
        const commandBuilder = new cli_1.SfdxCommandBuilder()
            .withDescription(messages_1.nls.localize('force_source_delete_text'))
            .withArg('force:source:delete')
            .withLogName('force_source_delete')
            .withFlag('--sourcepath', data.filePath)
            .withArg('--noprompt');
        return commandBuilder.build();
    }
}
exports.ForceSourceDeleteExecutor = ForceSourceDeleteExecutor;
class ManifestChecker {
    constructor(uri) {
        this.explorerPath = uri.fsPath;
    }
    check() {
        if (util_1.hasRootWorkspace()) {
            const workspaceRootPath = util_1.getRootWorkspacePath();
            const manifestPath = path.join(workspaceRootPath, 'manifest');
            const isManifestFile = this.explorerPath.includes(manifestPath);
            if (isManifestFile) {
                notifications_1.notificationService.showErrorMessage(messages_1.nls.localize('force_source_delete_manifest_unsupported_message'));
                return false;
            }
            return true;
        }
        return false;
    }
}
exports.ManifestChecker = ManifestChecker;
class ConfirmationAndSourcePathGatherer {
    constructor(uri) {
        this.PROCEED = messages_1.nls.localize('confirm_delete_source_button_text');
        this.CANCEL = messages_1.nls.localize('cancel_delete_source_button_text');
        this.explorerPath = uri.fsPath;
    }
    gather() {
        return __awaiter(this, void 0, void 0, function* () {
            const prompt = messages_1.nls.localize('force_source_delete_confirmation_message');
            const response = yield vscode.window.showInformationMessage(prompt, this.PROCEED, this.CANCEL);
            return response && response === this.PROCEED
                ? { type: 'CONTINUE', data: { filePath: this.explorerPath } }
                : { type: 'CANCEL' };
        });
    }
}
exports.ConfirmationAndSourcePathGatherer = ConfirmationAndSourcePathGatherer;
function forceSourceDelete(sourceUri) {
    return __awaiter(this, void 0, void 0, function* () {
        if (!sourceUri) {
            const editor = vscode.window.activeTextEditor;
            if (editor && editor.document.languageId !== 'forcesourcemanifest') {
                sourceUri = editor.document.uri;
            }
            else {
                const errorMessage = messages_1.nls.localize('force_source_delete_select_file_or_directory');
                telemetry_1.telemetryService.sendException('force_source_delete', errorMessage);
                notifications_1.notificationService.showErrorMessage(errorMessage);
                channels_1.channelService.appendLine(errorMessage);
                channels_1.channelService.showChannelOutput();
                return;
            }
        }
        const manifestChecker = new ManifestChecker(sourceUri);
        const commandlet = new sfdxCommandlet_1.SfdxCommandlet(manifestChecker, new ConfirmationAndSourcePathGatherer(sourceUri), new ForceSourceDeleteExecutor());
        yield commandlet.run();
    });
}
exports.forceSourceDelete = forceSourceDelete;
//# sourceMappingURL=forceSourceDelete.js.map