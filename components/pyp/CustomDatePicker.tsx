import React, { useState, useRef, useEffect } from 'react';

interface CustomDatePickerProps {
  selectedDate: Date | null;
  minDate?: Date | null;
  onChange: (date: Date) => void;
}

export default function CustomDatePicker({ selectedDate, minDate, onChange }: CustomDatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const maxDate = new Date();
  maxDate.setMonth(maxDate.getMonth() + 10); // Avanzar hasta 10 meses

  const daysInMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1).getDay();

  const handlePrevMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() - 1);
    if (newDate >= new Date(today.getFullYear(), today.getMonth(), 1)) {
      setCurrentMonth(newDate);
    }
  };

  const handleNextMonth = () => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(newDate.getMonth() + 1);
    if (newDate <= new Date(maxDate.getFullYear(), maxDate.getMonth(), 1)) {
      setCurrentMonth(newDate);
    }
  };

  const handleDateClick = (day: number) => {
    const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (newDate >= today && newDate <= maxDate) {
      onChange(newDate);
      setIsOpen(false);
    }
  };

  const formatHeader = (date: Date) => {
    const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
    return `${months[date.getMonth()]} ${date.getFullYear()}`;
  };

  const renderDays = () => {
    const days = [];
    const weekDays = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];
    
    weekDays.forEach((day, index) => {
      days.push(
        <div key={`header-${index}`} className="text-center text-xs text-gray-500 font-medium py-1">
          {day}
        </div>
      );
    });

    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(<div key={`empty-${i}`} className="p-2"></div>);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
      date.setHours(0, 0, 0, 0);
      
      const isToday = date.getTime() === today.getTime();
      const isSelected = selectedDate?.getTime() === date.getTime();
      let isPast = date < today;
      if (minDate) {
        const minD = new Date(minDate);
        minD.setHours(0, 0, 0, 0);
        if (date <= minD) {
          isPast = true;
        }
      }
      const isTooFar = date > maxDate;
      const isSunday = date.getDay() === 0;
      const isSelectable = !isPast && !isTooFar && !isSunday;

      let bgColor = '';
      let textColor = 'text-gray-700';
      let hoverClass = '';

      if (isToday) {
        bgColor = 'bg-purple-300'; // Lila para el día actual
        textColor = 'text-purple-900 font-bold';
      } else if (isSelected) {
        bgColor = 'bg-blue-600';
        textColor = 'text-white font-bold';
      } else if (isSelectable) {
        bgColor = 'bg-[#6b8e23]'; // Verde oliva
        textColor = 'text-white';
        hoverClass = 'hover:bg-[#556b2f] cursor-pointer';
      } else if (isSunday && !isPast && !isTooFar) {
        bgColor = 'bg-red-500'; // Rojo para domingos
        textColor = 'text-white';
      } else {
        textColor = 'text-gray-300';
      }

      days.push(
        <div
          key={`day-${day}`}
          onClick={() => isSelectable && handleDateClick(day)}
          className={`flex items-center justify-center w-8 h-8 rounded-full text-sm transition-colors mx-auto ${bgColor} ${textColor} ${hoverClass}`}
        >
          {day}
        </div>
      );
    }

    return days;
  };

  return (
    <div className="relative" ref={containerRef}>
      <div className="relative flex items-center">
        <input
          type="text"
          readOnly
          value={selectedDate ? `${selectedDate.getDate().toString().padStart(2, '0')}/${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}/${selectedDate.getFullYear()}` : ''}
          onClick={() => setIsOpen(!isOpen)}
          className="w-[140px] h-8 px-2 text-sm border border-gray-400 rounded focus:outline-none focus:ring-1 focus:ring-gray-400 bg-white cursor-pointer"
        />
        <button 
          type="button" 
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 text-gray-500"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="18" height="18" x="3" y="4" rx="2" ry="2"/>
            <line x1="16" x2="16" y1="2" y2="6"/>
            <line x1="8" x2="8" y1="2" y2="6"/>
            <line x1="3" x2="21" y1="10" y2="10"/>
          </svg>
        </button>
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 z-9999 mt-1 w-64 bg-white border border-gray-200 rounded-lg shadow-xl p-3">
          <div className="flex justify-between items-center mb-2 px-2">
            <div className="text-sm font-semibold text-gray-700">{formatHeader(currentMonth)}</div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m15 18-6-6 6-6"/></svg>
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                className="text-gray-500 hover:text-black hover:bg-gray-100 p-1 rounded"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>
              </button>
            </div>
          </div>
          <div className="grid grid-cols-7 gap-y-2 gap-x-1">
            {renderDays()}
          </div>
        </div>
      )}
    </div>
  );
}
