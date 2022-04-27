"use strict";
/*
 * Copyright (c) 2021, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const path = require("path");
/**
 * Finds the file paths of files that differ for a component stored in two locations
 * @param projectComponent The local SourceComponent
 * @param cacheComponent The remote SourceComponent, stored in a local cache
 * @param projectRoot The common root of all files in the projectComponent
 * @param cacheRoot The common root of all files in the cacheComponent
 * @returns An array of file paths, where each element corresponds to one file that differs
 */
function diffComponents(projectComponent, cacheComponent) {
    var _a, _b, _c, _d;
    const diffs = [];
    const projectIndex = new Map();
    const projectPaths = projectComponent.walkContent();
    if (projectComponent.xml) {
        projectPaths.push(projectComponent.xml);
    }
    const projectRoot = (_a = projectComponent.content) !== null && _a !== void 0 ? _a : ((_b = projectComponent.xml) !== null && _b !== void 0 ? _b : '');
    for (const file of projectPaths) {
        const key = path.relative(projectRoot, file);
        projectIndex.set(key, file);
    }
    const cacheIndex = new Map();
    const cachePaths = cacheComponent.walkContent();
    if (cacheComponent.xml) {
        cachePaths.push(cacheComponent.xml);
    }
    const cacheRoot = (_c = cacheComponent.content) !== null && _c !== void 0 ? _c : ((_d = cacheComponent.xml) !== null && _d !== void 0 ? _d : '');
    for (const file of cachePaths) {
        const key = path.relative(cacheRoot, file);
        cacheIndex.set(key, file);
    }
    projectIndex.forEach((projectPath, key) => {
        const cachePath = cacheIndex.get(key);
        if (cachePath && filesDiffer(projectPath, cachePath)) {
            diffs.push({ projectPath, cachePath });
        }
    });
    return diffs;
}
exports.diffComponents = diffComponents;
function filesDiffer(projectPath, cachePath) {
    const bufferOne = fs.readFileSync(projectPath);
    const bufferTwo = fs.readFileSync(cachePath);
    return !bufferOne.equals(bufferTwo);
}
//# sourceMappingURL=componentDiffer.js.map