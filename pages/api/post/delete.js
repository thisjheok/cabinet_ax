import { connectDB } from "@/util/database";
import { ObjectId } from "mongodb";
export default async function handler(요청,응답){
    if(요청.method == 'DELETE'){
        const db = (await connectDB).db('ax_cabinet')
        let result = await db.collection('reservation').deleteOne({_id: new ObjectId(요청.body)})
        응답.status(200).json('삭제완료')
    }
}