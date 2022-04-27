"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/*
 * Copyright (c) 2019, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
const path_1 = require("path");
class DefaultPathStrategy {
    getPathToSource(dirPath, fileName, fileExt) {
        return path_1.join(dirPath, `${fileName}${fileExt}`);
    }
}
class BundlePathStrategy {
    getPathToSource(dirPath, fileName, fileExt) {
        const bundleName = fileName;
        return path_1.join(dirPath, bundleName, `${fileName}${fileExt}`);
    }
}
class WaveTemplateBundlePathStrategy {
    getPathToSource(dirPath, fileName, fileExt) {
        const bundleName = fileName;
        // template-info is the main static file name for all WaveTemplateBundles
        return path_1.join(dirPath, bundleName, `template-info${fileExt}`);
    }
}
class FunctionTemplatePathStrategy {
    getPathToSource(dirPath, fileName, fileExt) {
        return path_1.join(dirPath, `index${fileExt}`);
    }
}
class FunctionJavaTemplatePathStrategy {
    getPathToSource(dirPath, fileName, fileExt) {
        const className = fileName.charAt(0).toUpperCase() + fileName.slice(1) + 'Function';
        return path_1.join(dirPath, 'src', 'main', 'java', 'com', 'example', `${className}${fileExt}`);
    }
}
class LwcTestPathStrategy {
    getPathToSource(dirPath, fileName, fileExt) {
        return path_1.join(dirPath, '__tests__', `${fileName}.test${fileExt}`);
    }
}
class PathStrategyFactory {
    static createDefaultStrategy() {
        return new DefaultPathStrategy();
    }
    static createLwcTestStrategy() {
        return new LwcTestPathStrategy();
    }
    static createBundleStrategy() {
        return new BundlePathStrategy();
    }
    static createWaveTemplateBundleStrategy() {
        return new WaveTemplateBundlePathStrategy();
    }
    static createFunctionTemplateStrategy() {
        return new FunctionTemplatePathStrategy();
    }
    static createFunctionJavaTemplateStrategy() {
        return new FunctionJavaTemplatePathStrategy();
    }
}
exports.PathStrategyFactory = PathStrategyFactory;
//# sourceMappingURL=sourcePathStrategies.js.map