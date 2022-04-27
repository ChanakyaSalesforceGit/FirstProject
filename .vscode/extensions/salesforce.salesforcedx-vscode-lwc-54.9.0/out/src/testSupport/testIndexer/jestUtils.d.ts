import { IParseResults, ItBlock, ParsedNode } from 'jest-editor-support';
import * as vscode from 'vscode';
declare type ParsedNodeWithAncestorTitles = Pick<ParsedNode, Exclude<keyof ParsedNode, 'children'>> & {
    name?: string;
    ancestorTitles?: string[];
    children?: ParsedNodeWithAncestorTitles[];
};
/**
 * Extended itBlock definition with ancestor titles
 */
export declare type ItBlockWithAncestorTitles = ItBlock & {
    ancestorTitles?: string[];
};
/**
 * Extended parse results definition with extended itBlock definition
 */
export declare type IExtendedParseResults = Pick<IParseResults, Exclude<keyof IParseResults, 'root'>> & {
    root: ParsedNodeWithAncestorTitles;
    itBlocksWithAncestorTitles?: ItBlockWithAncestorTitles[];
};
/**
 * Populate ancestor titles for itBlocks
 * @param parsedResult original parse results
 */
export declare function populateAncestorTitles(parsedResult: IExtendedParseResults): IExtendedParseResults | undefined;
/**
 * Extract the VS Code position from failure message stacktrace in Jest output.
 * @param testFsPath test file path
 * @param failureMessage failure message from Jest output
 */
export declare function extractPositionFromFailureMessage(testFsPath: string, failureMessage: string): vscode.Position | undefined;
/**
 * Strip the ANSI color codes from failure message
 * @param failureMessage failure message from Jest output
 */
export declare function sanitizeFailureMessage(failureMessage: string): string;
export {};
//# sourceMappingURL=jestUtils.d.ts.map