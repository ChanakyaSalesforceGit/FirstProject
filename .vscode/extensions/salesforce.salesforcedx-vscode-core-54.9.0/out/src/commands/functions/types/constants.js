"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Default port of a locally running function
 */
exports.FUNCTION_DEFAULT_PORT = 8080;
/**
 * Default debug port of a locally running function
 */
exports.FUNCTION_DEFAULT_DEBUG_PORT = 9229;
/**
 * Functions Payload pattern
 */
exports.FUNCTION_PAYLOAD_PATTERN = '**/functions/**/*.json';
/**
 * Functions payload document selector
 */
exports.FUNCTION_PAYLOAD_DOCUMENT_SELECTOR = {
    language: 'json',
    pattern: exports.FUNCTION_PAYLOAD_PATTERN
};
/**
 * Pattern to capture a function runtime language
 */
exports.FUNCTION_RUNTIME_DETECTION_PATTERN = new RegExp('.*heroku/(.*)-function-invoker.*');
//# sourceMappingURL=constants.js.map