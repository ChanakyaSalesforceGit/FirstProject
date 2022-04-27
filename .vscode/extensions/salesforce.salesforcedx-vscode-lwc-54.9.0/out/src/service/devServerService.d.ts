export interface ServerHandler {
    stop(): Promise<void>;
}
export declare class DevServerService {
    private static _instance;
    static get instance(): DevServerService;
    private handlers;
    private baseUrl;
    isServerHandlerRegistered(): boolean;
    registerServerHandler(handler: ServerHandler): void;
    clearServerHandler(handler: ServerHandler): void;
    getServerHandlers(): ServerHandler[];
    stopServer(): Promise<void>;
    getBaseUrl(): string;
    setBaseUrlFromDevServerUpMessage(data: string): void;
    getComponentPreviewUrl(componentName: string): string;
}
//# sourceMappingURL=devServerService.d.ts.map