import { SourcePathStrategy } from '../commands/util';
export declare class MetadataDictionary {
    static getInfo(metadataType: string): MetadataInfo | undefined;
}
export declare type MetadataInfo = {
    type: string;
    suffix: string;
    directory: string;
    pathStrategy: SourcePathStrategy;
    extensions?: string[];
};
