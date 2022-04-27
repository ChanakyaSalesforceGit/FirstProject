import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { DirFileNameSelection } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SourcePathStrategy } from '../util';
import { BaseTemplateCommand } from './baseTemplateCommand';
export declare class ForceLightningLwcTestCreateExecutor extends BaseTemplateCommand {
    constructor();
    build(data: DirFileNameSelection): Command;
    getSourcePathStrategy(): SourcePathStrategy;
}
export declare function forceLightningLwcTestCreate(): Promise<void>;
