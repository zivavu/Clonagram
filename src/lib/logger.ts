type LogLevel = 'log' | 'warn' | 'error';

function write(level: LogLevel, ...args: unknown[]) {
   console[level](...args);
}

export const logger = {
   log: (...args: unknown[]) => write('log', ...args),
   warn: (...args: unknown[]) => write('warn', ...args),
   error: (...args: unknown[]) => write('error', ...args),
};
