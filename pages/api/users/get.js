import conn from "../../../lib/mongodbconn";

export default async function handler(req, res) {
  const userid = req.body;
  const connection = await conn;
  const db = await connection.db();
  const ucoll = await db.collection("users");
  const user = await ucoll.findOne({ id: userid });
  await res.json(user);
}
