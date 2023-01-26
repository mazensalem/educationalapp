import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("classes");

  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }

  await coll.deleteOne({ code: req.body });
  res.json({ massage: "DONE" });
}
