import { TemplateOptions, TemplateType } from '@salesforce/templates';
import { CommandletExecutor, SourcePathStrategy } from '../util';
import { Properties } from '@salesforce/salesforcedx-utils-vscode/out/src';
import { ContinueResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
/**
 * Base class for all template commands
 */
export declare abstract class LibraryBaseTemplateCommand<T> implements CommandletExecutor<T> {
    private _metadataType;
    protected showChannelOutput: boolean;
    /**
     * Command name
     */
    abstract get executionName(): string;
    /**
     * Command telemetry name
     */
    abstract get telemetryName(): string;
    /**
     * Template type
     */
    abstract get templateType(): TemplateType;
    /**
     * Construct template creation options from user input
     * @param data data from Continue response
     */
    abstract constructTemplateOptions(data: T): TemplateOptions;
    /**
     * Additional telemetry properties to log on successful execution
     */
    protected telemetryProperties: Properties;
    execute(response: ContinueResponse<T>): Promise<void>;
    private createTemplate;
    protected openCreatedTemplateInVSCode(outputdir: string, fileName: string): Promise<void>;
    /**
     * Specify one of the metadata types from one of metadataTypeConstants.
     * if this is not specified, you should override openCreatedTemplateInVSCode
     * or getSourcePathStrategy/getFileExtension/getDefaultDirectory.
     */
    metadataTypeName: string;
    /**
     * Locate output file name from user input.
     * We use this function to determine the file name to open,
     * after template creation completes.
     * @param data data from ContinueResponse
     */
    abstract getOutputFileName(data: T): string;
    private get metadataType();
    private identifyDirType;
    private getPathToSource;
    getSourcePathStrategy(): SourcePathStrategy;
    getFileExtension(): string;
    getDefaultDirectory(): string;
}
