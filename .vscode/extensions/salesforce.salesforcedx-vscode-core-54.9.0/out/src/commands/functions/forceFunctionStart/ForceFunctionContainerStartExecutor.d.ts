import * as vscode from 'vscode';
import { ForceFunctionStartExecutor } from './ForceFunctionStartExecutor';
export declare enum BINARY_EVENT_ENUM {
    CONTAINER = "container",
    ERROR = "error",
    LOG = "log",
    PACK = "pack"
}
export declare class ForceFunctionContainerStartExecutor extends ForceFunctionStartExecutor {
    private functionsBinary;
    setupFunctionListeners(functionDirPath: string, functionDisposable: vscode.Disposable): Promise<void>;
    cancelFunction(registeredStartedFunctionDisposable: vscode.Disposable): Promise<void>;
    buildFunction(functionName: string, functionDirPath: string): Promise<void>;
    startFunction(functionName: string): void;
}
