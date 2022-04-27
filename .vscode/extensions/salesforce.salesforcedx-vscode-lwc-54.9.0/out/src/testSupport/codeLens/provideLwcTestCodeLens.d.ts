import { CancellationToken, CodeLens, TextDocument } from 'vscode';
/**
 * Provide "Run Test" and "Debug Test" Code Lens for LWC tests.
 * We can move this implementation to lightning language server in the future.
 *
 * @param document text document
 * @param token cancellation token
 */
export declare function provideLwcTestCodeLens(document: TextDocument, token: CancellationToken): Promise<CodeLens[]>;
//# sourceMappingURL=provideLwcTestCodeLens.d.ts.map