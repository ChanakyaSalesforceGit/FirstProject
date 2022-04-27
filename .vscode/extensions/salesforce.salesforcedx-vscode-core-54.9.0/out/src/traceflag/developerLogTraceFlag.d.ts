export declare class DeveloperLogTraceFlag {
    private static instance;
    private active;
    private traceflagId;
    private debugLevelId;
    private startDate;
    private expirationDate;
    MILLISECONDS_PER_SECOND: number;
    LOG_TIMER_LENGTH_MINUTES: number;
    private constructor();
    static getInstance(): DeveloperLogTraceFlag;
    setTraceFlagDebugLevelInfo(id: string, startDate: string, expirationDate: string, debugLevelId: string | null): void;
    setDebugLevelId(debugLevelId: string | undefined | null): void;
    setTraceFlagId(id: string): void;
    turnOnLogging(): void;
    isValidDebugLevelId(): boolean;
    isValidDateLength(): boolean;
    validateDates(): void;
    turnOffLogging(): void;
    isActive(): boolean;
    getDebugLevelId(): string | null | undefined;
    getTraceFlagId(): string | undefined;
    getStartDate(): Date;
    getExpirationDate(): Date;
}
