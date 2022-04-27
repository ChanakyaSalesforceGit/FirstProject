import { Command } from '@salesforce/salesforcedx-utils-vscode/out/src/cli';
import { CancelResponse, ContinueResponse, ParametersGatherer } from '@salesforce/salesforcedx-utils-vscode/out/src/types';
import { SfdxCommandletExecutor } from './util';
export declare class ForcePackageInstallExecutor extends SfdxCommandletExecutor<PackageIdAndInstallationKey> {
    private readonly options;
    constructor(options?: {
        packageId: string;
        installationKey: string;
    });
    build(data: PackageIdAndInstallationKey): Command;
}
export declare type PackageIdAndInstallationKey = PackageID & InstallationKey;
export interface PackageID {
    packageId: string;
}
export interface InstallationKey {
    installationKey: string;
}
export declare class SelectPackageID implements ParametersGatherer<PackageID> {
    gather(): Promise<CancelResponse | ContinueResponse<PackageID>>;
}
export declare class SelectInstallationKey implements ParametersGatherer<InstallationKey> {
    private readonly prefillValueProvider?;
    constructor(prefillValueProvider?: () => string);
    gather(): Promise<CancelResponse | ContinueResponse<InstallationKey>>;
}
export declare function forcePackageInstall(): Promise<void>;
