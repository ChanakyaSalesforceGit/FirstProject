"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
 * All rights reserved.
 * Licensed under the BSD 3-Clause license.
 * For full license text, see LICENSE.txt file in the repo root or https://opensource.org/licenses/BSD-3-Clause
 */
Object.defineProperty(exports, "__esModule", { value: true });
const decorators_1 = require("../decorators");
class DeveloperLogTraceFlag {
    constructor() {
        this.MILLISECONDS_PER_SECOND = 60000;
        this.LOG_TIMER_LENGTH_MINUTES = 30;
        this.active = false;
        this.startDate = new Date();
        this.expirationDate = new Date();
    }
    static getInstance() {
        if (!DeveloperLogTraceFlag.instance) {
            DeveloperLogTraceFlag.instance = new DeveloperLogTraceFlag();
        }
        return DeveloperLogTraceFlag.instance;
    }
    setTraceFlagDebugLevelInfo(id, startDate, expirationDate, debugLevelId) {
        this.traceflagId = id;
        this.startDate = new Date(startDate);
        this.expirationDate = new Date(expirationDate);
        this.debugLevelId = debugLevelId;
        this.active = true;
    }
    setDebugLevelId(debugLevelId) {
        this.debugLevelId = debugLevelId;
    }
    setTraceFlagId(id) {
        this.traceflagId = id;
    }
    turnOnLogging() {
        this.active = true;
        decorators_1.showTraceFlagExpiration(this.getExpirationDate());
    }
    isValidDebugLevelId() {
        return (this.debugLevelId !== null &&
            this.debugLevelId !== undefined &&
            this.debugLevelId !== '');
    }
    isValidDateLength() {
        const currDate = new Date().valueOf();
        return (this.expirationDate.getTime() - currDate >
            this.LOG_TIMER_LENGTH_MINUTES * this.MILLISECONDS_PER_SECOND);
    }
    validateDates() {
        if (!this.isValidDateLength()) {
            this.startDate = new Date();
            this.expirationDate = new Date(Date.now() +
                this.LOG_TIMER_LENGTH_MINUTES * this.MILLISECONDS_PER_SECOND);
        }
    }
    turnOffLogging() {
        this.debugLevelId = undefined;
        this.traceflagId = undefined;
        this.active = false;
    }
    isActive() {
        return this.active;
    }
    getDebugLevelId() {
        return this.debugLevelId;
    }
    getTraceFlagId() {
        return this.traceflagId;
    }
    getStartDate() {
        return this.startDate;
    }
    getExpirationDate() {
        return this.expirationDate;
    }
}
exports.DeveloperLogTraceFlag = DeveloperLogTraceFlag;
//# sourceMappingURL=developerLogTraceFlag.js.map