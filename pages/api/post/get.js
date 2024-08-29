import { connectDB } from "@/util/database";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const client = await connectDB;
    const db = client.db("ax_cabinet");
    let result = await db.collection('reservation').find().toArray();
    res.status(200).json(result);
  } else {
    res.status(405).end(); // Method Not Allowed
  }
}
