import conn from "../../../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const title = JSON.parse(req.body).title;
  const points = JSON.parse(req.body).points;
  const answers = JSON.parse(req.body).answers;
  const tags = JSON.parse(req.body).tags;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("questions");
  if (!session.user.admin) {
    res.json({ message: "You do not have permission" });
    return;
  }
  if (title && points && answers.length > 1) {
    await coll.insertOne({ title, points, answers, tags });
  } else {
    res.json({ message: "You ENTERED WRONG DATA" });
    return;
  }

  res.json({ massage: "DONE" });
}
