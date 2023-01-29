import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const passage = JSON.parse(req.body).passage;
  const questions = JSON.parse(req.body).questions;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("questions");
  if (!session.user.admin) {
    res.json({ message: "You do not have permission" });
    return;
  }
  const data = await coll.insertMany(questions);
  let dquestions = [];
  for (let i in data.insertedIds) {
    dquestions.push(data.insertedIds[i]);
  }
  await coll.insertOne({
    passage: true,
    data: passage,
    questions: dquestions,
  });
  res.json({ massage: "DONE" });
}
