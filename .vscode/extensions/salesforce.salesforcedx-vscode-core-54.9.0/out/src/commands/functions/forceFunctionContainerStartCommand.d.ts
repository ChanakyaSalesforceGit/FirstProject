import { Uri } from 'vscode';
export declare const CONTAINER_START_TEXT_KEY = "force_function_container_start_text";
export declare const FUNCTION_CONTAINER_LOG_NAME = "force_function_container_start";
/**
 * Executes sfdx run:function:start --verbose
 * @param sourceUri
 */
export declare const forceFunctionContainerStartCommand: (sourceUri?: Uri | undefined) => Promise<void>;
