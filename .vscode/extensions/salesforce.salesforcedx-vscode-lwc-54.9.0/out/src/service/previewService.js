"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const workspaceUtils_1 = require("../util/workspaceUtils");
class PreviewService {
    constructor() {
        this.rememberDeviceKey = 'preview.rememberDevice';
        this.logLevelKey = 'preview.logLevel';
        this.defaultLogLevel = 'warn';
    }
    static get instance() {
        if (PreviewService._instance === undefined) {
            PreviewService._instance = new PreviewService();
        }
        return PreviewService._instance;
    }
    getRememberedDevice(platform) {
        const store = workspaceUtils_1.WorkspaceUtils.instance.getGlobalStore();
        if (store === undefined) {
            return '';
        }
        return store.get(`last${platform}Device`) || '';
    }
    updateRememberedDevice(platform, deviceName) {
        const store = workspaceUtils_1.WorkspaceUtils.instance.getGlobalStore();
        if (store !== undefined) {
            store.update(`last${platform}Device`, deviceName);
        }
    }
    isRememberedDeviceEnabled() {
        return workspaceUtils_1.WorkspaceUtils.instance
            .getWorkspaceSettings()
            .get(this.rememberDeviceKey, false);
    }
    getLogLevel() {
        return (workspaceUtils_1.WorkspaceUtils.instance.getWorkspaceSettings().get(this.logLevelKey) ||
            this.defaultLogLevel);
    }
}
exports.PreviewService = PreviewService;
//# sourceMappingURL=previewService.js.map