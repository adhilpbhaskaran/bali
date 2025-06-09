import { logger } from './logger';
import { TIMING, LIMITS } from '../constants';

// Performance metric types
interface PerformanceMetric {
  name: string;
  value: number;
  unit: 'ms' | 'bytes' | 'count' | 'percentage';
  timestamp: number;
  tags?: Record<string, string>;
  metadata?: Record<string, any>;
}

interface NavigationMetrics {
  dns: number;
  tcp: number;
  ssl: number;
  ttfb: number; // Time to First Byte
  domContentLoaded: number;
  loadComplete: number;
  firstPaint: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  firstInputDelay: number;
  cumulativeLayoutShift: number;
}

interface ResourceMetrics {
  name: string;
  type: string;
  size: number;
  duration: number;
  startTime: number;
  endTime: number;
}

interface MemoryMetrics {
  usedJSHeapSize: number;
  totalJSHeapSize: number;
  jsHeapSizeLimit: number;
  usedPercentage: number;
}

interface ComponentMetrics {
  name: string;
  mountTime: number;
  renderTime: number;
  updateCount: number;
  lastUpdate: number;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private componentMetrics = new Map<string, ComponentMetrics>();
  private observers: PerformanceObserver[] = [];
  private isClient: boolean;
  private startTime: number;

  constructor() {
    this.isClient = typeof window !== 'undefined';
    this.startTime = this.isClient ? performance.now() : Date.now();
    
    if (this.isClient) {
      this.initializeObservers();
      this.scheduleMetricsCollection();
    }
  }

  /**
   * Record a custom performance metric
   */
  recordMetric(
    name: string,
    value: number,
    unit: 'ms' | 'bytes' | 'count' | 'percentage' = 'ms',
    tags?: Record<string, string>,
    metadata?: Record<string, any>
  ): void {
    const metric: PerformanceMetric = {
      name,
      value,
      unit,
      timestamp: Date.now(),
      tags,
      metadata
    };

    this.metrics.push(metric);
    
    // Keep only recent metrics to prevent memory leaks
    if (this.metrics.length > LIMITS.MAX_STORED_LOGS) {
      this.metrics.splice(0, this.metrics.length - LIMITS.MAX_STORED_LOGS);
    }

    logger.debug(`Performance metric recorded: ${name}`, {
      metadata: {
        value,
        unit,
        tags,
        ...metadata
      }
    });

    // Send to analytics service in production
    if (process.env.NODE_ENV === 'production') {
      this.sendToAnalytics(metric);
    }
  }

  /**
   * Measure function execution time
   */
  measureFunction<T extends (...args: any[]) => any>(
    fn: T,
    name?: string,
    tags?: Record<string, string>
  ): T {
    const functionName = name || fn.name || 'anonymous';
    
    return ((...args: any[]) => {
      const startTime = performance.now();
      
      try {
        const result = fn(...args);
        
        if (result instanceof Promise) {
          return result.finally(() => {
            const duration = performance.now() - startTime;
            this.recordMetric(`function.${functionName}`, duration, 'ms', {
              type: 'async',
              ...tags
            });
          });
        } else {
          const duration = performance.now() - startTime;
          this.recordMetric(`function.${functionName}`, duration, 'ms', {
            type: 'sync',
            ...tags
          });
          return result;
        }
      } catch (error) {
        const duration = performance.now() - startTime;
        this.recordMetric(`function.${functionName}.error`, duration, 'ms', {
          type: 'error',
          ...tags
        });
        throw error;
      }
    }) as T;
  }

  /**
   * Measure API call performance
   */
  measureApiCall<T>(
    apiCall: () => Promise<T>,
    endpoint: string,
    method: string = 'GET'
  ): Promise<T> {
    const startTime = performance.now();
    
    return apiCall()
      .then((result) => {
        const duration = performance.now() - startTime;
        this.recordMetric('api.call', duration, 'ms', {
          endpoint,
          method,
          status: 'success'
        });
        return result;
      })
      .catch((error) => {
        const duration = performance.now() - startTime;
        this.recordMetric('api.call', duration, 'ms', {
          endpoint,
          method,
          status: 'error'
        });
        throw error;
      });
  }

  /**
   * Track component performance
   */
  trackComponent(name: string, phase: 'mount' | 'render' | 'update', duration: number): void {
    const existing = this.componentMetrics.get(name) || {
      name,
      mountTime: 0,
      renderTime: 0,
      updateCount: 0,
      lastUpdate: Date.now()
    };

    switch (phase) {
      case 'mount':
        existing.mountTime = duration;
        break;
      case 'render':
        existing.renderTime = duration;
        break;
      case 'update':
        existing.updateCount++;
        existing.lastUpdate = Date.now();
        break;
    }

    this.componentMetrics.set(name, existing);
    
    this.recordMetric(`component.${phase}`, duration, 'ms', {
      component: name
    });
  }

  /**
   * Get navigation timing metrics
   */
  getNavigationMetrics(): NavigationMetrics | null {
    if (!this.isClient || !window.performance.timing) {
      return null;
    }

    const timing = window.performance.timing;
    const navigation = window.performance.navigation;

    return {
      dns: timing.domainLookupEnd - timing.domainLookupStart,
      tcp: timing.connectEnd - timing.connectStart,
      ssl: timing.secureConnectionStart > 0 ? timing.connectEnd - timing.secureConnectionStart : 0,
      ttfb: timing.responseStart - timing.requestStart,
      domContentLoaded: timing.domContentLoadedEventEnd - timing.navigationStart,
      loadComplete: timing.loadEventEnd - timing.navigationStart,
      firstPaint: this.getFirstPaint(),
      firstContentfulPaint: this.getFirstContentfulPaint(),
      largestContentfulPaint: this.getLargestContentfulPaint(),
      firstInputDelay: this.getFirstInputDelay(),
      cumulativeLayoutShift: this.getCumulativeLayoutShift()
    };
  }

  /**
   * Get resource loading metrics
   */
  getResourceMetrics(): ResourceMetrics[] {
    if (!this.isClient) return [];

    const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[];
    
    return resources.map(resource => ({
      name: resource.name,
      type: resource.initiatorType,
      size: resource.transferSize || 0,
      duration: resource.duration,
      startTime: resource.startTime,
      endTime: resource.startTime + resource.duration
    }));
  }

  /**
   * Get memory usage metrics
   */
  getMemoryMetrics(): MemoryMetrics | null {
    if (!this.isClient || !(performance as any).memory) {
      return null;
    }

    const memory = (performance as any).memory;
    
    return {
      usedJSHeapSize: memory.usedJSHeapSize,
      totalJSHeapSize: memory.totalJSHeapSize,
      jsHeapSizeLimit: memory.jsHeapSizeLimit,
      usedPercentage: (memory.usedJSHeapSize / memory.jsHeapSizeLimit) * 100
    };
  }

  /**
   * Get all recorded metrics
   */
  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  /**
   * Get component metrics
   */
  getComponentMetrics(): ComponentMetrics[] {
    return Array.from(this.componentMetrics.values());
  }

  /**
   * Get performance summary
   */
  getPerformanceSummary(): {
    navigation: NavigationMetrics | null;
    memory: MemoryMetrics | null;
    resources: ResourceMetrics[];
    components: ComponentMetrics[];
    customMetrics: PerformanceMetric[];
  } {
    return {
      navigation: this.getNavigationMetrics(),
      memory: this.getMemoryMetrics(),
      resources: this.getResourceMetrics(),
      components: this.getComponentMetrics(),
      customMetrics: this.getMetrics()
    };
  }

  /**
   * Clear all metrics
   */
  clearMetrics(): void {
    this.metrics = [];
    this.componentMetrics.clear();
    logger.info('Performance metrics cleared');
  }

  /**
   * Start performance mark
   */
  mark(name: string): void {
    if (this.isClient) {
      performance.mark(name);
    }
  }

  /**
   * Measure between two marks
   */
  measure(name: string, startMark: string, endMark?: string): number {
    if (!this.isClient) return 0;

    try {
      if (endMark) {
        performance.measure(name, startMark, endMark);
      } else {
        performance.measure(name, startMark);
      }

      const measures = performance.getEntriesByName(name, 'measure');
      const duration = measures.length > 0 ? measures[measures.length - 1].duration : 0;
      
      this.recordMetric(name, duration, 'ms');
      return duration;
    } catch (error) {
      logger.error('Failed to measure performance', error as Error, { metadata: { name, startMark, endMark } });
      return 0;
    }
  }

  /**
   * Monitor Core Web Vitals
   */
  monitorCoreWebVitals(): void {
    if (!this.isClient) return;

    // Monitor LCP (Largest Contentful Paint)
    this.observePerformanceEntry('largest-contentful-paint', (entries) => {
      const lastEntry = entries[entries.length - 1];
      this.recordMetric('core-web-vitals.lcp', lastEntry.startTime, 'ms');
    });

    // Monitor FID (First Input Delay)
    this.observePerformanceEntry('first-input', (entries) => {
      const firstEntry = entries[0];
      const fid = (firstEntry as any).processingStart - firstEntry.startTime;
      this.recordMetric('core-web-vitals.fid', fid, 'ms');
    });

    // Monitor CLS (Cumulative Layout Shift)
    this.observePerformanceEntry('layout-shift', (entries) => {
      let clsValue = 0;
      for (const entry of entries) {
        if (!(entry as any).hadRecentInput) {
          clsValue += (entry as any).value;
        }
      }
      this.recordMetric('core-web-vitals.cls', clsValue, 'count');
    });
  }

  /**
   * Destroy performance monitor
   */
  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
    this.clearMetrics();
    logger.info('Performance monitor destroyed');
  }

  // Private methods
  private initializeObservers(): void {
    this.monitorCoreWebVitals();
    
    // Monitor long tasks
    this.observePerformanceEntry('longtask', (entries) => {
      entries.forEach(entry => {
        this.recordMetric('long-task', entry.duration, 'ms', {
          startTime: entry.startTime.toString()
        });
      });
    });

    // Monitor navigation
    this.observePerformanceEntry('navigation', (entries) => {
      const navigation = entries[0] as PerformanceNavigationTiming;
      this.recordMetric('navigation.total', navigation.loadEventEnd - navigation.fetchStart, 'ms');
    });
  }

  private observePerformanceEntry(
    entryType: string,
    callback: (entries: PerformanceEntry[]) => void
  ): void {
    try {
      const observer = new PerformanceObserver((list) => {
        callback(list.getEntries());
      });
      
      observer.observe({ entryTypes: [entryType] });
      this.observers.push(observer);
    } catch (error) {
      logger.error(`Failed to observe ${entryType}`, error as Error);
    }
  }

  private getFirstPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const firstPaint = paintEntries.find(entry => entry.name === 'first-paint');
    return firstPaint ? firstPaint.startTime : 0;
  }

  private getFirstContentfulPaint(): number {
    const paintEntries = performance.getEntriesByType('paint');
    const fcp = paintEntries.find(entry => entry.name === 'first-contentful-paint');
    return fcp ? fcp.startTime : 0;
  }

  private getLargestContentfulPaint(): number {
    const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
    return lcpEntries.length > 0 ? lcpEntries[lcpEntries.length - 1].startTime : 0;
  }

  private getFirstInputDelay(): number {
    const fidEntries = performance.getEntriesByType('first-input');
    if (fidEntries.length === 0) return 0;
    
    const firstInput = fidEntries[0] as any;
    return firstInput.processingStart - firstInput.startTime;
  }

  private getCumulativeLayoutShift(): number {
    const clsEntries = performance.getEntriesByType('layout-shift');
    let clsValue = 0;
    
    for (const entry of clsEntries) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    
    return clsValue;
  }

  private metricsInterval?: NodeJS.Timeout;

  private scheduleMetricsCollection(): void {
    // Clear existing interval if any
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
    }

    // Collect metrics periodically
    this.metricsInterval = setInterval(() => {
      const memory = this.getMemoryMetrics();
      if (memory) {
        this.recordMetric('memory.used', memory.usedJSHeapSize, 'bytes');
        this.recordMetric('memory.usage-percentage', memory.usedPercentage, 'percentage');
      }
    }, TIMING.CACHE_SHORT); // Every 5 minutes
  }

  public cleanup(): void {
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = undefined;
    }
  }

  private sendToAnalytics(metric: PerformanceMetric): void {
    // In production, send to analytics service
    // Examples: Google Analytics, Mixpanel, Custom endpoint
    
    // For now, just log important metrics
    if (metric.name.includes('core-web-vitals') || metric.name.includes('api.call')) {
      logger.info('Performance metric', {
        metadata: {
          name: metric.name,
          value: metric.value,
          unit: metric.unit,
          tags: metric.tags
        }
      });
    }
  }
}

// Create singleton instance
export const performanceMonitor = new PerformanceMonitor();

// Utility functions and decorators
export const measurePerformance = <T extends (...args: any[]) => any>(
  target: T,
  name?: string,
  tags?: Record<string, string>
): T => {
  return performanceMonitor.measureFunction(target, name, tags);
};

export const measureApiCall = <T>(
  apiCall: () => Promise<T>,
  endpoint: string,
  method?: string
): Promise<T> => {
  return performanceMonitor.measureApiCall(apiCall, endpoint, method);
};

// React component performance tracking
export const trackComponentPerformance = (
  componentName: string,
  phase: 'mount' | 'render' | 'update',
  duration: number
): void => {
  performanceMonitor.trackComponent(componentName, phase, duration);
};

// Performance decorator
export function Performance(name?: string, tags?: Record<string, string>) {
  return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
    const originalMethod = descriptor.value;
    const methodName = name || `${target.constructor.name}.${propertyKey}`;
    
    descriptor.value = measurePerformance(originalMethod, methodName, tags);
    
    return descriptor;
  };
}

// Export types
export type {
  PerformanceMetric,
  NavigationMetrics,
  ResourceMetrics,
  MemoryMetrics,
  ComponentMetrics
};

export default performanceMonitor;