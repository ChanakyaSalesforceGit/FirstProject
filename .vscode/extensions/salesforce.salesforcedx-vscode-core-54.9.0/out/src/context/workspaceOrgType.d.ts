export declare enum OrgType {
    SourceTracked = 0,
    NonSourceTracked = 1
}
export declare function getWorkspaceOrgType(defaultUsernameOrAlias?: string): Promise<OrgType>;
export declare function setWorkspaceOrgTypeWithOrgType(orgType: OrgType): void;
export declare function setupWorkspaceOrgType(defaultUsernameOrAlias?: string): Promise<void>;
export declare function getDefaultUsernameOrAlias(): Promise<string | undefined>;
