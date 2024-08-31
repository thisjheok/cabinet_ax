'use client'
import { useState, useEffect } from 'react';
import { format, isWithinInterval, eachDayOfInterval } from 'date-fns';
import { ko } from 'date-fns/locale';
import CalendarPicker from './CalendarPicker';
import memberList from '../../memberList';

export default function ReservationForm({ row, col, reservations }) {
  const [errorMessage, setErrorMessage] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [name, setName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [selectedReservation, setSelectedReservation] = useState(null);

  useEffect(() => {
    const ranges = reservations.map(reservation => ({
      start: new Date(reservation.startDate),
      end: new Date(reservation.endDate),
    }));
    setUnavailableDates(ranges);
  }, [reservations]);

  const validateNameAndStudentId = () => {
    const student = memberList.students.find(s => s.name === name);
    if (!student) {
      setErrorMessage('등록되지 않은 이름입니다.');
      return false;
    }
    if (student.studentId !== studentId) {
      setErrorMessage('이름과 학번이 맞지 않습니다.');
      return false;
    }
    return true;
  };

  const isOverlappingWithUnavailableDates = (start, end) => {
    const reservationDays = eachDayOfInterval({ start, end });
    return reservationDays.some(day => 
      unavailableDates.some(range => 
        isWithinInterval(day, { start: new Date(range.start), end: new Date(range.end) })
      )
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!startDate || !endDate) {
      setErrorMessage('시작일과 종료일을 선택해야 합니다.');
      return;
    }

    if (!validateNameAndStudentId()) {
      return;
    }

    const diffTime = Math.abs(endDate - startDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays > 7) {
      setErrorMessage('사용 기간은 7일을 초과할 수 없습니다.');
      return;
    }

    if (startDate < new Date().setHours(0, 0, 0, 0)) {
      setErrorMessage('시작일은 오늘 이후여야 합니다.');
      return;
    }

    if (isOverlappingWithUnavailableDates(startDate, endDate)) {
      setErrorMessage('선택한 기간 중 예약할 수 없는 날짜가 포함되어 있습니다.');
      return;
    }

    const formatDate = (date) => {
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const formData = {
      locationRow: row,
      locationCol: col,
      name: name,  // state에서 직접 가져옴
      studentId: studentId,  // state에서 직접 가져옴
      startDate: formatDate(startDate),  // YYYY-MM-DD 형식으로 변환
      endDate: formatDate(endDate),      // YYYY-MM-DD 형식으로 변환
    };

    try {
      const response = await fetch('/api/post/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (errorData.error === 'Duplicate reservation') {
          alert(`이미 예약정보가 존재합니다 ${errorData.location} ${format(new Date(errorData.startDate), 'M/d')}~${format(new Date(errorData.endDate), 'M/d')}`);
          window.location.href = '/status';
        } else {
          throw new Error('Reservation failed');
        }
        return;
      }


      // 예약 성공 처리 (예: 성공 메시지 표시 또는 페이지 이동)
      alert('예약이 완료되었습니다.');
      window.location.href = '/status';
    } catch (error) {
      setErrorMessage('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  const handleReservationClick = (reservation) => {
    setSelectedReservation(reservation);
  };

return (
    <form onSubmit={handleSubmit}>
      <CalendarPicker 
        unavailableDates={unavailableDates} 
        setStartDate={setStartDate} 
        setEndDate={setEndDate} 
        reservations={reservations}
        onReservationClick={handleReservationClick}
      />
      {selectedReservation && (
        <div className="reservation-info">
          <p className='reservation-info-letters'>{format(new Date(selectedReservation.startDate), 'M월 d일', { locale: ko })} ~ 
             {format(new Date(selectedReservation.endDate), 'M월 d일', { locale: ko })} 예약자: {selectedReservation.name}</p>
        </div>
      )}
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setErrorMessage(''); 
        }
      }
        placeholder="이름"
        required
      />
      <input
        type="text"
        value={studentId}
        onChange={(e) => {
          setStudentId(e.target.value);
          setErrorMessage(''); 
        }}
        placeholder="학번"
        required
      />
      {errorMessage && <p className="error-message">{errorMessage}</p>}
      <button type="submit">예약</button>
    </form>
  );
}
