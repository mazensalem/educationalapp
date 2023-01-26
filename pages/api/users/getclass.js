import conn from "../../../lib/mongodbconn";

export default async function handler(req, res) {
  const session = JSON.parse(req.body);
  const connection = await conn;
  const db = await connection.db();
  const ccoll = await db.collection("classes");
  let classes = await ccoll.find().toArray();
  if (!session.user.admin) {
    classes = classes.filter((e) => {
      if (e.inrev.includes(session.user.id)) {
        return true;
      }
      if (e.accepted.includes(session.user.id)) {
        return true;
      }
      if (e.dienyed.includes(session.user.id)) {
        return true;
      }
      return false;
    });
  }

  await res.json({ classes });
}
