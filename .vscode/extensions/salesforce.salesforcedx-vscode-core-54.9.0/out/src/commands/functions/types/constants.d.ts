import { GlobPattern } from 'vscode';
/**
 * Default port of a locally running function
 */
export declare const FUNCTION_DEFAULT_PORT = 8080;
/**
 * Default debug port of a locally running function
 */
export declare const FUNCTION_DEFAULT_DEBUG_PORT = 9229;
/**
 * Functions Payload pattern
 */
export declare const FUNCTION_PAYLOAD_PATTERN: GlobPattern;
/**
 * Functions payload document selector
 */
export declare const FUNCTION_PAYLOAD_DOCUMENT_SELECTOR: {
    language: string;
    pattern: string;
};
/**
 * Pattern to capture a function runtime language
 */
export declare const FUNCTION_RUNTIME_DETECTION_PATTERN: RegExp;
