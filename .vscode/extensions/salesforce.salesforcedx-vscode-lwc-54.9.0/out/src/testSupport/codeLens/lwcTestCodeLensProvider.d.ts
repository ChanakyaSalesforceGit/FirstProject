import { CancellationToken, CodeLens, CodeLensProvider, ExtensionContext, TextDocument } from 'vscode';
/**
 * Code Lens Provider providing "Run Test" and "Debug Test" code lenses in LWC tests.
 */
declare class LwcTestCodeLensProvider implements CodeLensProvider {
    private onDidChangeCodeLensesEventEmitter;
    onDidChangeCodeLenses: import("vscode").Event<void>;
    /**
     * Refresh code lenses
     */
    refresh(): void;
    /**
     * Invoked by VS Code to provide code lenses
     * @param document text document
     * @param token cancellation token
     */
    provideCodeLenses(document: TextDocument, token: CancellationToken): Promise<CodeLens[]>;
}
export declare const lwcTestCodeLensProvider: LwcTestCodeLensProvider;
/**
 * Register Code Lens Provider with the extension context
 * @param context Extension context
 */
export declare function registerLwcTestCodeLensProvider(context: ExtensionContext): void;
export {};
//# sourceMappingURL=lwcTestCodeLensProvider.d.ts.map