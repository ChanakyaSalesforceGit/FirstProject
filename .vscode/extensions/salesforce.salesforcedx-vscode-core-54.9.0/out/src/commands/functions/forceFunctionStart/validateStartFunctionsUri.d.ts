import { Uri } from 'vscode';
export declare const WARNING_MSG_KEY = "force_function_start_warning_not_in_function_folder";
export declare const NO_FUNCTION_FOLDER_KEY = "force_function_start_not_in_function_folder";
export declare const validateStartFunctionsUri: (sourceUri?: Uri | undefined) => Uri | undefined;
