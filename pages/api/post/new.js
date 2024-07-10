import { connectDB } from "@/util/database";
export default async function handler(요청,응답){
    if(요청.method == 'POST'){
        if(요청.body.name != '' && 요청.body.studentId != '' 
            && 요청.body.startDate!='' && 요청.body.endDate){
            let db = (await connectDB).db('ax_cabinet');
            let result = db.collection('reservation').insertOne(요청.body);
            응답.redirect(302, '/status')
        }
    }
}