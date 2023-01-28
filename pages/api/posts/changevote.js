import conn from "../../../lib/mongodbconn";
import { ObjectId } from "mongodb";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const postid = JSON.parse(req.body).postid;
  const votetitle = JSON.parse(req.body).vote;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("posts");
  const post = await coll.findOne({ _id: ObjectId(postid) });
  for (let i = 0; i < post.vote.length; i++) {
    let v = post.vote[i];
    if (v.title == votetitle) {
      if (v.count.includes(session.user.id)) {
        post.vote[i].count.pop(post.vote[i].count.indexOf(session.user.id));
      } else {
        post.vote[i].count.push(session.user.id);
      }
      break;
    }
  }
  await coll.replaceOne({ _id: ObjectId(postid) }, { ...post });
  res.json({ massage: "DONE" });
}
