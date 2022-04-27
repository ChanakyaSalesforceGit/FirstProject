"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Test type is 'lwc' for all LWC Jest tests.
 * The enum is created for future extensibility.
 */
var TestType;
(function (TestType) {
    TestType["LWC"] = "lwc";
})(TestType = exports.TestType || (exports.TestType = {}));
/**
 * Test result statuses are presented with
 * different colors in the test explorer.
 */
var TestResultStatus;
(function (TestResultStatus) {
    TestResultStatus[TestResultStatus["PASSED"] = 0] = "PASSED";
    TestResultStatus[TestResultStatus["FAILED"] = 1] = "FAILED";
    TestResultStatus[TestResultStatus["SKIPPED"] = 2] = "SKIPPED";
    TestResultStatus[TestResultStatus["UNKNOWN"] = 3] = "UNKNOWN";
})(TestResultStatus = exports.TestResultStatus || (exports.TestResultStatus = {}));
/**
 * The discriminant enum for the TestExecutionInfo discriminated union.
 */
var TestInfoKind;
(function (TestInfoKind) {
    TestInfoKind["TEST_CASE"] = "testCase";
    TestInfoKind["TEST_FILE"] = "testFile";
    TestInfoKind["TEST_DIRECTORY"] = "testDirectory";
})(TestInfoKind = exports.TestInfoKind || (exports.TestInfoKind = {}));
//# sourceMappingURL=index.js.map