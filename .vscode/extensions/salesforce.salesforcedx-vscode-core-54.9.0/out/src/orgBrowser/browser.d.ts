import { ExtensionContext, TreeView } from 'vscode';
import { BrowserNode, MetadataOutlineProvider } from '../orgBrowser';
export declare class OrgBrowser {
    private static VIEW_ID;
    private static instance;
    private _treeView?;
    private _dataProvider?;
    private constructor();
    static getInstance(): OrgBrowser;
    get treeView(): TreeView<BrowserNode>;
    get dataProvider(): MetadataOutlineProvider;
    init(extensionContext: ExtensionContext): Promise<void>;
    refreshAndExpand(node: BrowserNode): Promise<void>;
    private initError;
}
