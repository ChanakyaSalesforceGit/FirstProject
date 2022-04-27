import { Uri } from 'vscode';
export declare const CONTAINER_START_TEXT_KEY = "force_function_containerless_start_text";
export declare const FUNCTION_CONTAINER_LOG_NAME = "force_function_containerless_start";
/**
 * Executes sfdx run:function:start:local --verbose
 * @param sourceUri
 */
export declare const forceFunctionContainerlessStartCommand: (sourceUri?: Uri | undefined) => Promise<void>;
