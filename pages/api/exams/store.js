import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const ucoll = await db.collection("users");
  const qnumber = JSON.parse(req.body).qnumber;
  const storedans = JSON.parse(req.body).storedans;
  let session = await getSession({ req });

  let questions = session.user.currentexam.questions;
  if (!questions[qnumber].passage) {
    questions[qnumber] = { ...questions[qnumber], mychoise: storedans[0] };
  } else {
    questions[qnumber] = {
      ...questions[qnumber],
      questions: questions[qnumber].questions.map((question, i) => {
        return { ...question, mychoise: storedans[i] };
      }),
    };
  }

  await ucoll.replaceOne(
    { email: session.user.email },
    {
      ...session.user,
      currentexam: {
        ...session.user.currentexam,
        questions: questions,
      },
    }
  );

  await res.json({ massage: "DONE" });
}
