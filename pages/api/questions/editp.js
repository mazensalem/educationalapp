import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const passage = JSON.parse(req.body).passage;
  const questions = JSON.parse(req.body).questions;
  const id = JSON.parse(req.body).id;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("questions");
  if (!session.user.admin) {
    res.json({ message: "You do not have permission" });
    return;
  }
  let ids = [];
  for (let question of questions) {
    if (question._id) {
      // Replace the old questions
      await coll.replaceOne(
        { _id: ObjectId(question._id) },
        { ...question, _id: ObjectId(question._id) }
      );
      ids.push(question._id);
    } else {
      // Inster new questions
      const data = await coll.insertOne(question);
      ids.push(data.insertedId.toString());
    }
  }
  await coll.replaceOne(
    { _id: ObjectId(id) },
    { passage: true, data: passage, questions: ids }
  );
  res.json({ massage: "DONE" });
}
