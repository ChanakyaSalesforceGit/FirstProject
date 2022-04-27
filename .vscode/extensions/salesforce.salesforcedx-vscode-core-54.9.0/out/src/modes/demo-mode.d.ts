export declare function isDemoMode(): boolean;
export declare type authResponse = {
    orgId: string;
    username: string;
    accessToken?: string;
    instanceUrl?: string;
    refreshToken?: string;
    loginUrl?: string;
    clientId?: string;
    trialExpirationDate?: string | null;
    clientSecret?: string;
};
export declare function isProdOrg(response: {
    status: number;
    result: authResponse;
}): boolean;
