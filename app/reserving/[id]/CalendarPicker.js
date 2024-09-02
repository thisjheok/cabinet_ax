'use client'

import React, { useState, useEffect } from 'react';
import { 
  format, 
  addMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isWithinInterval, 
  isSameDay, 
  isSameMonth 
} from 'date-fns';
import { ko } from 'date-fns/locale';
import './CalendarPicker.css';

const CalendarPicker = ({ unavailableDates, setStartDate, setEndDate, reservations, onReservationClick }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [localStartDate, setLocalStartDate] = useState(null);
  const [localEndDate, setLocalEndDate] = useState(null);
  const [highlightedReservation, setHighlightedReservation] = useState(null);

  useEffect(() => {
    setStartDate(localStartDate);
    setEndDate(localEndDate);
  }, [localStartDate, localEndDate, setStartDate, setEndDate]);

  const parseLocalDate = (dateString) => {
    const date = new Date(dateString);
    return new Date(date.getFullYear(), date.getMonth(), date.getDate());
  };

  const onDateClick = (day) => {
    const clickedReservation = reservations.find(reservation => 
      isWithinInterval(day, { 
        start: parseLocalDate(reservation.startDate), 
        end: parseLocalDate(reservation.endDate) 
      })
    );

    if (clickedReservation) {
      onReservationClick(clickedReservation);
      setHighlightedReservation(clickedReservation);
      return;
    }
    setHighlightedReservation(null);

    if (unavailableDates.some(range => 
      isWithinInterval(day, { 
        start: parseLocalDate(range.start), 
        end: parseLocalDate(range.end) 
      })
    )) {
      return;
    }

    if (!localStartDate || (localStartDate && localEndDate)) {
      setLocalStartDate(day);
      setLocalEndDate(null);
    } else {
      if (day < localStartDate) {
        setLocalEndDate(localStartDate);
        setLocalStartDate(day);
      } else {
        setLocalEndDate(day);
      }
    }
  };

  const renderHeader = () => (
    <div className="calendar-header">
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setCurrentMonth(addMonths(currentMonth, -1));
        }}
      >
        &lt;
      </button>
      <h2>{format(currentMonth, 'yyyy년 M월', { locale: ko })}</h2>
      <button 
        type="button"
        onClick={(e) => {
          e.preventDefault();
          setCurrentMonth(addMonths(currentMonth, 1));
        }}
      >
        &gt;
      </button>
    </div>
  );

  const renderDays = () => {
    const dateFormat = 'EEEEE';
    const days = [];

    const start = startOfWeek(startOfMonth(currentMonth));
    for (let i = 0; i < 7; i++) {
      days.push(
        <div key={i} className="calendar-day-header">
          {format(addDays(start, i), dateFormat, { locale: ko })}
        </div>
      );
    }
    return <div className="calendar-days">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const start = startOfWeek(monthStart);
    const end = endOfWeek(monthEnd);

    const dateFormat = 'd';
    const rows = [];
    let days = [];
    let day = start;

    while (day <= end) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, dateFormat);
        const cloneDay = day;
        const isUnavailable = unavailableDates.some(range => 
          isWithinInterval(cloneDay, { 
            start: parseLocalDate(range.start), 
            end: parseLocalDate(range.end) 
          })
        );
        const isInRange = (localStartDate && localEndDate && isWithinInterval(cloneDay, { start: localStartDate, end: localEndDate })) ||
                  (localStartDate && isSameDay(cloneDay, localStartDate));
        const isStartDate = localStartDate && isSameDay(cloneDay, localStartDate);
        const isEndDate = localEndDate && isSameDay(cloneDay, localEndDate);
        const isReserved = reservations.some(reservation => 
          isWithinInterval(cloneDay, { 
            start: parseLocalDate(reservation.startDate), 
            end: parseLocalDate(reservation.endDate) 
          })
        );
        const isHighlighted = highlightedReservation && isWithinInterval(cloneDay, {
          start: parseLocalDate(highlightedReservation.startDate),
          end: parseLocalDate(highlightedReservation.endDate)
        });

        let dayClass = 'calendar-day';
        if (!isSameMonth(day, monthStart)) dayClass += ' disabled';
        if (isSameDay(day, new Date())) dayClass += ' today';
        if (isInRange) dayClass += ' in-range';
        if (isStartDate || isEndDate) dayClass += ' selected';
        if (isUnavailable || isReserved) dayClass += ' unavailable';
        else dayClass += ' available';
        if (isHighlighted) dayClass += ' highlighted';

        days.push(
          <div
            key={day}
            className={dayClass}
            onClick={() => onDateClick(cloneDay)}
          >
            {formattedDate}
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div key={day} className="calendar-week">
          {days}
        </div>
      );
      days = [];
    }
    return <div className="calendar-body">{rows}</div>;
  };

  return (
    <div className="calendar-picker">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
      <div className="calendar-footer">
        <p>시작일: {localStartDate ? format(localStartDate, 'yyyy-MM-dd', { locale: ko }) : '선택 안됨'}</p>
        <p>종료일: {localEndDate ? format(localEndDate, 'yyyy-MM-dd', { locale: ko }) : '선택 안됨'}</p>
      </div>
    </div>
  );
};

export default CalendarPicker;