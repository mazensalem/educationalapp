import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const id = JSON.parse(req.body).id;
  const questions = JSON.parse(req.body).questions;
  const duration = JSON.parse(req.body).duration;
  const startdate = JSON.parse(req.body).startdate;
  const enddate = JSON.parse(req.body).enddate;
  const totalpoints = JSON.parse(req.body).totalpoints;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("exams");

  if (!session.user.admin) {
    res.json({ message: "You do not have permission" });
    return;
  }

  const ex = await coll.findOne({ _id: new ObjectId(id) });
  await coll.replaceOne(
    { _id: new ObjectId(id) },
    {
      classid: ex.classid,
      questions,
      duration,
      startdate,
      enddate,
      totalpoints,
    }
  );

  res.json({ massage: "DONE" });
}
