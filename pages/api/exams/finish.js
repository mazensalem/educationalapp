import conn from "../../../lib/mongodbconn";
import { getSession } from "next-auth/react";
import { ObjectId } from "mongodb";

export default async function handler(req, res) {
  const connection = await conn;
  const db = await connection.db();
  const ucoll = await db.collection("users");
  const ecoll = await db.collection("exams");
  const qcoll = await db.collection("questions");
  let session = await getSession({ req });

  const exam = await ecoll.findOne({
    _id: new ObjectId(session.user.currentexam.examid),
  });

  let uexams = [
    ...session.user.exams,
    {
      ...session.user.currentexam,
      questions: session.user.currentexam.questions.map((e) => {
        if (!e.passage) {
          return {
            ...e,
            answers: [
              ...exam.questions.filter((a) => a._id == e._id)[0].answers,
            ],
          };
        } else {
          return {
            ...e,
            questions: [
              ...exam.questions
                .filter((a) => a._id == e._id)[0]
                .questions.map((question, i) => {
                  return { ...question, mychoise: e.questions[i].mychoise };
                }),
            ],
          };
        }
      }),
    },
  ];
  uexams[uexams.length - 1].questions.forEach(async (question) => {
    const dquestion = await qcoll.findOne({ _id: new ObjectId(question._id) });
    if (!question.passage) {
      let istrue = false;
      dquestion.answers.forEach(async (answer) => {
        if (question.mychoise == answer.text) {
          if (answer.istrue) {
            istrue = true;
            if (!dquestion.solved.includes(session.user._id)) {
              await qcoll.replaceOne(
                { _id: new ObjectId(question._id) },
                {
                  ...dquestion,
                  solved: [...dquestion.solved, session.user.id],
                  unsolved: dquestion.unsolved.filter(
                    (e) => e != session.user.id
                  ),
                }
              );
            }
          }
        }
      });
      if (!istrue && question.mychoise) {
        await qcoll.replaceOne(
          { _id: new ObjectId(question._id) },
          {
            ...dquestion,
            unsolved: [...dquestion.unsolved, session.user.id],
            solved: dquestion.solved.filter((e) => e != session.user.id),
          }
        );
      }
    }
  });
  let mypoints = 0;
  uexams[uexams.length - 1].questions.forEach((question) => {
    if (question.passage) {
      question.questions.forEach((pquestion) => {
        pquestion.answers.forEach((answ) => {
          if (answ.istrue && answ.text == pquestion.mychoise) {
            mypoints += parseInt(pquestion.points);
          }
        });
      });
    } else {
      question.answers.forEach((answ) => {
        if (answ.istrue && answ.text == question.mychoise) {
          mypoints += parseInt(question.points);
        }
      });
    }
  });

  uexams[uexams.length - 1] = {
    ...uexams[uexams.length - 1],
    mypoints,
  };

  await ucoll.replaceOne(
    { _id: ObjectId(session.user.id) },
    {
      ...session.user,
      exams: uexams,
      currentexam: {
        examid: "",
        starttime: 0,
        endtime: 0,
        questions: [],
      },
    }
  );
  await res.json({ massage: "DONE" });
}
