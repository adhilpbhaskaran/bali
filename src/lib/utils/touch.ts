'use client';

import { useEffect, useRef, useCallback } from 'react';
import { logger } from '@/lib/utils/logger';
import { responsive } from '@/lib/utils/responsive';

// Touch event types
export interface TouchPoint {
  x: number;
  y: number;
  timestamp: number;
}

export interface SwipeDirection {
  direction: 'up' | 'down' | 'left' | 'right';
  distance: number;
  velocity: number;
  duration: number;
}

export interface PinchGesture {
  scale: number;
  center: TouchPoint;
  distance: number;
}

export interface TapGesture {
  point: TouchPoint;
  tapCount: number;
}

// Touch configuration
export interface TouchConfig {
  swipeThreshold: number;
  swipeVelocityThreshold: number;
  tapThreshold: number;
  doubleTapDelay: number;
  longPressDelay: number;
  pinchThreshold: number;
}

const DEFAULT_TOUCH_CONFIG: TouchConfig = {
  swipeThreshold: 50,
  swipeVelocityThreshold: 0.3,
  tapThreshold: 10,
  doubleTapDelay: 300,
  longPressDelay: 500,
  pinchThreshold: 10
};

// Touch gesture handlers
export interface TouchHandlers {
  onTap?: (gesture: TapGesture) => void;
  onDoubleTap?: (gesture: TapGesture) => void;
  onLongPress?: (point: TouchPoint) => void;
  onSwipe?: (gesture: SwipeDirection) => void;
  onPinch?: (gesture: PinchGesture) => void;
  onTouchStart?: (event: TouchEvent) => void;
  onTouchMove?: (event: TouchEvent) => void;
  onTouchEnd?: (event: TouchEvent) => void;
}

// Touch gesture manager
class TouchGestureManager {
  private element: HTMLElement | null = null;
  private config: TouchConfig;
  private handlers: TouchHandlers = {};
  
  // Touch state
  private touchStart: TouchPoint | null = null;
  private touchCurrent: TouchPoint | null = null;
  private lastTap: TouchPoint | null = null;
  private tapCount = 0;
  private longPressTimer: NodeJS.Timeout | null = null;
  private doubleTapTimer: NodeJS.Timeout | null = null;
  
  // Multi-touch state
  private initialDistance = 0;
  private initialScale = 1;
  private touches: Touch[] = [];

  constructor(config: Partial<TouchConfig> = {}) {
    this.config = { ...DEFAULT_TOUCH_CONFIG, ...config };
  }

  /**
   * Attach touch listeners to element
   */
  attach(element: HTMLElement, handlers: TouchHandlers): () => void {
    this.element = element;
    this.handlers = handlers;

    // Add touch event listeners
    element.addEventListener('touchstart', this.handleTouchStart, { passive: false });
    element.addEventListener('touchmove', this.handleTouchMove, { passive: false });
    element.addEventListener('touchend', this.handleTouchEnd, { passive: false });
    element.addEventListener('touchcancel', this.handleTouchCancel, { passive: false });

    // Add mouse event listeners for desktop testing
    if (!responsive.isTouch()) {
      element.addEventListener('mousedown', this.handleMouseDown);
      element.addEventListener('mousemove', this.handleMouseMove);
      element.addEventListener('mouseup', this.handleMouseUp);
    }

    // Return cleanup function
    return () => {
      this.detach();
    };
  }

  /**
   * Detach touch listeners
   */
  detach(): void {
    if (!this.element) return;

    this.element.removeEventListener('touchstart', this.handleTouchStart);
    this.element.removeEventListener('touchmove', this.handleTouchMove);
    this.element.removeEventListener('touchend', this.handleTouchEnd);
    this.element.removeEventListener('touchcancel', this.handleTouchCancel);

    if (!responsive.isTouch()) {
      this.element.removeEventListener('mousedown', this.handleMouseDown);
      this.element.removeEventListener('mousemove', this.handleMouseMove);
      this.element.removeEventListener('mouseup', this.handleMouseUp);
    }

    this.cleanup();
    this.element = null;
    this.handlers = {};
  }

  /**
   * Update configuration
   */
  updateConfig(config: Partial<TouchConfig>): void {
    this.config = { ...this.config, ...config };
  }

  // Private methods
  private handleTouchStart = (event: TouchEvent): void => {
    try {
      this.touches = Array.from(event.touches);
      
      if (this.touches.length === 1) {
        this.handleSingleTouchStart(this.touches[0]);
      } else if (this.touches.length === 2) {
        this.handleMultiTouchStart();
      }

      this.handlers.onTouchStart?.(event);
    } catch (error) {
      logger.error('Error in touch start handler', error as Error);
    }
  };

  private handleTouchMove = (event: TouchEvent): void => {
    try {
      this.touches = Array.from(event.touches);
      
      if (this.touches.length === 1) {
        this.handleSingleTouchMove(this.touches[0]);
      } else if (this.touches.length === 2) {
        this.handleMultiTouchMove();
      }

      this.handlers.onTouchMove?.(event);
    } catch (error) {
      logger.error('Error in touch move handler', error as Error);
    }
  };

  private handleTouchEnd = (event: TouchEvent): void => {
    try {
      if (event.touches.length === 0) {
        this.handleSingleTouchEnd();
      }

      this.touches = Array.from(event.touches);
      this.handlers.onTouchEnd?.(event);
    } catch (error) {
      logger.error('Error in touch end handler', error as Error);
    }
  };

  private handleTouchCancel = (): void => {
    this.cleanup();
  };

  private handleSingleTouchStart(touch: Touch): void {
    const point = this.getTouchPoint(touch);
    this.touchStart = point;
    this.touchCurrent = point;

    // Clear any existing long press timer
    this.clearLongPressTimer();

    // Start long press timer
    this.longPressTimer = setTimeout(() => {
      if (this.touchStart && this.isWithinThreshold(this.touchStart, point, this.config.tapThreshold)) {
        this.handlers.onLongPress?.(point);
      }
    }, this.config.longPressDelay);
  }

  private handleSingleTouchMove(touch: Touch): void {
    if (!this.touchStart) return;

    this.touchCurrent = this.getTouchPoint(touch);

    // Cancel long press if moved too far
    if (!this.isWithinThreshold(this.touchStart, this.touchCurrent, this.config.tapThreshold)) {
      this.clearLongPressTimer();
    }
  }

  private handleSingleTouchEnd(): void {
    if (!this.touchStart || !this.touchCurrent) {
      this.cleanup();
      return;
    }

    this.clearLongPressTimer();

    const distance = this.getDistance(this.touchStart, this.touchCurrent);
    const duration = this.touchCurrent.timestamp - this.touchStart.timestamp;

    if (distance >= this.config.swipeThreshold) {
      // Handle swipe
      this.handleSwipe();
    } else if (distance <= this.config.tapThreshold) {
      // Handle tap
      this.handleTap();
    }

    this.cleanup();
  }

  private handleMultiTouchStart(): void {
    if (this.touches.length === 2) {
      this.initialDistance = this.getDistanceBetweenTouches(this.touches[0], this.touches[1]);
      this.initialScale = 1;
    }
  }

  private handleMultiTouchMove(): void {
    if (this.touches.length === 2) {
      const currentDistance = this.getDistanceBetweenTouches(this.touches[0], this.touches[1]);
      const scale = currentDistance / this.initialDistance;
      
      if (Math.abs(scale - this.initialScale) > this.config.pinchThreshold / 100) {
        const center = this.getCenterPoint(this.touches[0], this.touches[1]);
        
        this.handlers.onPinch?.({
          scale,
          center,
          distance: currentDistance
        });
        
        this.initialScale = scale;
      }
    }
  }

  private handleSwipe(): void {
    if (!this.touchStart || !this.touchCurrent) return;

    const deltaX = this.touchCurrent.x - this.touchStart.x;
    const deltaY = this.touchCurrent.y - this.touchStart.y;
    const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
    const duration = this.touchCurrent.timestamp - this.touchStart.timestamp;
    const velocity = distance / duration;

    if (velocity < this.config.swipeVelocityThreshold) return;

    let direction: SwipeDirection['direction'];
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      direction = deltaX > 0 ? 'right' : 'left';
    } else {
      direction = deltaY > 0 ? 'down' : 'up';
    }

    this.handlers.onSwipe?.({
      direction,
      distance,
      velocity,
      duration
    });
  }

  private handleTap(): void {
    if (!this.touchCurrent) return;

    this.tapCount++;

    // Clear existing double tap timer
    if (this.doubleTapTimer) {
      clearTimeout(this.doubleTapTimer);
      this.doubleTapTimer = null;
    }

    // Check for double tap
    if (this.lastTap && 
        this.isWithinThreshold(this.lastTap, this.touchCurrent, this.config.tapThreshold) &&
        (this.touchCurrent.timestamp - this.lastTap.timestamp) <= this.config.doubleTapDelay) {
      
      // Double tap detected
      this.handlers.onDoubleTap?.({
        point: this.touchCurrent,
        tapCount: this.tapCount
      });
      
      this.tapCount = 0;
      this.lastTap = null;
    } else {
      // Single tap - wait for potential double tap
      this.doubleTapTimer = setTimeout(() => {
        this.handlers.onTap?.({
          point: this.touchCurrent!,
          tapCount: this.tapCount
        });
        
        this.tapCount = 0;
        this.doubleTapTimer = null;
      }, this.config.doubleTapDelay);
      
      this.lastTap = this.touchCurrent;
    }
  }

  // Mouse event handlers for desktop testing
  private handleMouseDown = (event: MouseEvent): void => {
    const touch = this.mouseEventToTouch(event);
    this.handleSingleTouchStart(touch);
  };

  private handleMouseMove = (event: MouseEvent): void => {
    if (!this.touchStart) return;
    const touch = this.mouseEventToTouch(event);
    this.handleSingleTouchMove(touch);
  };

  private handleMouseUp = (): void => {
    this.handleSingleTouchEnd();
  };

  // Utility methods
  private getTouchPoint(touch: Touch): TouchPoint {
    return {
      x: touch.clientX,
      y: touch.clientY,
      timestamp: Date.now()
    };
  }

  private mouseEventToTouch(event: MouseEvent): Touch {
    return {
      clientX: event.clientX,
      clientY: event.clientY,
      identifier: 0,
      pageX: event.pageX,
      pageY: event.pageY,
      screenX: event.screenX,
      screenY: event.screenY,
      target: event.target as Element,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 0
    } as Touch;
  }

  private getDistance(point1: TouchPoint, point2: TouchPoint): number {
    const deltaX = point2.x - point1.x;
    const deltaY = point2.y - point1.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  private getDistanceBetweenTouches(touch1: Touch, touch2: Touch): number {
    const deltaX = touch2.clientX - touch1.clientX;
    const deltaY = touch2.clientY - touch1.clientY;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  private getCenterPoint(touch1: Touch, touch2: Touch): TouchPoint {
    return {
      x: (touch1.clientX + touch2.clientX) / 2,
      y: (touch1.clientY + touch2.clientY) / 2,
      timestamp: Date.now()
    };
  }

  private isWithinThreshold(point1: TouchPoint, point2: TouchPoint, threshold: number): boolean {
    return this.getDistance(point1, point2) <= threshold;
  }

  private clearLongPressTimer(): void {
    if (this.longPressTimer) {
      clearTimeout(this.longPressTimer);
      this.longPressTimer = null;
    }
  }

  private cleanup(): void {
    this.touchStart = null;
    this.touchCurrent = null;
    this.clearLongPressTimer();
    this.initialDistance = 0;
    this.initialScale = 1;
    this.touches = [];
  }
}

// React hooks

/**
 * Hook for handling touch gestures
 */
export function useTouchGestures(
  handlers: TouchHandlers,
  config?: Partial<TouchConfig>
) {
  const elementRef = useRef<HTMLElement>(null);
  const managerRef = useRef<TouchGestureManager | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    // Create gesture manager
    managerRef.current = new TouchGestureManager(config);
    
    // Attach to element
    const cleanup = managerRef.current.attach(elementRef.current, handlers);

    return () => {
      cleanup();
      managerRef.current = null;
    };
  }, [handlers, config]);

  return elementRef;
}

/**
 * Hook for swipe gestures
 */
export function useSwipeGesture(
  onSwipe: (direction: SwipeDirection) => void,
  config?: Partial<TouchConfig>
) {
  return useTouchGestures({ onSwipe }, config);
}

/**
 * Hook for tap gestures
 */
export function useTapGesture(
  onTap: (gesture: TapGesture) => void,
  onDoubleTap?: (gesture: TapGesture) => void,
  config?: Partial<TouchConfig>
) {
  return useTouchGestures({ onTap, onDoubleTap }, config);
}

/**
 * Hook for long press gesture
 */
export function useLongPress(
  onLongPress: (point: TouchPoint) => void,
  config?: Partial<TouchConfig>
) {
  return useTouchGestures({ onLongPress }, config);
}

/**
 * Hook for pinch gesture
 */
export function usePinchGesture(
  onPinch: (gesture: PinchGesture) => void,
  config?: Partial<TouchConfig>
) {
  return useTouchGestures({ onPinch }, config);
}

// Utility functions

/**
 * Add touch-friendly styles to element
 */
export function addTouchStyles(element: HTMLElement): void {
  element.style.touchAction = 'manipulation';
  element.style.userSelect = 'none';
  (element.style as any).webkitUserSelect = 'none';
  (element.style as any).webkitTouchCallout = 'none';
  (element.style as any).webkitTapHighlightColor = 'transparent';
}

/**
 * Remove touch-friendly styles from element
 */
export function removeTouchStyles(element: HTMLElement): void {
  element.style.touchAction = '';
  element.style.userSelect = '';
  (element.style as any).webkitUserSelect = '';
  (element.style as any).webkitTouchCallout = '';
  (element.style as any).webkitTapHighlightColor = '';
}

/**
 * Check if element supports touch
 */
export function supportsTouchEvents(): boolean {
  return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
}

/**
 * Get touch-friendly button size
 */
export function getTouchButtonSize(): { width: string; height: string } {
  const minSize = responsive.isMobile() ? '44px' : '32px';
  return { width: minSize, height: minSize };
}

/**
 * Get touch-friendly spacing
 */
export function getTouchSpacing(): string {
  return responsive.isMobile() ? '8px' : '4px';
}

/**
 * Prevent default touch behaviors
 */
export function preventTouchDefaults(event: TouchEvent): void {
  event.preventDefault();
  event.stopPropagation();
}

/**
 * Create touch-friendly click handler
 */
export function createTouchClickHandler(
  onClick: () => void,
  options: { preventDefault?: boolean; stopPropagation?: boolean } = {}
) {
  return (event: TouchEvent | MouseEvent) => {
    if (options.preventDefault) {
      event.preventDefault();
    }
    if (options.stopPropagation) {
      event.stopPropagation();
    }
    onClick();
  };
}

export default TouchGestureManager;