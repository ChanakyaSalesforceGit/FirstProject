import { PlatformName } from '../commands/forceLightningLwcPreview';
export declare class PreviewService {
    private rememberDeviceKey;
    private logLevelKey;
    private defaultLogLevel;
    private static _instance;
    static get instance(): PreviewService;
    getRememberedDevice(platform: keyof typeof PlatformName): string;
    updateRememberedDevice(platform: keyof typeof PlatformName, deviceName: string): void;
    isRememberedDeviceEnabled(): boolean;
    getLogLevel(): string;
}
//# sourceMappingURL=previewService.d.ts.map