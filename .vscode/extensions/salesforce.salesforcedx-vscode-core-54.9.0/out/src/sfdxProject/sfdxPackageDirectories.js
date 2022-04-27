"use strict";
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sfdxProject_1 = require("../sfdxProject");
const path = require("path");
const util_1 = require("../util");
class SfdxPackageDirectories {
    static getPackageDirectoryPaths() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageDirectories = (yield sfdxProject_1.SfdxProjectConfig.getValue('packageDirectories'));
            if (packageDirectories) {
                let packageDirectoryPaths = [];
                packageDirectories.forEach(packageDir => {
                    if (packageDir) {
                        const packageDirectory = packageDir;
                        if (packageDirectory.path) {
                            let dirPath = packageDirectory.path;
                            dirPath = dirPath.trim();
                            if (dirPath.startsWith(path.sep)) {
                                dirPath = dirPath.substring(1);
                            }
                            if (packageDirectory.default) {
                                packageDirectoryPaths = [dirPath].concat(packageDirectoryPaths);
                            }
                            else {
                                packageDirectoryPaths.push(dirPath);
                            }
                        }
                    }
                });
                if (packageDirectoryPaths.length === 0) {
                    const error = new Error();
                    error.name = 'NoPackageDirectoryPathsFound';
                    throw error;
                }
                return Promise.resolve(packageDirectoryPaths);
            }
            else {
                const error = new Error();
                error.name = 'NoPackageDirectoriesFound';
                throw error;
            }
        });
    }
    static getPackageDirectoryFullPaths() {
        return __awaiter(this, void 0, void 0, function* () {
            const packageDirectoryPaths = yield SfdxPackageDirectories.getPackageDirectoryPaths();
            const sfdxProjectPath = util_1.getRootWorkspacePath();
            return packageDirectoryPaths.map(packageDirectoryPath => path.join(sfdxProjectPath, packageDirectoryPath));
        });
    }
    static isInPackageDirectory(filePath) {
        return __awaiter(this, void 0, void 0, function* () {
            let filePathIsInPackageDirectory = false;
            const packageDirectoryPaths = yield SfdxPackageDirectories.getPackageDirectoryFullPaths();
            for (const packageDirectoryPath of packageDirectoryPaths) {
                if (filePath.startsWith(packageDirectoryPath)) {
                    filePathIsInPackageDirectory = true;
                    break;
                }
            }
            return filePathIsInPackageDirectory;
        });
    }
    static getDefaultPackageDir() {
        return __awaiter(this, void 0, void 0, function* () {
            let packageDirs = [];
            try {
                packageDirs = yield SfdxPackageDirectories.getPackageDirectoryPaths();
            }
            catch (e) {
                if (e.name !== 'NoPackageDirectoryPathsFound' &&
                    e.name !== 'NoPackageDirectoriesFound') {
                    throw e;
                }
            }
            return packageDirs && packageDirs.length ? packageDirs[0] : undefined;
        });
    }
}
exports.default = SfdxPackageDirectories;
//# sourceMappingURL=sfdxPackageDirectories.js.map