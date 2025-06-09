/**
 * Secure Logger
 * Production-safe logging with sensitive data filtering
 */

import env from '../config/environment';

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, any>;
  error?: Error;
}

class SecureLogger {
  private static instance: SecureLogger;
  private sensitiveKeys = [
    'password', 'secret', 'token', 'key', 'auth', 'credential',
    'jwt', 'session', 'cookie', 'hash', 'salt', 'api_key',
    'private_key', 'access_token', 'refresh_token'
  ];

  private constructor() {}

  public static getInstance(): SecureLogger {
    if (!SecureLogger.instance) {
      SecureLogger.instance = new SecureLogger();
    }
    return SecureLogger.instance;
  }

  private sanitizeData(data: any): any {
    if (typeof data === 'string') {
      // Check if string contains sensitive patterns
      const lowerData = data.toLowerCase();
      if (this.sensitiveKeys.some(key => lowerData.includes(key))) {
        return '[REDACTED]';
      }
      return data;
    }

    if (Array.isArray(data)) {
      return data.map(item => this.sanitizeData(item));
    }

    if (data && typeof data === 'object') {
      const sanitized: Record<string, any> = {};
      for (const [key, value] of Object.entries(data)) {
        const lowerKey = key.toLowerCase();
        if (this.sensitiveKeys.some(sensitiveKey => lowerKey.includes(sensitiveKey))) {
          sanitized[key] = '[REDACTED]';
        } else {
          sanitized[key] = this.sanitizeData(value);
        }
      }
      return sanitized;
    }

    return data;
  }

  private formatLogEntry(entry: LogEntry): string {
    const { level, message, timestamp, context, error } = entry;
    let logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`;
    
    if (context) {
      const sanitizedContext = this.sanitizeData(context);
      logMessage += ` | Context: ${JSON.stringify(sanitizedContext)}`;
    }
    
    if (error) {
      logMessage += ` | Error: ${error.message}`;
      if (env.isDevelopment() && error.stack) {
        logMessage += ` | Stack: ${error.stack}`;
      }
    }
    
    return logMessage;
  }

  private log(level: LogLevel, message: string, context?: Record<string, any>, error?: Error): void {
    // In production, only log errors and warnings
    if (env.isProduction() && !['error', 'warn'].includes(level)) {
      return;
    }

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context,
      error
    };

    const formattedMessage = this.formatLogEntry(entry);

    // Use appropriate console method based on level
    switch (level) {
      case 'error':
        console.error(formattedMessage);
        break;
      case 'warn':
        console.warn(formattedMessage);
        break;
      case 'info':
        console.info(formattedMessage);
        break;
      case 'debug':
        if (env.isDevelopment()) {
          console.log(formattedMessage);
        }
        break;
    }

    // In production, you might want to send logs to an external service
    if (env.isProduction() && level === 'error') {
      this.sendToExternalLoggingService(entry);
    }
  }

  private async sendToExternalLoggingService(entry: LogEntry): Promise<void> {
    // Implement external logging service integration here
    // Examples: Sentry, LogRocket, DataDog, etc.
    try {
      // Example implementation (replace with your preferred service)
      // await fetch('/api/logs', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(entry)
      // });
    } catch (error) {
      // Fail silently to avoid infinite loops
    }
  }

  public error(message: string, context?: Record<string, any>, error?: Error): void {
    this.log('error', message, context, error);
  }

  public warn(message: string, context?: Record<string, any>): void {
    this.log('warn', message, context);
  }

  public info(message: string, context?: Record<string, any>): void {
    this.log('info', message, context);
  }

  public debug(message: string, context?: Record<string, any>): void {
    this.log('debug', message, context);
  }

  // Convenience methods for common scenarios
  public apiError(endpoint: string, error: Error, context?: Record<string, any>): void {
    this.error(`API Error: ${endpoint}`, { endpoint, ...context }, error);
  }

  public authError(action: string, error: Error, context?: Record<string, any>): void {
    this.error(`Auth Error: ${action}`, { action, ...context }, error);
  }

  public performanceWarn(operation: string, duration: number, threshold: number): void {
    this.warn(`Performance Warning: ${operation}`, {
      operation,
      duration: `${duration}ms`,
      threshold: `${threshold}ms`,
      exceeded: `${duration - threshold}ms`
    });
  }
}

// Export singleton instance
export const secureLogger = SecureLogger.getInstance();
export default secureLogger;