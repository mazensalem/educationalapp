import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const examid = req.body;
  const db = await connection.db();
  const coll = await db.collection("exams");

  const exam = await coll.findOne({ _id: ObjectId(examid) });
  res.json(exam);
}
