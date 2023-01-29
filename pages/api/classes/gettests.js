import conn from "../../../lib/mongodbconn";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const coll = await db.collection("exams");
  const exams = await coll.find({ classid: req.body }).toArray();
  console.log(exams);
  res.json(exams);
}
