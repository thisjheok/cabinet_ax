'use client'
import Link from "next/link";
import { useEffect, useState } from "react";

export default function ReserveList() {
    const rows = ['A', 'B', 'C', 'D', 'E'];
  
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
