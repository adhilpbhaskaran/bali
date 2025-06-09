'use client';

import { useState, useEffect, useCallback, KeyboardEvent } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CalendarProps {
  availableDates: {
    date: string;
    price: number;
    availability: 'available' | 'limited' | 'booked';
    spotsLeft?: number;
  }[];
  selectedDate: string | null;
  onDateSelect: (date: string) => void;
  className?: string;
  tourType?: string;
}

export default function Calendar({
  availableDates,
  selectedDate,
  onDateSelect,
  className = '',
  tourType = 'GIT'
}: CalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [calendarDays, setCalendarDays] = useState<Array<{ date: Date | null; availability?: string; price?: number; spotsLeft?: number }>>([]);
  const [focusedDay, setFocusedDay] = useState<number | null>(null);

  // Generate calendar days for the current month
  const generateCalendarDays = useCallback(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    
    // Get the first day of the month
    const firstDayOfMonth = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    
    // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    const days: Array<{ date: Date | null; availability?: string; price?: number; spotsLeft?: number }> = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDayOfWeek; i++) {
      days.push({ date: null });
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateString = date.toISOString().split('T')[0];
      
      // Find if this date is in availableDates
      const availableDate = availableDates.find(d => d.date === dateString);
      
      if (availableDate) {
        days.push({
          date,
          availability: availableDate.availability,
          price: availableDate.price,
          spotsLeft: availableDate.spotsLeft
        });
      } else {
        days.push({ date, availability: 'booked' });
      }
    }
    
    setCalendarDays(days);
  }, [currentMonth, availableDates]);
  
  useEffect(() => {
    generateCalendarDays();
  }, [currentMonth, availableDates, generateCalendarDays]);
  
  const goToPreviousMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };
  
  const goToNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const handleDateClick = (day: { date: Date | null; availability?: string }) => {
    if (day.date && day.availability !== 'booked') {
      const dateString = day.date.toISOString().split('T')[0];
      onDateSelect(dateString);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, day: { date: Date | null; availability?: string }, index: number) => {
    if (!day.date) return;
    
    switch (e.key) {
      case 'Enter':
      case ' ':
        e.preventDefault();
        if (day.availability !== 'booked') {
          handleDateClick(day);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (index < calendarDays.length - 1) {
          setFocusedDay(index + 1);
          document.getElementById(`calendar-day-${index + 1}`)?.focus();
        }
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (index > 0) {
          setFocusedDay(index - 1);
          document.getElementById(`calendar-day-${index - 1}`)?.focus();
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (index >= 7) {
          setFocusedDay(index - 7);
          document.getElementById(`calendar-day-${index - 7}`)?.focus();
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (index + 7 < calendarDays.length) {
          setFocusedDay(index + 7);
          document.getElementById(`calendar-day-${index + 7}`)?.focus();
        }
        break;
      default:
        break;
    }
  };

  const getAvailabilityLabel = (day: { date: Date | null; availability?: string; spotsLeft?: number }) => {
    if (!day.date) return '';
    
    if (day.availability === 'booked') {
      return 'Sold Out';
    } else if (day.availability === 'limited') {
      return `Limited (${day.spotsLeft || 'few'} spots left)`;
    } else {
      return 'Available';
    }
  };

  const formatPrice = (price?: number) => {
    return price ? `$${price}` : '';
  };

  const isDateSelected = (day: { date: Date | null }) => {
    if (!day.date || !selectedDate) return false;
    const dateString = day.date.toISOString().split('T')[0];
    return dateString === selectedDate;
  };

  const getDateButtonClass = (day: { date: Date | null; availability?: string }) => {
    if (!day.date) return 'invisible';
    
    let className = 'w-full h-full flex flex-col items-center justify-center rounded-md p-1 transition-colors';
    
    if (isDateSelected(day)) {
      return `${className} bg-primary-500 text-white`;
    }
    
    if (day.availability === 'booked') {
      return `${className} text-white/30 cursor-not-allowed`;
    } else if (day.availability === 'limited') {
      return `${className} bg-amber-500/20 text-amber-500 hover:bg-amber-500/30 cursor-pointer`;
    } else {
      return `${className} bg-green-500/20 text-green-500 hover:bg-green-500/30 cursor-pointer`;
    }
  };

  return (
    <div className={`calendar ${className}`} role="application" aria-label="Date picker calendar">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <button 
          type="button" 
          onClick={goToPreviousMonth}
          className="p-2 rounded-full hover:bg-dark-700 transition-colors"
          aria-label="Previous month"
        >
          <ChevronLeft size={20} />
        </button>
        <h3 className="text-lg font-medium" aria-live="polite">
          {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h3>
        <button 
          type="button" 
          onClick={goToNextMonth}
          className="p-2 rounded-full hover:bg-dark-700 transition-colors"
          aria-label="Next month"
        >
          <ChevronRight size={20} />
        </button>
      </div>
      
      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1" role="grid">
        {/* Day Headers */}
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day, index) => (
          <div 
            key={day} 
            className="text-center text-xs font-medium text-white/70 py-1"
            role="columnheader"
            aria-label={day}
          >
            {day}
          </div>
        ))}
        
        {/* Calendar Days */}
        {calendarDays.map((day, index) => (
          <div 
            key={index} 
            className="aspect-square"
            role="gridcell"
            aria-selected={isDateSelected(day)}
            aria-disabled={!day.date || day.availability === 'booked'}
          >
            {day.date ? (
              <div
                id={`calendar-day-${index}`}
                tabIndex={focusedDay === index || (isDateSelected(day) && day.availability !== 'booked') ? 0 : -1}
                className={getDateButtonClass(day)}
                onClick={() => handleDateClick(day)}
                onKeyDown={(e) => handleKeyDown(e, day, index)}
                role="button"
                aria-label={`${day.date.getDate()} ${currentMonth.toLocaleDateString('en-US', { month: 'long' })}, ${getAvailabilityLabel(day)}${day.price ? `, Price: ${formatPrice(day.price)}` : ''}`}
              >
                <span className="text-sm">{day.date.getDate()}</span>
                {tourType === 'FIT' && day.price && (
                  <span className="text-xs mt-1">{formatPrice(day.price)}</span>
                )}
              </div>
            ) : (
              <div className="invisible"></div>
            )}
          </div>
        ))}
      </div>
      
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mt-4" role="region" aria-label="Calendar legend">
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-green-500/20 mr-2"></div>
          <span className="text-xs text-white/70">Available</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-amber-500/20 mr-2"></div>
          <span className="text-xs text-white/70">Limited</span>
        </div>
        <div className="flex items-center">
          <div className="w-3 h-3 rounded-full bg-dark-700 mr-2"></div>
          <span className="text-xs text-white/70">Sold Out</span>
        </div>
      </div>
    </div>
  );
}