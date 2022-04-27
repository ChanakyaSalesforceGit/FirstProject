"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * SFDX project JSON glob pattern
 */
exports.SFDX_PROJECT_JSON_GLOB_PATTERN = '**/sfdx-project.json';
/**
 * LWC Jest Test glob pattern
 */
exports.LWC_TEST_GLOB_PATTERN = '**/{lwc,modules}/**/*.test.js';
/**
 * LWC Jest Test document selector
 */
exports.LWC_TEST_DOCUMENT_SELECTOR = {
    language: 'javascript',
    pattern: exports.LWC_TEST_GLOB_PATTERN
};
/**
 * Context when LWC Jest Test file is focused
 */
exports.SFDX_LWC_JEST_FILE_FOCUSED_CONTEXT = 'sfdx:lwc_jest_file_focused';
/**
 * Context when LWC Jest Test file is focused and user is currently watching the test
 */
exports.SFDX_LWC_JEST_IS_WATCHING_FOCUSED_FILE_CONTEXT = 'sfdx:lwc_jest_is_watching_focused_file';
/**
 * Run LWC test telemetry log name
 */
exports.FORCE_LWC_TEST_RUN_LOG_NAME = 'force_lwc_test_run_action';
/**
 * Debug LWC test telemetry log name
 */
exports.FORCE_LWC_TEST_DEBUG_LOG_NAME = 'force_lwc_test_debug_action';
/**
 * Watch LWC test telemetry log name
 */
exports.FORCE_LWC_TEST_WATCH_LOG_NAME = 'force_lwc_test_watch_action';
//# sourceMappingURL=constants.js.map