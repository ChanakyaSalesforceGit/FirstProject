"use strict";
/*
 * Copyright (c) 2017, salesforce.com, inc.
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
const vscode = require("vscode");
const channels_1 = require("../channels");
const constants_1 = require("../constants");
const messages_1 = require("../messages");
const settings_1 = require("../settings");
/**
 * A centralized location for all notification functionalities.
 */
class NotificationService {
    static getInstance() {
        if (!NotificationService.instance) {
            NotificationService.instance = new NotificationService();
        }
        return NotificationService.instance;
    }
    // Prefer these over directly calling the vscode.show* functions
    // We can expand these to be facades that gather analytics of failures.
    showErrorMessage(message, ...items) {
        return vscode.window.showErrorMessage(message, ...items);
    }
    showInformationMessage(message, ...items) {
        return vscode.window.showInformationMessage(message, ...items);
    }
    showWarningMessage(message, ...items) {
        return vscode.window.showWarningMessage(message, ...items);
    }
    showWarningModal(message, ...items) {
        return vscode.window.showWarningMessage(message, { modal: true }, ...items);
    }
    reportCommandExecutionStatus(execution, cancellationToken) {
        // https://stackoverflow.com/questions/38168581/observablet-is-not-a-class-derived-from-observablet
        this.reportExecutionStatus(execution.command.toString(), execution.processExitSubject, cancellationToken);
        this.reportExecutionError(execution.command.toString(), execution.processErrorSubject);
    }
    reportExecutionStatus(executionName, observable, cancellationToken) {
        observable.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            if (data !== undefined && String(data) === '0') {
                yield this.showSuccessfulExecution(executionName);
            }
            else if (data !== null) {
                this.showFailedExecution(executionName);
            }
        }));
        if (cancellationToken) {
            cancellationToken.onCancellationRequested(() => {
                this.showCanceledExecution(executionName);
            });
        }
    }
    showFailedExecution(executionName) {
        this.showErrorMessage(messages_1.nls.localize('notification_unsuccessful_execution_text', executionName));
        channels_1.channelService.showChannelOutput();
    }
    showCanceledExecution(executionName) {
        this.showWarningMessage(messages_1.nls.localize('notification_canceled_execution_text', executionName));
        channels_1.channelService.showChannelOutput();
    }
    showSuccessfulExecution(executionName) {
        return __awaiter(this, void 0, void 0, function* () {
            const message = messages_1.nls.localize('notification_successful_execution_text', executionName);
            if (settings_1.sfdxCoreSettings.getShowCLISuccessMsg()) {
                const showButtonText = messages_1.nls.localize('notification_show_button_text');
                const showOnlyStatusBarButtonText = messages_1.nls.localize('notification_show_in_status_bar_button_text');
                const selection = yield this.showInformationMessage(message, showButtonText, showOnlyStatusBarButtonText);
                if (selection && selection === showButtonText) {
                    channels_1.channelService.showChannelOutput();
                }
                if (selection && selection === showOnlyStatusBarButtonText) {
                    yield settings_1.sfdxCoreSettings.updateShowCLISuccessMsg(false);
                }
            }
            else {
                vscode.window.setStatusBarMessage(message, constants_1.STATUS_BAR_MSG_TIMEOUT_MS);
            }
        });
    }
    reportExecutionError(executionName, observable) {
        observable.subscribe((data) => __awaiter(this, void 0, void 0, function* () {
            this.showErrorMessage(messages_1.nls.localize('notification_unsuccessful_execution_text', executionName));
            channels_1.channelService.showChannelOutput();
        }));
    }
}
exports.NotificationService = NotificationService;
//# sourceMappingURL=notificationService.js.map