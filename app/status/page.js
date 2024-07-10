import { connectDB } from "@/util/database";
import Link from 'next/link';

export default async function Status() {
  const client = await connectDB;
  const db = client.db("ax_cabinet");
  let result = await db.collection('reservation').find().toArray();

  const rows = ['A', 'B', 'C', 'D', 'E'];
  const currentDate = new Date();

  function parseDate(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);  // JavaScript의 월은 0부터 시작하므로 1을 빼줍니다.
  }
  
  function isReserved(row, col) {
    const reservation = result.find(r => r.locationRow === row && r.locationCol === col);
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
    const reservation = result.find(r => r.locationRow === row && r.locationCol === col);
    if (reservation) {
      return `${reservation.name} (~${reservation.endDate})`;
    }
    return '';
  }

  return (
    <div>
      <h2 className="title">사물함 예약 현황</h2>
      <div className="startBtn">예약되지 않은 사물함 번호를 눌러 예약해주세요!</div>
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
                    <div className="reservation-info">{reservationInfo}</div>
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