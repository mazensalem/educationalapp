import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const session = await getSession({ req });
  req.body = JSON.parse(req.body);
  const classid = req.body.classid;
  const content = req.body.content;
  const userid = req.body.userid;
  if (!session.user.admin) {
    res.json({ massage: "YOU ARE NOT ALLOWED" });
    return;
  }
  const connection = await conn;
  const db = await connection.db();
  const ccoll = await db.collection("classes");
  if (content == "accept") {
    const clas = await ccoll.findOne({ code: classid });
    await ccoll.replaceOne(
      { code: classid },
      {
        ...clas,
        inrev: clas.inrev.filter((e) => {
          e != userid;
        }),
        dienyed: clas.dienyed.filter((e) => {
          e != userid;
        }),
        accepted: [...clas.accepted, userid],
      }
    );
  } else {
    const clas = await ccoll.findOne({ code: classid });
    await ccoll.replaceOne(
      { code: classid },
      {
        ...clas,
        inrev: clas.inrev.filter((e) => {
          e != userid;
        }),
        accepted: clas.accepted.filter((e) => {
          e != userid;
        }),
        dienyed: [...clas.dienyed, userid],
      }
    );
  }
  res.json({ massage: "DONE" });
}
