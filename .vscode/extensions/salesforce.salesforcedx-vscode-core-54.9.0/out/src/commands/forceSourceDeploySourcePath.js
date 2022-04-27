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
const cli_1 = require("@salesforce/salesforcedx-utils-vscode/out/src/cli");
const source_deploy_retrieve_1 = require("@salesforce/source-deploy-retrieve");
const vscode = require("vscode");
const channels_1 = require("../channels");
const messages_1 = require("../messages");
const notifications_1 = require("../notifications");
const sfdxProject_1 = require("../sfdxProject");
const telemetry_1 = require("../telemetry");
const baseDeployRetrieve_1 = require("./baseDeployRetrieve");
const forceSourceRetrieveSourcePath_1 = require("./forceSourceRetrieveSourcePath");
const util_1 = require("./util");
const postconditionCheckers_1 = require("./util/postconditionCheckers");
class LibraryDeploySourcePathExecutor extends baseDeployRetrieve_1.DeployExecutor {
    constructor() {
        super(messages_1.nls.localize('force_source_deploy_text'), 'force_source_deploy_with_sourcepath_beta');
    }
    getComponents(response) {
        return __awaiter(this, void 0, void 0, function* () {
            const sourceApiVersion = (yield sfdxProject_1.SfdxProjectConfig.getValue('sourceApiVersion'));
            const paths = typeof response.data === 'string' ? [response.data] : response.data;
            const componentSet = source_deploy_retrieve_1.ComponentSet.fromSource(paths);
            componentSet.sourceApiVersion = sourceApiVersion;
            return componentSet;
        });
    }
}
exports.LibraryDeploySourcePathExecutor = LibraryDeploySourcePathExecutor;
exports.forceSourceDeploySourcePaths = (sourceUri, uris) => __awaiter(void 0, void 0, void 0, function* () {
    if (!sourceUri) {
        // When the source is deployed via the command palette, both sourceUri and uris are
        // each undefined, and sourceUri needs to be obtained from the active text editor.
        sourceUri = exports.getUriFromActiveEditor();
        if (!sourceUri) {
            return;
        }
    }
    // When a single file is selected and "Deploy Source from Org" is executed,
    // sourceUri is passed, and the uris array contains a single element, the same
    // path as sourceUri.
    //
    // When multiple files are selected and "Deploy Source from Org" is executed,
    // sourceUri is passed, and is the path to the first selected file, and the uris
    // array contains an array of all paths that were selected.
    //
    // When editing a file and "Deploy This Source from Org" is executed,
    // sourceUri is passed, but uris is undefined.
    if (!uris || uris.length < 1) {
        if (Array.isArray(sourceUri)) {
            // When "Push-or-deploy-on-save" is enabled, the first parameter
            // passed in (sourceUri) is actually an array and not a single URI.
            uris = sourceUri;
        }
        else {
            uris = [];
            uris.push(sourceUri);
        }
    }
    const messages = {
        warningMessageKey: 'conflict_detect_conflicts_during_deploy',
        commandHint: inputs => {
            const commands = [];
            inputs.forEach(input => {
                commands.push(new cli_1.SfdxCommandBuilder()
                    .withArg('force:source:deploy')
                    .withFlag('--sourcepath', input)
                    .build()
                    .toString());
            });
            const hints = commands.join('\n  ');
            return hints;
        }
    };
    const commandlet = new util_1.SfdxCommandlet(new util_1.SfdxWorkspaceChecker(), new util_1.LibraryPathsGatherer(uris), new LibraryDeploySourcePathExecutor(), new postconditionCheckers_1.CompositePostconditionChecker(new forceSourceRetrieveSourcePath_1.SourcePathChecker(), new postconditionCheckers_1.TimestampConflictChecker(false, messages)));
    yield commandlet.run();
});
exports.getUriFromActiveEditor = () => {
    const editor = vscode.window.activeTextEditor;
    if (editor && editor.document.languageId !== 'forcesourcemanifest') {
        return editor.document.uri;
    }
    const errorMessage = messages_1.nls.localize('force_source_deploy_select_file_or_directory');
    telemetry_1.telemetryService.sendException('force_source_deploy_with_sourcepath', errorMessage);
    notifications_1.notificationService.showErrorMessage(errorMessage);
    channels_1.channelService.appendLine(errorMessage);
    channels_1.channelService.showChannelOutput();
    return undefined;
};
//# sourceMappingURL=forceSourceDeploySourcePath.js.map