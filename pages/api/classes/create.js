import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const db = connection.db();
  const coll = db.collection("classes");
  const session = await getSession({ req });
  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }
  const n = await coll.insert({
    inrev: [],
    accepted: [],
    dienyed: [],
    name: req.body,
  });
  const id = n.insertedIds[0];
  await coll.replaceOne(
    { _id: id },
    {
      inrev: [],
      accepted: [],
      dienyed: [],
      name: req.body,
      code: id.toString().slice(17, 24),
    }
  );
  res.json({ massage: "DONE" });
}
