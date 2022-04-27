declare class DefaultPathStrategy implements SourcePathStrategy {
    getPathToSource(dirPath: string, fileName: string, fileExt: string): string;
}
declare class BundlePathStrategy implements SourcePathStrategy {
    getPathToSource(dirPath: string, fileName: string, fileExt: string): string;
}
declare class WaveTemplateBundlePathStrategy implements SourcePathStrategy {
    getPathToSource(dirPath: string, fileName: string, fileExt: string): string;
}
declare class FunctionTemplatePathStrategy implements SourcePathStrategy {
    getPathToSource(dirPath: string, fileName: string, fileExt: string): string;
}
declare class LwcTestPathStrategy implements SourcePathStrategy {
    getPathToSource(dirPath: string, fileName: string, fileExt: string): string;
}
export interface SourcePathStrategy {
    getPathToSource(dirPath: string, fileName: string, fileExt: string): string;
}
export declare class PathStrategyFactory {
    static createDefaultStrategy(): DefaultPathStrategy;
    static createLwcTestStrategy(): LwcTestPathStrategy;
    static createBundleStrategy(): BundlePathStrategy;
    static createWaveTemplateBundleStrategy(): WaveTemplateBundlePathStrategy;
    static createFunctionTemplateStrategy(): FunctionTemplatePathStrategy;
    static createFunctionJavaTemplateStrategy(): FunctionTemplatePathStrategy;
}
export {};
