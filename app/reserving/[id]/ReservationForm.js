'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function ReservationForm({ row, col }) {
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const startDate = new Date(e.target.startDate.value);
    const endDate = new Date(e.target.endDate.value);
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

    const formData = {
      locationRow: row,
      locationCol: col,
      name: e.target.name.value,
      studentId: e.target.studentId.value,
      startDate: e.target.startDate.value,
      endDate: e.target.endDate.value,
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
        throw new Error('Reservation failed');
      }

      // 예약 성공 처리 (예: 성공 메시지 표시 또는 페이지 이동)
      alert('예약이 완료되었습니다.');
      window.location.href = '/status';
      // 여기에 성공 후 처리 로직 추가 (예: 페이지 리디렉션)
    } catch (error) {
      setErrorMessage('예약 중 오류가 발생했습니다. 다시 시도해주세요.');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="이름" required />
        <input type="text" name="studentId" placeholder="학번" required />
        {errorMessage && <p className="error-message">{errorMessage}</p>}
        <div className="date-inputs">
          <label>
            사용 시작일:
            <input type="date" name="startDate" required />
          </label>
          <label>
            사용 종료일:
            <input type="date" name="endDate" required />
          </label>
        </div>
        <button type="submit">예약</button>
      </form>
    </>
  );
}