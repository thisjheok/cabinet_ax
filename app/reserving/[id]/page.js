import { connectDB } from "@/util/database.js"

export default async function Reserving(props) {
  const db = (await connectDB).db('ax_cabinet')
  const [row, col] = props.params.id.split('');
  
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
      <form action="/api/post/new" method="POST">
        <input type="hidden" name="locationRow" value={row} />
        <input type="hidden" name="locationCol" value={col} />
        <input type="text" name="name" placeholder="이름"/>
        <input type="text" name="studentId" placeholder="학번"/>
        <div className="date-inputs">
          <label>
            사용 시작일:
            <input type="date" name="startDate" />
          </label>
          <label>
            사용 종료일:
            <input type="date" name="endDate" />
          </label>
        </div>
        <button type="submit">예약</button>
      </form>
    </div>
  );
}