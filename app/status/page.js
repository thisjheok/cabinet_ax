import { connectDB } from "@/util/database";
import ReserveList from "./ReserveList";
export default async function Status() {
  const client = await connectDB;
  const db = client.db("ax_cabinet");
  let result = await db.collection('reservation').find().toArray();

  return(
    <ReserveList result={result}/>
  )
}