import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  let session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("exams");
  const id = req.body;

  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }

  await coll.deleteOne({ _id: new ObjectId(id) });
  res.json({ massage: "DONE" });
}
