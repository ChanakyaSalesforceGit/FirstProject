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
const src_1 = require("@salesforce/salesforcedx-utils-vscode/out/src");
const _1 = require(".");
/**
 * Manages the context of a workspace during a session with an open SFDX project.
 */
class WorkspaceContext {
    constructor() {
        this.onOrgChange = src_1.WorkspaceContextUtil.getInstance().onOrgChange;
        this.onOrgChange(this.handleCliConfigChange);
    }
    initialize(context) {
        return __awaiter(this, void 0, void 0, function* () {
            yield src_1.WorkspaceContextUtil.getInstance().initialize(context);
        });
    }
    static getInstance(forceNew = false) {
        if (!this.instance || forceNew) {
            this.instance = new WorkspaceContext();
        }
        return this.instance;
    }
    getConnection() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield src_1.WorkspaceContextUtil.getInstance().getConnection();
        });
    }
    handleCliConfigChange(orgInfo) {
        return __awaiter(this, void 0, void 0, function* () {
            _1.setupWorkspaceOrgType(orgInfo.username).catch(e => 
            // error reported by setupWorkspaceOrgType
            console.error(e));
        });
    }
    get username() {
        return src_1.WorkspaceContextUtil.getInstance().username;
    }
    get alias() {
        return src_1.WorkspaceContextUtil.getInstance().alias;
    }
}
exports.WorkspaceContext = WorkspaceContext;
//# sourceMappingURL=workspaceContext.js.map