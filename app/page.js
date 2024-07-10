import Link from "next/link";
export default function Home() {
  return (
    <div className="maincontainer">
        <h2 className="title">알파카이 사물함 예약</h2>
        <p className="sub-title">by jaehyeok</p>
        <Link href='status' className="startBtn"><div>시작하기</div></Link>
    </div>
  );
}
