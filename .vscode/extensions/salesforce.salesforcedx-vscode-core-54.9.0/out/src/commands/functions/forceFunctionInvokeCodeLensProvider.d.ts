import { CancellationToken, CodeLens, CodeLensProvider, ExtensionContext, TextDocument } from 'vscode';
/**
 * Code Lens Provider providing "Invoke"
 */
declare class ForceFunctionInvokeCodeLensProvider implements CodeLensProvider {
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
export declare const functionInvokeCodeLensProvider: ForceFunctionInvokeCodeLensProvider;
/**
 * Register Code Lens Provider with the extension context
 * @param context Extension context
 */
export declare function registerFunctionInvokeCodeLensProvider(context: ExtensionContext): void;
export declare function provideFunctionInvokeCodeLens(document: TextDocument, token: CancellationToken): Promise<CodeLens[]>;
export {};
