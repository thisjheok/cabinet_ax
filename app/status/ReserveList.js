'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReserveList() {
    const [data, setData] = useState([]); // 초기 상태는 빈 배열로 설정
    const rows = ['A', 'B', 'C', 'D', 'E'];
  
    useEffect(() => {
        async function fetchData() {
            const response = await fetch('/api/post/get'); // /api/page 엔드포인트에서 데이터를 가져옵니다.
            const result = await response.json();
            setData(result); // 가져온 데이터를 상태로 설정합니다.
        }
        fetchData();
    }, []);
  
    function parseDate(dateString) {
      const [year, month, day] = dateString.split('-').map(Number);
      return new Date(year, month - 1, day);
    }
    
    function isReserved(row, col) {
      const reservation = data.find(r => r.locationRow === row && r.locationCol === col);
      if (reservation) {
        const startDate = parseDate(reservation.startDate);
        const endDate = parseDate(reservation.endDate);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return currentDate >= startDate && currentDate <= endDate;
      }
      return false;
    }
  
    function getReservationInfo(row, col) {
      const reservation = data.find(r => r.locationRow === row && r.locationCol === col);
      if (reservation) {
        return {
          name: reservation.name,
          stdate: `${reservation.startDate}~`,
          endate: `${reservation.endDate}`
        };
      }
      return null;
    }
  
    return (
      <div>
        <div className="title-box">
          <h2 className="title-status">사물함 예약 현황</h2>
          <h4 className="sub-title-status">예약할 사물함 번호를 눌러 예약해주세요!</h4>
        </div>
        <div className="locker-grid">
          {rows.flatMap((row, rowIndex) =>
            Array(5).fill(null).map((_, colIndex) => {
              const isReservedCell = isReserved(row, (colIndex + 1).toString());
              const reservationInfo = getReservationInfo(row, (colIndex + 1).toString());
              return (
                <div 
                  key={`${row}${colIndex + 1}`} 
                  className={`locker-cell ${isReservedCell ? 'reserved' : 'non-reserved'}`}
                >
                  {isReservedCell ? (
                    <>
                      {row}{colIndex + 1}
                      <div className="reservation-info">
                        <div>{reservationInfo.name}</div>
                        <div>{reservationInfo.stdate}</div>
                        <div>{reservationInfo.endate}</div>
                      </div>
                    </>
                  ) : (
                    <Link href={`/reserving/${row}${colIndex + 1}`} className="linkto">
                      {row}{colIndex + 1}
                    </Link>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
}
