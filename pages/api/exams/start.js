import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const ucoll = await db.collection("users");
  const ecoll = await db.collection("exams");
  const examid = JSON.parse(req.body).examid;
  const ustarttime = JSON.parse(req.body).starttime;
  let session = await getSession({ req });

  const exam = await ecoll.findOne({ _id: ObjectId(examid) });
  const estarttime = new Date(exam.startdate).getTime();
  const eendtime = new Date(exam.enddate).getTime();
  const uendtime = new Date(
    parseInt(ustarttime) + parseInt(exam.duration) * 60000
  ).getTime();
  if (estarttime <= ustarttime && eendtime >= ustarttime) {
    for (let exam of session.user.exams) {
      if (exam.examid == examid) {
        await res.json({ massage: "YOU TOOK THIS EXAM BEFORE" });
        return;
      }
    }
    let questions = exam.questions.map((e) => {
      if (e.passage) {
        return {
          ...e,
          questions: e.questions.map((question) => {
            return {
              ...question,
              mychoise: "",
              answers: question.answers.map((ans) => ans.text),
            };
          }),
        };
      } else {
        return {
          ...e,
          answers: [...e.answers.map((a) => a.text)],
          mychoise: "",
        };
      }
    });

    questions.sort(() => Math.random() - 0.5);

    await ucoll.replaceOne(
      { email: session.user.email },
      {
        ...session.user,
        currentexam: {
          examid,
          starttime: ustarttime,
          endtime: uendtime,
          questions,
        },
      }
    );
  } else {
    await res.json({ massage: "THIS LINK IS DISABLED" });
    return;
  }
  await res.json({ massage: "DONE" });
}
