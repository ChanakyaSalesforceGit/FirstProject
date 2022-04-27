/**
 * Stop all running function containers.
 * Currently, we don't support stopping individual containers,
 * because we don't support running multiple containers.
 */
export declare function forceFunctionStop(): Promise<void>;
