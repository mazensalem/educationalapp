import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  let session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("questions");
  const questionid = req.body;

  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }

  const ques = await coll.findOne({ _id: new ObjectId(questionid) });
  if (ques.passage) {
    for (let question of ques.questions) {
      await coll.deleteOne({ _id: question });
    }
    await coll.deleteOne({ _id: new ObjectId(questionid) });
  } else {
    await coll.deleteOne({ _id: new ObjectId(questionid) });
  }

  res.json({ massage: "DONE" });
}
