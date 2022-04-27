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
const core_1 = require("@salesforce/core");
const path = require("path");
const util_1 = require("util");
const telemetry_1 = require("../telemetry");
const index_1 = require("./index");
var ConfigSource;
(function (ConfigSource) {
    ConfigSource[ConfigSource["Local"] = 0] = "Local";
    ConfigSource[ConfigSource["Global"] = 1] = "Global";
    ConfigSource[ConfigSource["None"] = 2] = "None";
})(ConfigSource = exports.ConfigSource || (exports.ConfigSource = {}));
// This class should be reworked or removed once the ConfigAggregator correctly checks
// local as well as global configs. It's also worth noting that ConfigAggregator, according
// to its docs checks local, global and environment and, for our purposes, environment may
// not be viable.
class ConfigUtil {
    static getConfigSource(key) {
        return __awaiter(this, void 0, void 0, function* () {
            let value = yield ConfigUtil.getConfigValue(key, ConfigSource.Local);
            if (!util_1.isNullOrUndefined(value)) {
                return ConfigSource.Local;
            }
            value = yield ConfigUtil.getConfigValue(key, ConfigSource.Global);
            if (!util_1.isNullOrUndefined(value)) {
                return ConfigSource.Global;
            }
            return ConfigSource.None;
        });
    }
    static getConfigValue(key, source) {
        return __awaiter(this, void 0, void 0, function* () {
            if (util_1.isUndefined(source) || source === ConfigSource.Local) {
                try {
                    const rootPath = index_1.getRootWorkspacePath();
                    const myLocalConfig = yield core_1.ConfigFile.create({
                        isGlobal: false,
                        rootFolder: path.join(rootPath, '.sfdx'),
                        filename: 'sfdx-config.json'
                    });
                    const localValue = myLocalConfig.get(key);
                    if (!util_1.isNullOrUndefined(localValue)) {
                        return localValue;
                    }
                }
                catch (err) {
                    telemetry_1.telemetryService.sendException('get_config_value_local', err.message);
                    return undefined;
                }
            }
            if (util_1.isUndefined(source) || source === ConfigSource.Global) {
                try {
                    const aggregator = yield core_1.ConfigAggregator.create();
                    const globalValue = aggregator.getPropertyValue(key);
                    if (!util_1.isNullOrUndefined(globalValue)) {
                        return globalValue;
                    }
                }
                catch (err) {
                    telemetry_1.telemetryService.sendException('get_config_value_global', err.message);
                    return undefined;
                }
            }
            return undefined;
        });
    }
}
exports.ConfigUtil = ConfigUtil;
//# sourceMappingURL=configUtil.js.map