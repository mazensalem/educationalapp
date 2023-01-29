import conn from "../../../lib/mongodbconn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const id = JSON.parse(req.body);
  const connection = await conn;
  const db = await connection.db();
  const coll = await db.collection("questions");
  const question = await coll.findOne({ _id: ObjectId(id) });

  res.json(question);
}
