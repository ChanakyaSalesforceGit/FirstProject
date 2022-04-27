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
const vscode_1 = require("vscode");
const constants_1 = require("../types/constants");
const provideLwcTestCodeLens_1 = require("./provideLwcTestCodeLens");
/**
 * Code Lens Provider providing "Run Test" and "Debug Test" code lenses in LWC tests.
 */
class LwcTestCodeLensProvider {
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
            return provideLwcTestCodeLens_1.provideLwcTestCodeLens(document, token);
        });
    }
}
exports.lwcTestCodeLensProvider = new LwcTestCodeLensProvider();
/**
 * Register Code Lens Provider with the extension context
 * @param context Extension context
 */
function registerLwcTestCodeLensProvider(context) {
    context.subscriptions.push(vscode_1.languages.registerCodeLensProvider(constants_1.LWC_TEST_DOCUMENT_SELECTOR, exports.lwcTestCodeLensProvider));
}
exports.registerLwcTestCodeLensProvider = registerLwcTestCodeLensProvider;
//# sourceMappingURL=lwcTestCodeLensProvider.js.map