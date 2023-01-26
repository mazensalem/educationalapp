import { getSession } from "next-auth/react";
import conn from "../../../lib/mongodbconn";

export default async function handler(req, res) {
  const session = await getSession({ req });
  const connection = await conn;
  const db = await connection.db();
  const ccoll = await db.collection("classes");
  const rclass = await ccoll.findOne({ code: req.body });
  if (!rclass) {
    await res.json({ message: "THIS CODE IS NOT VALID" });
    return;
  }
  if (session.user.classcode.includes(req.body)) {
    await res.json({ message: "YOU HAVE ENTERED THIS CODE BEFORE" });
    return;
  }
  await ccoll.replaceOne(
    { code: req.body },
    { ...rclass, inrev: [...rclass.inrev, session.user.id] }
  );

  await res.json({ massage: "DONE" });
}
