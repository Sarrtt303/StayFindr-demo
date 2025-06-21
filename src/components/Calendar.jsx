import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const InteractiveCalendar = ({onDateChange}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedRange, setSelectedRange] = useState({
    startDate: null,
    endDate: null
  });


  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const getDaysInMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const navigateMonth = (direction) => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + direction);
      return newDate;
    });
  };

  const isDateInRange = (date) => {
    if (!selectedRange.startDate || !selectedRange.endDate) return false;
    return date >= selectedRange.startDate && date <= selectedRange.endDate;
  };

  const isDateSelected = (date) => {
    return (selectedRange.startDate && date.getTime() === selectedRange.startDate.getTime()) ||
           (selectedRange.endDate && date.getTime() === selectedRange.endDate.getTime());
  };

  const handleDateClick = (day) => {
  const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);

  if (!selectedRange.startDate || (selectedRange.startDate && selectedRange.endDate)) {
    setSelectedRange({
      startDate: clickedDate,
      endDate: null
    });
  } else if (selectedRange.startDate && !selectedRange.endDate) {
    if (clickedDate >= selectedRange.startDate) {
      const updatedRange = {
        startDate: selectedRange.startDate,
        endDate: clickedDate
      };
      setSelectedRange(updatedRange);
      if (onDateChange) onDateChange(updatedRange); // 🔥 Send range to parent
    } else {
      const updatedRange = {
        startDate: clickedDate,
        endDate: selectedRange.startDate
      };
      setSelectedRange(updatedRange);
      if (onDateChange) onDateChange(updatedRange); // 🔥 Send range to parent
    }
  }
};


  const clearSelection = () => {
    setSelectedRange({ startDate: null, endDate: null });
  };

  const formatDate = (date) => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const isInRange = isDateInRange(date);
      const isSelected = isDateSelected(date);
      const isToday = date.toDateString() === new Date().toDateString();

      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(day)}
          className={`
            h-10 w-10 rounded-lg flex items-center justify-center text-sm font-medium transition-all duration-200 hover:scale-105
            ${isSelected 
              ? 'bg-blue-600 text-white shadow-lg' 
              : isInRange 
                ? 'bg-blue-100 text-blue-800' 
                : isToday 
                  ? 'bg-orange-100 text-orange-600 border-2 border-orange-300' 
                  : 'text-gray-700 hover:bg-gray-100'
            }
          `}
        >
          {day}
        </button>
      );
    }

    return days;
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            📅 Date Range Picker
          </h2>
        </div>
        
        {/* Selected Range Display */}
        <div className="bg-white/20 rounded-lg p-3 backdrop-blur-sm">
          <div className="text-sm opacity-90">Selected Range:</div>
          <div className="font-semibold">
            {selectedRange.startDate && selectedRange.endDate 
              ? `${formatDate(selectedRange.startDate)} - ${formatDate(selectedRange.endDate)}`
              : selectedRange.startDate 
                ? `${formatDate(selectedRange.startDate)} - Select end date`
                : 'No dates selected'
            }
          </div>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateMonth(-1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          
          <h3 className="text-lg font-semibold">
            {months[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h3>
          
          <button
            onClick={() => navigateMonth(1)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      <div className="p-4">
        {/* Weekday Headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {weekdays.map(day => (
            <div key={day} className="h-8 flex items-center justify-center text-xs font-medium text-gray-500">
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Days */}
        <div className="grid grid-cols-7 gap-1">
          {renderCalendar()}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-gray-200 flex gap-2">
        <button
          onClick={clearSelection}
          className="flex-1 py-2 px-4 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Clear
        </button>
        
        <button
          onClick={() => {
            if (selectedRange.startDate && selectedRange.endDate) {
              alert(`Selected: ${formatDate(selectedRange.startDate)} to ${formatDate(selectedRange.endDate)}`);
            }
          }}
          disabled={!selectedRange.startDate || !selectedRange.endDate}
          className={`
            flex-1 py-2 px-4 rounded-lg font-medium transition-colors
            ${selectedRange.startDate && selectedRange.endDate
              ? 'bg-blue-600 text-white hover:bg-blue-700'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }
          `}
        >
          Confirm
        </button>
      </div>

      {/* Instructions */}
      <div className="px-4 pb-4">
        <div className="text-xs text-gray-500 text-center">
          Click a date to start, then click another to complete your range
        </div>
      </div>
    </div>
  );
};

export default InteractiveCalendar;