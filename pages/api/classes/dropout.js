import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("classes");

  const sclass = await coll.findOne({ code: req.body });
  await coll.replaceOne(
    { code: req.body },
    {
      ...sclass,
      inrev: sclass.inrev.filter((e) => e != session.user.id),
      accepted: sclass.accepted.filter((e) => e != session.user.id),
      dienyed: sclass.dienyed.filter((e) => e != session.user.id),
    }
  );
  res.json({ massage: "DONE" });
}
