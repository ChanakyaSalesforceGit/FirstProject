import { Predicate, PredicateResponse } from '@salesforce/salesforcedx-utils-vscode/out/src/predicates';
import { workspace } from 'vscode';
export declare class IsSfdxProjectOpened implements Predicate<typeof workspace> {
    apply(item: typeof workspace): PredicateResponse;
}
