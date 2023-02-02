import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("classes");
  const cls = await coll.findOne({ code: req.body });

  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }

  for (let postid of cls.posts) {
    await fetch(process.env.NEXTAUTH_URL + "/api/posts/delete", {
      method: "POST",
      body: JSON.stringify({ postid, classid: req.body, session }),
    });
  }

  await coll.deleteOne({ code: req.body });
  res.json({ massage: "DONE" });
}
