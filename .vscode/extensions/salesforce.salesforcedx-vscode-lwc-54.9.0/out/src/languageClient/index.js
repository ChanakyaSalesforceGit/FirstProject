"use strict";
/*
 * Copyright (c) 2020, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const vscode_1 = require("vscode");
const vscode_languageclient_1 = require("vscode-languageclient");
// See https://github.com/Microsoft/vscode-languageserver-node/issues/105
function code2ProtocolConverter(value) {
    if (/^win32/.test(process.platform)) {
        // The *first* : is also being encoded which is not the standard for URI on Windows
        // Here we transform it back to the standard way
        return value.toString().replace('%3A', ':');
    }
    else {
        return value.toString();
    }
}
exports.code2ProtocolConverter = code2ProtocolConverter;
function protocol2CodeConverter(value) {
    return vscode_1.Uri.parse(value);
}
function createLanguageClient(serverPath) {
    // Setup the language server
    const debugOptions = { execArgv: ['--nolazy', '--inspect=6030'] };
    // If the extension is launched in debug mode then the debug server options are used
    // Otherwise the run options are used
    const serverOptions = {
        run: { module: serverPath, transport: vscode_languageclient_1.TransportKind.ipc },
        debug: {
            module: serverPath,
            transport: vscode_languageclient_1.TransportKind.ipc,
            options: debugOptions
        }
    };
    const clientOptions = {
        documentSelector: [
            { language: 'html', scheme: 'file' },
            { language: 'javascript', scheme: 'file' }
        ],
        synchronize: {
            fileEvents: [
                vscode_1.workspace.createFileSystemWatcher('**/*.resource'),
                vscode_1.workspace.createFileSystemWatcher('**/labels/CustomLabels.labels-meta.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/staticresources/*.resource-meta.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/contentassets/*.asset-meta.xml'),
                vscode_1.workspace.createFileSystemWatcher('**/lwc/*/*.js'),
                vscode_1.workspace.createFileSystemWatcher('**/modules/*/*/*.js'),
                // need to watch for directory deletions as no events are created for contents or deleted directories
                vscode_1.workspace.createFileSystemWatcher('**/', false, true, false)
            ]
        },
        uriConverters: {
            code2Protocol: code2ProtocolConverter,
            protocol2Code: protocol2CodeConverter
        }
    };
    return new vscode_languageclient_1.LanguageClient('lwcLanguageServer', 'LWC Language Server', serverOptions, clientOptions);
}
exports.createLanguageClient = createLanguageClient;
//# sourceMappingURL=index.js.map