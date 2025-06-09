'use client';

import * as React from 'react';
import { logger } from './logger';
import { Performance } from './performance';

// Error tracking types
export interface ErrorInfo {
  message: string;
  stack?: string;
  componentStack?: string;
  errorBoundary?: string;
  url: string;
  userAgent: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  buildVersion?: string;
  environment: string;
}

export interface PerformanceMetric {
  name: string;
  value: number;
  unit: string;
  timestamp: number;
  url: string;
  sessionId: string;
  userId?: string;
}

export interface UserAction {
  action: string;
  element?: string;
  url: string;
  timestamp: number;
  userId?: string;
  sessionId: string;
  metadata?: Record<string, any>;
}

export interface APIMetric {
  endpoint: string;
  method: string;
  statusCode: number;
  duration: number;
  timestamp: number;
  userId?: string;
  sessionId: string;
  error?: string;
}

export interface VitalMetric {
  name: 'CLS' | 'FID' | 'FCP' | 'LCP' | 'TTFB';
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  timestamp: number;
  url: string;
  sessionId: string;
}

// Monitoring configuration
export interface MonitoringConfig {
  apiEndpoint?: string;
  apiKey?: string;
  environment: string;
  buildVersion?: string;
  enableErrorTracking: boolean;
  enablePerformanceTracking: boolean;
  enableUserTracking: boolean;
  enableVitalsTracking: boolean;
  sampleRate: number;
  maxErrors: number;
  maxMetrics: number;
  flushInterval: number;
}

const DEFAULT_CONFIG: MonitoringConfig = {
  environment: process.env.NODE_ENV || 'development',
  buildVersion: process.env.NEXT_PUBLIC_BUILD_VERSION,
  enableErrorTracking: true,
  enablePerformanceTracking: true,
  enableUserTracking: true,
  enableVitalsTracking: true,
  sampleRate: 1.0,
  maxErrors: 100,
  maxMetrics: 1000,
  flushInterval: 30000 // 30 seconds
};

// Monitoring manager class
class MonitoringManager {
  private config: MonitoringConfig;
  private sessionId: string;
  private userId?: string;
  private errors: ErrorInfo[] = [];
  private metrics: PerformanceMetric[] = [];
  private actions: UserAction[] = [];
  private apiMetrics: APIMetric[] = [];
  private vitals: VitalMetric[] = [];
  private flushTimer: NodeJS.Timeout | null = null;
  private isClient: boolean;

  constructor(config: Partial<MonitoringConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
    this.isClient = typeof window !== 'undefined';
    this.sessionId = this.generateSessionId();
    
    if (this.isClient) {
      this.setupErrorHandlers();
      this.setupPerformanceObservers();
      this.startFlushTimer();
    }
  }

  /**
   * Set user ID for tracking
   */
  setUserId(userId: string): void {
    this.userId = userId;
    logger.info('User ID set for monitoring', { userId, sessionId: this.sessionId });
  }

  /**
   * Track JavaScript errors
   */
  trackError(error: Error, errorInfo?: any): void {
    if (!this.config.enableErrorTracking || !this.shouldSample()) {
      return;
    }

    const errorData: ErrorInfo = {
      message: error.message,
      stack: error.stack,
      componentStack: errorInfo?.componentStack,
      errorBoundary: errorInfo?.errorBoundary,
      url: this.isClient ? window.location.href : '',
      userAgent: this.isClient ? navigator.userAgent : '',
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      buildVersion: this.config.buildVersion,
      environment: this.config.environment
    };

    this.errors.push(errorData);
    
    // Limit stored errors
    if (this.errors.length > this.config.maxErrors) {
      this.errors = this.errors.slice(-this.config.maxErrors);
    }

    logger.error('Error tracked', undefined, { metadata: errorData });
    
    // Send immediately for critical errors
    if (this.isCriticalError(error)) {
      this.flush();
    }
  }

  /**
   * Track performance metrics
   */
  trackMetric(name: string, value: number, unit: string = 'ms'): void {
    if (!this.config.enablePerformanceTracking || !this.shouldSample()) {
      return;
    }

    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      url: this.isClient ? window.location.href : '',
      sessionId: this.sessionId,
      userId: this.userId
    };

    this.metrics.push(metric);
    
    // Limit stored metrics
    if (this.metrics.length > this.config.maxMetrics) {
      this.metrics = this.metrics.slice(-this.config.maxMetrics);
    }

    logger.debug('Metric tracked', metric);
  }

  /**
   * Track user actions
   */
  trackUserAction(action: string, element?: string, metadata?: Record<string, any>): void {
    if (!this.config.enableUserTracking || !this.shouldSample()) {
      return;
    }

    const actionData: UserAction = {
      action,
      element,
      url: this.isClient ? window.location.href : '',
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      metadata
    };

    this.actions.push(actionData);
    
    // Limit stored actions
    if (this.actions.length > 1000) {
      this.actions = this.actions.slice(-1000);
    }

    logger.debug('User action tracked', actionData);
  }

  /**
   * Track API calls
   */
  trackAPICall(
    endpoint: string,
    method: string,
    statusCode: number,
    duration: number,
    error?: string
  ): void {
    if (!this.config.enablePerformanceTracking || !this.shouldSample()) {
      return;
    }

    const apiMetric: APIMetric = {
      endpoint,
      method,
      statusCode,
      duration,
      timestamp: Date.now(),
      userId: this.userId,
      sessionId: this.sessionId,
      error
    };

    this.apiMetrics.push(apiMetric);
    
    // Limit stored API metrics
    if (this.apiMetrics.length > 500) {
      this.apiMetrics = this.apiMetrics.slice(-500);
    }

    logger.debug('API call tracked', apiMetric);
  }

  /**
   * Track Core Web Vitals
   */
  trackVital(name: VitalMetric['name'], value: number): void {
    if (!this.config.enableVitalsTracking || !this.shouldSample()) {
      return;
    }

    const rating = this.getVitalRating(name, value);
    
    const vital: VitalMetric = {
      name,
      value,
      rating,
      timestamp: Date.now(),
      url: this.isClient ? window.location.href : '',
      sessionId: this.sessionId
    };

    this.vitals.push(vital);
    
    // Limit stored vitals
    if (this.vitals.length > 100) {
      this.vitals = this.vitals.slice(-100);
    }

    logger.info('Web Vital tracked', vital);
  }

  /**
   * Get current session data
   */
  getSessionData(): {
    sessionId: string;
    userId?: string;
    errors: ErrorInfo[];
    metrics: PerformanceMetric[];
    actions: UserAction[];
    apiMetrics: APIMetric[];
    vitals: VitalMetric[];
  } {
    return {
      sessionId: this.sessionId,
      userId: this.userId,
      errors: [...this.errors],
      metrics: [...this.metrics],
      actions: [...this.actions],
      apiMetrics: [...this.apiMetrics],
      vitals: [...this.vitals]
    };
  }

  /**
   * Flush data to server
   */
  async flush(): Promise<void> {
    if (!this.config.apiEndpoint || !this.config.apiKey) {
      // Store locally if no endpoint configured
      this.storeLocally();
      return;
    }

    const data = this.getSessionData();
    
    // Only send if there's data
    if (this.hasData(data)) {
      try {
        await fetch(this.config.apiEndpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          },
          body: JSON.stringify(data)
        });

        // Clear sent data
        this.clearData();
        
        logger.debug('Monitoring data flushed successfully');
      } catch (error) {
        logger.error('Failed to flush monitoring data', error as Error);
        // Store locally as fallback
        this.storeLocally();
      }
    }
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<MonitoringConfig>): void {
    this.config = { ...this.config, ...config };
    
    // Restart flush timer if interval changed
    if (config.flushInterval) {
      this.stopFlushTimer();
      this.startFlushTimer();
    }
  }

  /**
   * Destroy monitoring instance
   */
  destroy(): void {
    this.stopFlushTimer();
    this.removeErrorHandlers();
    this.clearData();
  }

  // Private methods
  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private shouldSample(): boolean {
    return Math.random() < this.config.sampleRate;
  }

  private isCriticalError(error: Error): boolean {
    const criticalPatterns = [
      /ChunkLoadError/,
      /Loading chunk/,
      /Network Error/,
      /TypeError.*null/,
      /ReferenceError/
    ];
    
    return criticalPatterns.some(pattern => pattern.test(error.message));
  }

  private getVitalRating(name: VitalMetric['name'], value: number): VitalMetric['rating'] {
    const thresholds = {
      CLS: { good: 0.1, poor: 0.25 },
      FID: { good: 100, poor: 300 },
      FCP: { good: 1800, poor: 3000 },
      LCP: { good: 2500, poor: 4000 },
      TTFB: { good: 800, poor: 1800 }
    };

    const threshold = thresholds[name];
    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  private setupErrorHandlers(): void {
    if (!this.isClient) return;

    // Global error handler
    window.addEventListener('error', (event) => {
      this.trackError(new Error(event.message), {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno
      });
    });

    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError(new Error(`Unhandled Promise Rejection: ${event.reason}`));
    });
  }

  private removeErrorHandlers(): void {
    if (!this.isClient) return;
    
    // Note: In a real implementation, you'd need to store references to the handlers
    // to properly remove them. This is a simplified version.
  }

  private setupPerformanceObservers(): void {
    if (!this.isClient || !this.config.enableVitalsTracking) return;

    try {
      // Observe Core Web Vitals
      if ('PerformanceObserver' in window) {
        // LCP Observer
        const lcpObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          const lastEntry = entries[entries.length - 1] as any;
          this.trackVital('LCP', lastEntry.startTime);
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

        // FID Observer
        const fidObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            this.trackVital('FID', entry.processingStart - entry.startTime);
          });
        });
        fidObserver.observe({ entryTypes: ['first-input'] });

        // CLS Observer
        let clsValue = 0;
        const clsObserver = new PerformanceObserver((list) => {
          const entries = list.getEntries();
          entries.forEach((entry: any) => {
            if (!entry.hadRecentInput) {
              clsValue += entry.value;
            }
          });
          this.trackVital('CLS', clsValue);
        });
        clsObserver.observe({ entryTypes: ['layout-shift'] });
      }

      // Navigation timing
      if ('performance' in window && 'getEntriesByType' in performance) {
        window.addEventListener('load', () => {
          setTimeout(() => {
            const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
            if (navigation) {
              this.trackVital('FCP', navigation.responseStart - navigation.fetchStart);
              this.trackVital('TTFB', navigation.responseStart - navigation.requestStart);
            }
          }, 0);
        });
      }
    } catch (error) {
      logger.error('Failed to setup performance observers', error as Error);
    }
  }

  private startFlushTimer(): void {
    this.flushTimer = setInterval(() => {
      this.flush();
    }, this.config.flushInterval);
  }

  private stopFlushTimer(): void {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  private hasData(data: any): boolean {
    return (
      data.errors.length > 0 ||
      data.metrics.length > 0 ||
      data.actions.length > 0 ||
      data.apiMetrics.length > 0 ||
      data.vitals.length > 0
    );
  }

  private clearData(): void {
    this.errors = [];
    this.metrics = [];
    this.actions = [];
    this.apiMetrics = [];
    this.vitals = [];
  }

  private storeLocally(): void {
    if (!this.isClient) return;

    try {
      const data = this.getSessionData();
      const stored = localStorage.getItem('monitoring_data');
      const existing = stored ? JSON.parse(stored) : [];
      
      existing.push(data);
      
      // Limit stored sessions
      if (existing.length > 10) {
        existing.splice(0, existing.length - 10);
      }
      
      localStorage.setItem('monitoring_data', JSON.stringify(existing));
      this.clearData();
    } catch (error) {
      logger.error('Failed to store monitoring data locally', error as Error);
    }
  }
}

// Create singleton instance
export const monitoring = new MonitoringManager();

// React error boundary integration
export function withErrorBoundary<P extends object>(
  Component: React.ComponentType<P>,
  fallback?: React.ComponentType<{ error: Error; resetError: () => void }>
) {
  return class ErrorBoundary extends React.Component<
    P,
    { hasError: boolean; error?: Error }
  > {
    constructor(props: P) {
      super(props);
      this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error) {
      return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
      monitoring.trackError(error, {
        componentStack: errorInfo.componentStack,
        errorBoundary: this.constructor.name
      });
    }

    render() {
      if (this.state.hasError) {
        if (fallback) {
          const FallbackComponent = fallback;
          return (
            <FallbackComponent
              error={this.state.error!}
              resetError={() => this.setState({ hasError: false, error: undefined })}
            />
          );
        }
        
        return (
          <div className="error-boundary">
            <h2>Something went wrong.</h2>
            <button onClick={() => this.setState({ hasError: false, error: undefined })}>
              Try again
            </button>
          </div>
        );
      }

      return <Component {...this.props} />;
    }
  };
}

// Utility functions

/**
 * Track page view
 */
export function trackPageView(url: string, title?: string): void {
  monitoring.trackUserAction('page_view', undefined, { url, title });
}

/**
 * Track button click
 */
export function trackButtonClick(buttonText: string, metadata?: Record<string, any>): void {
  monitoring.trackUserAction('button_click', buttonText, metadata);
}

/**
 * Track form submission
 */
export function trackFormSubmission(formName: string, success: boolean): void {
  monitoring.trackUserAction('form_submit', formName, { success });
}

/**
 * Track search
 */
export function trackSearch(query: string, results: number): void {
  monitoring.trackUserAction('search', undefined, { query, results });
}

/**
 * Measure and track function execution time
 */
export function measureExecution<T>(
  name: string,
  fn: () => T | Promise<T>
): T | Promise<T> {
  const start = performance.now();
  
  try {
    const result = fn();
    
    if (result instanceof Promise) {
      return result
        .then((value) => {
          monitoring.trackMetric(name, performance.now() - start);
          return value;
        })
        .catch((error) => {
          monitoring.trackMetric(name, performance.now() - start);
          monitoring.trackError(error);
          throw error;
        });
    } else {
      monitoring.trackMetric(name, performance.now() - start);
      return result;
    }
  } catch (error) {
    monitoring.trackMetric(name, performance.now() - start);
    monitoring.trackError(error as Error);
    throw error;
  }
}

/**
 * Get stored monitoring data
 */
export function getStoredMonitoringData(): any[] {
  if (typeof window === 'undefined') return [];
  
  try {
    const stored = localStorage.getItem('monitoring_data');
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

/**
 * Clear stored monitoring data
 */
export function clearStoredMonitoringData(): void {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem('monitoring_data');
  } catch (error) {
    logger.error('Failed to clear stored monitoring data', error as Error);
  }
}

/**
 * Initialize monitoring with configuration
 */
export function initializeMonitoring(config: Partial<MonitoringConfig>): void {
  monitoring.updateConfig(config);
  logger.info('Monitoring initialized', { metadata: config });
}

export default monitoring;