import { connectDB } from "@/util/database";

export default async function handler(요청, 응답) {
  if (요청.method == 'POST') {
    const { studentId, name, startDate, endDate, locationRow, locationCol } = 요청.body;

    if (!studentId || !name || !startDate || !endDate || !locationRow || !locationCol) {
      return 응답.status(400).json({ error: 'Missing required fields' });
    }

    let client;
    try {
      client = await connectDB;
      const db = client.db('ax_cabinet');
      const reservationCollection = db.collection('reservation');

      // 데이터베이스에서 같은 학번으로 된 예약이 있는지 확인
      const existingReservation = await reservationCollection.findOne({ studentId });

      if (existingReservation) {
        return 응답.status(400).json({
          error: 'Duplicate reservation',
          location: `${existingReservation.locationRow}${existingReservation.locationCol}`,
          startDate: existingReservation.startDate,
          endDate: existingReservation.endDate
        });
      }

      // 새 예약 생성
      await reservationCollection.insertOne(요청.body);

      응답.status(200).json({ message: 'Reservation created successfully' });
    } catch (error) {
      console.error('Reservation creation error:', error);
      응답.status(500).json({ error: 'Internal server error' });
    } finally {
      if (client) {
        await client.close();
      }
    }
  } else {
    응답.setHeader('Allow', ['POST']);
    응답.status(405).end(`Method ${요청.method} Not Allowed`);
  }
}