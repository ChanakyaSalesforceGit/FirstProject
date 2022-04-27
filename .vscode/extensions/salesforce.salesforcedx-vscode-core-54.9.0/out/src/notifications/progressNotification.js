"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const vscode = require("vscode");
const messages_1 = require("../../src/messages");
class ProgressNotification {
    static show(execution, token, progressLocation, progressReporter) {
        return vscode.window.withProgress({
            title: messages_1.nls.localize('progress_notification_text', execution.command),
            location: progressLocation || vscode.ProgressLocation.Notification,
            cancellable: true
        }, (progress, cancellationToken) => {
            return new Promise(resolve => {
                cancellationToken.onCancellationRequested(() => {
                    token.cancel();
                    return resolve();
                });
                execution.processExitSubject.subscribe(data => {
                    return resolve();
                });
                execution.processErrorSubject.subscribe(data => {
                    return resolve();
                });
                if (progressReporter) {
                    progressReporter.subscribe({
                        next(increment) {
                            progress.report({ increment });
                        },
                        complete() {
                            progress.report({ increment: 100 });
                            resolve();
                        }
                    });
                }
            });
        });
    }
}
exports.ProgressNotification = ProgressNotification;
//# sourceMappingURL=progressNotification.js.map