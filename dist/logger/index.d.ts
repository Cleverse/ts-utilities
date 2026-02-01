import pino from 'pino';
export { default as pino } from 'pino';
import { ILogger, Bindings, MergingObject } from './interface.js';
export { LogFn, Logger, RequiredLogFn } from './interface.js';

type Environment = "local" | "development" | "production";
declare class PinoAdapter implements ILogger {
    private logger;
    private static _logger;
    static get logger(): ILogger;
    static init(env: Environment): readonly [pino.Logger<never, boolean>, PinoAdapter];
    static new(pino: pino.Logger): ILogger;
    private constructor();
    with(bindings: Bindings): ILogger;
    child(bindings: Bindings): ILogger;
    fatal(msg: string, obj?: MergingObject): void;
    error(msg: string, obj: MergingObject<{
        event: string;
        err: Error | unknown;
    }>): void;
    warn(msg: string, obj: MergingObject<{
        event: string;
    }>): void;
    info(msg: string, obj?: MergingObject): void;
    debug(msg: string, obj?: MergingObject): void;
    trace(msg: string, obj?: MergingObject): void;
    silent(msg: string, obj?: MergingObject): void;
    set(pino: pino.Logger): ILogger;
}

declare const logger: ILogger;

/**
 * Initialize logger with given environment
 *
 * @param env Environment
 * @returns [pinoLogger, Logger]
 */
declare const init: typeof PinoAdapter.init;
declare const defaultLoggerOptions: pino.LoggerOptions<never, boolean>;

export { Bindings, ILogger, MergingObject, PinoAdapter, logger as default, defaultLoggerOptions, init, logger };
