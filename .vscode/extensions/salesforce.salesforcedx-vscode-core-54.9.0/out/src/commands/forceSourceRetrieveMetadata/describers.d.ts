import { LocalComponent } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { RetrieveDescriber } from '.';
import { BrowserNode } from '../../orgBrowser';
declare abstract class NodeDescriber implements RetrieveDescriber {
    protected node: BrowserNode;
    constructor(node: BrowserNode);
    abstract buildMetadataArg(): string;
    abstract gatherOutputLocations(): Promise<LocalComponent[]>;
    protected buildOutput(node: BrowserNode): Promise<LocalComponent[]>;
}
declare class TypeNodeDescriber extends NodeDescriber {
    buildMetadataArg(data?: LocalComponent[]): string;
    gatherOutputLocations(): Promise<LocalComponent[]>;
}
declare class ComponentNodeDescriber extends NodeDescriber {
    buildMetadataArg(): string;
    gatherOutputLocations(): Promise<LocalComponent[]>;
}
export declare class RetrieveDescriberFactory {
    static createTypeNodeDescriber(node: BrowserNode): TypeNodeDescriber;
    static createComponentNodeDescriber(node: BrowserNode): ComponentNodeDescriber;
}
export {};
