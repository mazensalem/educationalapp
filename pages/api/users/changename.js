import { getSession } from "next-auth/react";
import conn from "../../../lib/mongodbconn";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const connection = await conn;
  const db = await connection.db();
  const ucoll = await db.collection("users");
  await ucoll.replaceOne(
    { email: session.user.email },
    { ...session.user, name: req.body }
  );

  await res.json({ massage: "DONE" });
}
