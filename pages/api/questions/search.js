import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";

export default async function handler(req, res) {
  const connection = await conn;
  const title = JSON.parse(req.body).title;
  const points = JSON.parse(req.body).points;
  const tags = JSON.parse(req.body).tags;
  const session = await getSession({ req });
  const db = await connection.db();
  const coll = await db.collection("questions");
  if (!session.user.admin) {
    res.json({ message: "You do not have permission" });
    return;
  }
  let d = [];
  // tags[5] == checkbox in the client page
  if (tags[5]) {
    const da = await coll.find({ passage: true }).toArray();
    for (let i = 0; i < da.length; i++) {
      let record = da[i];
      for (let j = 0; j < record.questions.length; j++) {
        let question = record.questions[j];
        const rdata = await fetch(
          process.env.NEXTAUTH_URL + "/api/questions/get",
          {
            method: "POST",
            body: JSON.stringify(question),
          }
        );
        da[i].questions[j] = await rdata.json();
      }
    }
    d = da;
  } else {
    if (title) {
      if (points) {
        d = await coll.find({ points, $text: { $search: title } }).toArray();
      } else {
        d = await coll.find({ $text: { $search: title } }).toArray();
      }
    } else {
      if (points) {
        d = await coll.find({ points }).toArray();
      } else {
        d = await coll.find().toArray();
      }
    }
    for (let i = 0; i < tags.length - 1; i++) {
      let tag = tags[i];
      for (let record of d) {
        if (tag) {
          if (record.tags[i] !== tag) {
            d.pop(d.indexOf(record));
          }
        }
        if (record.passage) {
          d.pop(d.indexOf(record));
          continue;
        }
        if (record.tags[5] !== "none") {
          d.pop(d.indexOf(record));
        }
      }
    }
  }
  await res.json(d);
}
