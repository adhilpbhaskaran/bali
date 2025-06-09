// Enhanced logging utility with structured logging and different log levels

export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
  TRACE = 4
}

export interface LogContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  component?: string;
  action?: string;
  metadata?: Record<string, any>;
}

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: LogContext;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

class Logger {
  private currentLevel: LogLevel;
  private isDevelopment: boolean;
  private isClient: boolean;

  constructor() {
    this.isDevelopment = process.env.NODE_ENV === 'development';
    this.isClient = typeof window !== 'undefined';
    
    // Set log level based on environment
    this.currentLevel = this.isDevelopment ? LogLevel.DEBUG : LogLevel.INFO;
    
    // Override with environment variable if set
    const envLogLevel = process.env.NEXT_PUBLIC_LOG_LEVEL;
    if (envLogLevel) {
      const level = LogLevel[envLogLevel.toUpperCase() as keyof typeof LogLevel];
      if (level !== undefined) {
        this.currentLevel = level;
      }
    }
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.currentLevel;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext, error?: Error): LogEntry {
    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context
    };

    if (error) {
      entry.error = {
        name: error.name,
        message: error.message,
        stack: this.isDevelopment ? error.stack : undefined
      };
    }

    return entry;
  }

  private output(entry: LogEntry): void {
    if (!this.shouldLog(entry.level)) return;

    const levelNames = ['ERROR', 'WARN', 'INFO', 'DEBUG', 'TRACE'];
    const levelName = levelNames[entry.level];
    
    if (this.isDevelopment) {
      // Development: Pretty console output
      const prefix = `[${entry.timestamp}] ${levelName}`;
      const contextStr = entry.context ? ` (${JSON.stringify(entry.context)})` : '';
      const fullMessage = `${prefix}: ${entry.message}${contextStr}`;

      switch (entry.level) {
        case LogLevel.ERROR:
          console.error(fullMessage, entry.error);
          break;
        case LogLevel.WARN:
          console.warn(fullMessage);
          break;
        case LogLevel.INFO:
          console.info(fullMessage);
          break;
        case LogLevel.DEBUG:
          console.debug(fullMessage);
          break;
        case LogLevel.TRACE:
          console.trace(fullMessage);
          break;
      }
    } else {
      // Production: Structured JSON logging
      const logOutput = JSON.stringify(entry);
      
      if (this.isClient) {
        // Client-side: Send to logging service or store locally
        this.sendToLoggingService(entry);
      } else {
        // Server-side: Output to stdout/stderr
        if (entry.level === LogLevel.ERROR) {
          console.error(logOutput);
        } else {
          console.log(logOutput);
        }
      }
    }
  }

  private sendToLoggingService(entry: LogEntry): void {
    // In production, you would send logs to a service like:
    // - Sentry
    // - LogRocket
    // - DataDog
    // - CloudWatch
    // - Custom logging endpoint
    
    // For now, we'll store in localStorage for debugging
    try {
      const logs = JSON.parse(localStorage.getItem('app_logs') || '[]');
      logs.push(entry);
      
      // Keep only last 100 logs to prevent storage overflow
      if (logs.length > 100) {
        logs.splice(0, logs.length - 100);
      }
      
      localStorage.setItem('app_logs', JSON.stringify(logs));
    } catch (error) {
      // Fallback to console if localStorage fails
      console.error('Failed to store log:', error);
    }
  }

  error(message: string, error?: Error, context?: LogContext): void {
    this.output(this.formatMessage(LogLevel.ERROR, message, context, error));
  }

  warn(message: string, context?: LogContext): void {
    this.output(this.formatMessage(LogLevel.WARN, message, context));
  }

  info(message: string, context?: LogContext): void {
    this.output(this.formatMessage(LogLevel.INFO, message, context));
  }

  debug(message: string, context?: LogContext): void {
    this.output(this.formatMessage(LogLevel.DEBUG, message, context));
  }

  trace(message: string, context?: LogContext): void {
    this.output(this.formatMessage(LogLevel.TRACE, message, context));
  }

  // Performance logging
  time(label: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.time(label);
    }
    this.debug(`Timer started: ${label}`, context);
  }

  timeEnd(label: string, context?: LogContext): void {
    if (this.isDevelopment) {
      console.timeEnd(label);
    }
    this.debug(`Timer ended: ${label}`, context);
  }

  // API request logging
  apiRequest(method: string, url: string, context?: LogContext): void {
    this.info(`API Request: ${method} ${url}`, {
      ...context,
      action: 'api_request',
      metadata: { method, url }
    });
  }

  apiResponse(method: string, url: string, status: number, duration?: number, context?: LogContext): void {
    const level = status >= 400 ? LogLevel.ERROR : LogLevel.INFO;
    this.output(this.formatMessage(
      level,
      `API Response: ${method} ${url} - ${status}${duration ? ` (${duration}ms)` : ''}`,
      {
        ...context,
        action: 'api_response',
        metadata: { method, url, status, duration }
      }
    ));
  }

  // User action logging
  userAction(action: string, context?: LogContext): void {
    this.info(`User Action: ${action}`, {
      ...context,
      action: 'user_action',
      metadata: { action }
    });
  }

  // Component lifecycle logging
  componentMount(componentName: string, context?: LogContext): void {
    this.debug(`Component Mounted: ${componentName}`, {
      ...context,
      component: componentName,
      action: 'mount'
    });
  }

  componentUnmount(componentName: string, context?: LogContext): void {
    this.debug(`Component Unmounted: ${componentName}`, {
      ...context,
      component: componentName,
      action: 'unmount'
    });
  }

  // Security event logging
  securityEvent(event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext): void {
    const level = severity === 'critical' || severity === 'high' ? LogLevel.ERROR : LogLevel.WARN;
    this.output(this.formatMessage(
      level,
      `Security Event: ${event} (${severity})`,
      {
        ...context,
        action: 'security_event',
        metadata: { event, severity }
      }
    ));
  }

  // Database operation logging
  dbOperation(operation: string, table?: string, duration?: number, context?: LogContext): void {
    this.debug(`DB Operation: ${operation}${table ? ` on ${table}` : ''}${duration ? ` (${duration}ms)` : ''}`, {
      ...context,
      action: 'db_operation',
      metadata: { operation, table, duration }
    });
  }

  // API data logging
  api(operation: string, data?: any, context?: LogContext): void {
    this.debug(`API Data: ${operation}`, {
      ...context,
      action: 'api_data',
      metadata: { operation, data }
    });
  }

  // Get stored logs (for debugging)
  getStoredLogs(): LogEntry[] {
    if (!this.isClient) return [];
    
    try {
      return JSON.parse(localStorage.getItem('app_logs') || '[]');
    } catch {
      return [];
    }
  }

  // Clear stored logs
  clearStoredLogs(): void {
    if (this.isClient) {
      localStorage.removeItem('app_logs');
    }
  }

  // Set log level dynamically
  setLogLevel(level: LogLevel): void {
    this.currentLevel = level;
    this.info(`Log level changed to ${LogLevel[level]}`);
  }
}

// Create singleton instance
const logger = new Logger();

// Export the logger instance and types
export { logger };
export default logger;

// Convenience functions for common logging patterns
export const logError = (message: string, error?: Error, context?: LogContext) => 
  logger.error(message, error, context);

export const logWarning = (message: string, context?: LogContext) => 
  logger.warn(message, context);

export const logInfo = (message: string, context?: LogContext) => 
  logger.info(message, context);

export const logDebug = (message: string, context?: LogContext) => 
  logger.debug(message, context);

export const logApiCall = (method: string, url: string, context?: LogContext) => 
  logger.apiRequest(method, url, context);

export const logUserAction = (action: string, context?: LogContext) => 
  logger.userAction(action, context);

export const logSecurityEvent = (event: string, severity: 'low' | 'medium' | 'high' | 'critical', context?: LogContext) => 
  logger.securityEvent(event, severity, context);

// Performance measurement decorator
export function measurePerformance<T extends (...args: any[]) => any>(
  target: T,
  label?: string
): T {
  return ((...args: any[]) => {
    const startTime = performance.now();
    const functionLabel = label || target.name || 'anonymous function';
    
    logger.time(functionLabel);
    
    try {
      const result = target(...args);
      
      if (result instanceof Promise) {
        return result.finally(() => {
          const duration = performance.now() - startTime;
          logger.timeEnd(functionLabel);
          logger.debug(`Function ${functionLabel} completed in ${duration.toFixed(2)}ms`);
        });
      } else {
        const duration = performance.now() - startTime;
        logger.timeEnd(functionLabel);
        logger.debug(`Function ${functionLabel} completed in ${duration.toFixed(2)}ms`);
        return result;
      }
    } catch (error) {
      const duration = performance.now() - startTime;
      logger.error(`Function ${functionLabel} failed after ${duration.toFixed(2)}ms`, error as Error);
      throw error;
    }
  }) as T;
}