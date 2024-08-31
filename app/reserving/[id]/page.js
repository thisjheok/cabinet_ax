import { connectDB } from "@/util/database.js"
import ReservationForm from './ReservationForm'

// 데이터베이스 연결을 저장할 변수
let cachedDb = null;

export default async function Reserving({ params }) {
  const [row, col] = params.id.split('');
  let result = [];

  try {
    // 연결이 없으면 새로 생성하고 저장
    if (!cachedDb) {
      const client = await connectDB;
      await client.connect();
      cachedDb = client.db('ax_cabinet');
    }
    
    // 저장된 연결을 사용하여 컬렉션에 접근
    result = await cachedDb.collection('reservation').find({
      locationRow: row,
      locationCol: col
    }).toArray();

    console.log(result);
  } catch (error) {
    console.error("Database operation error:", error);
    // 여기서 오류를 처리합니다. 예를 들어, 사용자에게 오류 메시지를 표시할 수 있습니다.
  }

  return (
    <div>
      <div className="reserving-container">
        <h2 className="title-reserving">예약하기 ({row}{col})</h2>
        <ReservationForm row={row} col={col} reservations={result}/>
      </div>
    </div>
  );
}