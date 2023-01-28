import conn from "../../../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const text = JSON.parse(req.body).text;
  const img = JSON.parse(req.body).img;
  const classid = JSON.parse(req.body).classid;
  const titles = JSON.parse(req.body).titles;
  const postid = JSON.parse(req.body).postid;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("posts");
  const ccoll = await db.collection("classes");
  const dclass = await ccoll.findOne({ code: classid });
  if (!session.user.admin) {
    res.json({ message: "You do not have permission" });
    return;
  }
  let vote = [];
  for (let i of titles) {
    vote.push({ title: i, count: [] });
  }

  if (postid) {
    await coll.replaceOne(
      { _id: ObjectId(postid) },
      { image: img, text, vote }
    );
    res.json({ message: "DONE" });
    return;
  }

  const r = await coll.insertOne({ image: img, text, vote });

  await ccoll.replaceOne(
    { code: classid },
    { ...dclass, posts: [...dclass.posts, r.insertedId.toString()] }
  );

  res.json({ massage: "DONE" });
}
