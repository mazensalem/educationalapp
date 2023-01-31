import conn from "../../../lib/mongodbconn";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const coll = await db.collection("classes");
  const dclass = await coll.findOne({ code: req.body });
  res.json(dclass.massages);
}
