import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const db = connection.db();
  const coll = db.collection("classes");
  const session = await getSession({ req });
  const classid = JSON.parse(req.body).classid;
  const classname = JSON.parse(req.body).classname;

  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }
  const cls = await coll.findOne({ code: classid });
  await coll.replaceOne(
    { code: classid },
    {
      ...cls,
      name: classname,
    }
  );
  res.json({ massage: "DONE" });
}
