'use client'

import { useRouter } from 'next/navigation';
export default function Home() {
  const router = useRouter();

  const handleStart = () => {
    router.push('/status');
  };

  return (
    <div className="mainContainer">
      <h2 className="title">알파카이 사물함 예약</h2>
      <button onClick={handleStart} className="startBtn">
        시작하기
      </button>
      <p className="sub-title-main">시작하기를 눌러서 예약하러 가주세요!</p>
      <div className="TableImg">
        <img src='/사물함배치도.svg' alt="사물함 배치도" />
      </div>
    </div>
  );
}