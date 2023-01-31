import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const coll = await db.collection("classes");
  const session = await getSession({ req });
  const classid = JSON.parse(req.body).classid;
  const massage = JSON.parse(req.body).massage;

  const dclass = await coll.findOne({ code: classid });

  await coll.replaceOne(
    { code: classid },
    {
      ...dclass,
      massages: [
        ...dclass.massages,
        { from: session.user.name, content: massage },
      ],
    }
  );
  res.json({ massage: "DONE" });
}
