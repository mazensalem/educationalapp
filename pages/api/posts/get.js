import conn from "../../../lib/mongodbconn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const coll = await db.collection("posts");
  const post = await coll.findOne({ _id: ObjectId(req.body) });
  res.json(post);
}
