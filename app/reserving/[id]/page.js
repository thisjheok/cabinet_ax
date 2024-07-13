import { connectDB } from "@/util/database.js"
import ReservationForm from './ReservationForm'

export default async function Reserving({ params }) {
  const db = (await connectDB).db('ax_cabinet')
  const [row, col] = params.id.split('');
  
  // 사물함 위치로 예약 정보 조회
  let result = await db.collection('reservation').findOne({
    locationRow: row,
    locationCol: col
  });
  
  // 이미 예약된 경우 처리
  if (result) {
    return (
      <div className="reserving-container">
        <h2 className="title">이미 예약된 사물함입니다.</h2>
        <p>예약 정보: {JSON.stringify(result)}</p>
      </div>
    );
  }

  return (
    <div className="reserving-container">
      <h2 className="title">예약하기 ({row}{col})</h2>
      <ReservationForm row={row} col={col} />
    </div>
  );
}