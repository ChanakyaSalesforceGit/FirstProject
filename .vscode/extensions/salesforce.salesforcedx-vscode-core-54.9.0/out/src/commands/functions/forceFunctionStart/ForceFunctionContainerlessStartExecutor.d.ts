import { Disposable } from 'vscode';
import { ForceFunctionStartExecutor } from './ForceFunctionStartExecutor';
export declare class ForceFunctionContainerlessStartExecutor extends ForceFunctionStartExecutor {
    setupFunctionListeners(): Promise<void>;
    cancelFunction(registeredStartedFunctionDisposable: Disposable): Promise<void>;
    buildFunction(): Promise<void>;
    startFunction(functionName: string, functionDirPath: string): void;
}
