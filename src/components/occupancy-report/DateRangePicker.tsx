import React, { useState, useRef, useEffect, useCallback } from 'react';
import './DateRangePicker.css';

interface DateRangePickerProps {
  startDate: Date;
  endDate: Date;
  onChange: (start: Date, end: Date) => void;
  label?: string;
}

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDate,
  endDate,
  onChange,
  label = 'Select date period',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMonth, setViewMonth] = useState(startDate.getMonth());
  const [viewYear, setViewYear] = useState(startDate.getFullYear());
  const [tempStart, setTempStart] = useState<Date | null>(startDate);
  const [tempEnd, setTempEnd] = useState<Date | null>(endDate);
  const [selectingStart, setSelectingStart] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Format date as MM/DD/YY
  const formatDate = (date: Date): string => {
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = String(date.getFullYear()).slice(-2);
    return `${month}/${day}/${year}`;
  };

  // Format date for input display
  const formatDateRange = (): string => {
    return `${formatDate(startDate)} – ${formatDate(endDate)}`;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Reset temp dates when opening
  const handleOpen = () => {
    setTempStart(startDate);
    setTempEnd(endDate);
    setViewMonth(startDate.getMonth());
    setViewYear(startDate.getFullYear());
    setSelectingStart(true);
    setIsOpen(true);
  };

  // Navigate months
  const goToPrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // Get days in month
  const getDaysInMonth = (month: number, year: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month (0 = Sunday)
  const getFirstDayOfMonth = (month: number, year: number): number => {
    return new Date(year, month, 1).getDay();
  };

  // Check if date is in selected range
  const isInRange = (day: number): boolean => {
    if (!tempStart || !tempEnd) return false;
    const date = new Date(viewYear, viewMonth, day);
    return date >= tempStart && date <= tempEnd;
  };

  // Check if date is the start or end of range
  const isStartDate = (day: number): boolean => {
    if (!tempStart) return false;
    const date = new Date(viewYear, viewMonth, day);
    return date.toDateString() === tempStart.toDateString();
  };

  const isEndDate = (day: number): boolean => {
    if (!tempEnd) return false;
    const date = new Date(viewYear, viewMonth, day);
    return date.toDateString() === tempEnd.toDateString();
  };

  // Handle day click
  const handleDayClick = (day: number) => {
    const clickedDate = new Date(viewYear, viewMonth, day);
    
    if (selectingStart) {
      setTempStart(clickedDate);
      setTempEnd(null);
      setSelectingStart(false);
    } else {
      if (clickedDate < tempStart!) {
        // If clicked date is before start, swap
        setTempEnd(tempStart);
        setTempStart(clickedDate);
      } else {
        setTempEnd(clickedDate);
      }
      setSelectingStart(true);
    }
  };

  // Apply selection
  const handleApply = () => {
    if (tempStart && tempEnd) {
      onChange(tempStart, tempEnd);
      setIsOpen(false);
    }
  };

  // Generate calendar grid
  const renderCalendarDays = useCallback(() => {
    const daysInMonth = getDaysInMonth(viewMonth, viewYear);
    const firstDay = getFirstDayOfMonth(viewMonth, viewYear);
    const days: React.ReactNode[] = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="calendar-day empty" />);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const inRange = isInRange(day);
      const isStart = isStartDate(day);
      const isEnd = isEndDate(day);
      
      let className = 'calendar-day';
      if (inRange) className += ' in-range';
      if (isStart) className += ' range-start';
      if (isEnd) className += ' range-end';
      if (isStart && isEnd) className += ' single-day';

      days.push(
        <div
          key={day}
          className={className}
          onClick={() => handleDayClick(day)}
        >
          <span className="day-number">{day}</span>
        </div>
      );
    }

    return days;
  }, [viewMonth, viewYear, tempStart, tempEnd]);

  return (
    <div className="date-range-picker" ref={containerRef}>
      <span className="drp-label">{label}</span>
      
      <div className="drp-input" onClick={handleOpen}>
        <span className="drp-value">{formatDateRange()}</span>
        <svg className="drp-calendar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" strokeWidth="2"/>
          <line x1="16" y1="2" x2="16" y2="6" strokeWidth="2"/>
          <line x1="8" y1="2" x2="8" y2="6" strokeWidth="2"/>
          <line x1="3" y1="10" x2="21" y2="10" strokeWidth="2"/>
        </svg>
      </div>

      {isOpen && (
        <div className="drp-dropdown">
          {/* From/To inputs display */}
          <div className="drp-inputs-row">
            <div className={`drp-input-field ${selectingStart ? 'active' : ''}`}>
              <span className="drp-field-label">From</span>
              <span className="drp-field-value">
                {tempStart ? formatDate(tempStart) : '–'}
              </span>
            </div>
            <span className="drp-separator">–</span>
            <div className={`drp-input-field ${!selectingStart ? 'active' : ''}`}>
              <span className="drp-field-label">To</span>
              <span className="drp-field-value">
                {tempEnd ? formatDate(tempEnd) : '–'}
              </span>
            </div>
          </div>

          {/* Month/Year navigation */}
          <div className="drp-nav">
            <button className="drp-nav-btn" onClick={goToPrevMonth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="15,18 9,12 15,6" />
              </svg>
            </button>
            <span className="drp-month-year">
              {MONTHS[viewMonth]} {viewYear}
            </span>
            <button className="drp-nav-btn" onClick={goToNextMonth}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="9,6 15,12 9,18" />
              </svg>
            </button>
          </div>

          {/* Weekday headers */}
          <div className="drp-weekdays">
            {WEEKDAYS.map(day => (
              <div key={day} className="drp-weekday">{day}</div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="drp-calendar-grid">
            {renderCalendarDays()}
          </div>

          {/* Apply button */}
          <button 
            className="drp-apply-btn" 
            onClick={handleApply}
            disabled={!tempStart || !tempEnd}
          >
            Apply
          </button>
        </div>
      )}
    </div>
  );
};

export default DateRangePicker;
