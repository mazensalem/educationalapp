import conn from "../../../lib/mongodbconn";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const coll = await db.collection("questions");
  let questions = await coll.find({}).toArray();
  let nquestions = [];
  for (let i = 0; i < questions.length; i++) {
    if (questions[i].passage) {
      nquestions.push(questions[i]);
      continue;
    }
    if (questions[i].tags[5] === "none") {
      nquestions.push(questions[i]);
    }
  }
  res.json(nquestions);
}
