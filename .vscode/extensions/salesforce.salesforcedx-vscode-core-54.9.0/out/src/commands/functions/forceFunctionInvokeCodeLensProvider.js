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
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path = require("path");
const vscode_1 = require("vscode");
const messages_1 = require("../../messages");
const constants_1 = require("./types/constants");
/**
 * Code Lens Provider providing "Invoke"
 */
class ForceFunctionInvokeCodeLensProvider {
    constructor() {
        this.onDidChangeCodeLensesEventEmitter = new vscode_1.EventEmitter();
        this.onDidChangeCodeLenses = this.onDidChangeCodeLensesEventEmitter.event;
    }
    /**
     * Refresh code lenses
     */
    refresh() {
        this.onDidChangeCodeLensesEventEmitter.fire();
    }
    /**
     * Invoked by VS Code to provide code lenses
     * @param document text document
     * @param token cancellation token
     */
    provideCodeLenses(document, token) {
        return __awaiter(this, void 0, void 0, function* () {
            return provideFunctionInvokeCodeLens(document, token);
        });
    }
}
exports.functionInvokeCodeLensProvider = new ForceFunctionInvokeCodeLensProvider();
/**
 * Register Code Lens Provider with the extension context
 * @param context Extension context
 */
function registerFunctionInvokeCodeLensProvider(context) {
    context.subscriptions.push(vscode_1.languages.registerCodeLensProvider(constants_1.FUNCTION_PAYLOAD_DOCUMENT_SELECTOR, exports.functionInvokeCodeLensProvider));
}
exports.registerFunctionInvokeCodeLensProvider = registerFunctionInvokeCodeLensProvider;
function provideFunctionInvokeCodeLens(document, token) {
    return __awaiter(this, void 0, void 0, function* () {
        const nonpayloadJsons = [
            'package.json',
            'package-lock.json',
            'tslint.json',
            'lerna.json',
            'tsconfig.json'
        ];
        if (nonpayloadJsons.includes(path.basename(document.uri.fsPath))) {
            return [];
        }
        const range = new vscode_1.Range(new vscode_1.Position(0, 0), new vscode_1.Position(0, 1));
        const commandTitle = messages_1.nls.localize('force_function_invoke_tooltip');
        const functionInvokeCommand = {
            command: 'sfdx.force.function.invoke',
            title: commandTitle,
            tooltip: commandTitle,
            arguments: [document.uri]
        };
        const invokeCodeLens = new vscode_1.CodeLens(range, functionInvokeCommand);
        const debugCommandTitle = messages_1.nls.localize('force_function_debug_invoke_tooltip');
        const functionDebugInvokeCommand = {
            command: 'sfdx.force.function.debugInvoke',
            title: debugCommandTitle,
            tooltip: debugCommandTitle,
            arguments: [document.uri]
        };
        const debugInvokeCodeLens = new vscode_1.CodeLens(range, functionDebugInvokeCommand);
        return [invokeCodeLens, debugInvokeCodeLens];
    });
}
exports.provideFunctionInvokeCodeLens = provideFunctionInvokeCodeLens;
//# sourceMappingURL=forceFunctionInvokeCodeLensProvider.js.map