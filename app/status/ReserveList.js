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

    
  
    return (
      <div>
        <div className="title-box">
          <h2 className="title-status">사물함 목록</h2>
          <h4 className="sub-title-status">예약할 사물함 번호를 눌러 예약해주세요!</h4>
        </div>
        <div className="locker-grid">
          {rows.flatMap((row, rowIndex) =>
            Array(5).fill(null).map((_, colIndex) => {
              return (
                <div 
                  key={`${row}${colIndex + 1}`} 
                  className={`locker-cell non-reserved`}
                >
                    <Link href={`/reserving/${row}${colIndex + 1}`} className="linkto">
                      {row}{colIndex + 1}
                    </Link>
                </div>
              );
            })
          )}
        </div>
      </div>
    );
}
