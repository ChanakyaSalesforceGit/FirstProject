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
const strip_ansi_1 = require("strip-ansi");
const commandConstants_1 = require("../commands/commandConstants");
class DevServerService {
    constructor() {
        this.handlers = new Set();
        this.baseUrl = commandConstants_1.DEV_SERVER_DEFAULT_BASE_URL;
    }
    static get instance() {
        if (DevServerService._instance === undefined) {
            DevServerService._instance = new DevServerService();
        }
        return DevServerService._instance;
    }
    isServerHandlerRegistered() {
        return this.handlers.size > 0;
    }
    registerServerHandler(handler) {
        this.handlers.add(handler);
    }
    clearServerHandler(handler) {
        if (handler) {
            this.handlers.delete(handler);
        }
    }
    getServerHandlers() {
        return [...this.handlers];
    }
    stopServer() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this.handlers.size > 0) {
                const promises = [...this.handlers].map(handler => handler.stop());
                yield Promise.all(promises);
                this.handlers.clear();
                console.log('successfully stopped lwc dev server(s)');
            }
            else {
                console.log('lwc dev server was not running');
            }
        });
    }
    getBaseUrl() {
        return this.baseUrl;
    }
    setBaseUrlFromDevServerUpMessage(data) {
        const sanitizedData = strip_ansi_1.default(data);
        if (sanitizedData.match(commandConstants_1.DEV_SERVER_BASE_URL_REGEX)) {
            this.baseUrl = sanitizedData.match(commandConstants_1.DEV_SERVER_BASE_URL_REGEX)[0];
        }
    }
    getComponentPreviewUrl(componentName) {
        return `${this.baseUrl}/${commandConstants_1.DEV_SERVER_PREVIEW_ROUTE}/${componentName}`;
    }
}
exports.DevServerService = DevServerService;
//# sourceMappingURL=devServerService.js.map