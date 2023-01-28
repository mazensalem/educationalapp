import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  let session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("posts");
  const ccoll = await db.collection("classes");
  const postid = JSON.parse(req.body).postid;
  const classid = JSON.parse(req.body).classid;
  const clas = await ccoll.findOne({ code: classid });

  if (JSON.parse(req.body).session) {
    session = JSON.parse(req.body).session;
  }

  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }

  await coll.deleteOne({ _id: new ObjectId(postid) });
  await ccoll.replaceOne(
    { code: classid },
    { ...clas, posts: clas.posts.filter((post) => post != postid) }
  );
  res.json({ massage: "DONE" });
}
