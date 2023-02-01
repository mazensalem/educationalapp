import React from "react";
import { useSession } from "next-auth/react";

export default function Examrev({ examid }) {
  const { data } = useSession();
  if (!data) {
    return <>loading</>;
  }
  const exam = data.user.exams.filter((exam) => exam.examid == examid)[0];
  return (
    <div>
      you got: {exam.mypoints}
      <br />
      {exam.questions.map((question) => (
        <>
          {question.passage ? (
            <>
              {question.data}
              <br />
              {question.questions.map((nquestion) => (
                <div>
                  {nquestion.title}
                  <br />
                  marks: {nquestion.points}
                  <br />
                  {nquestion.answers.map((e) => (
                    <span
                      style={
                        e.istrue
                          ? { background: "green" }
                          : { background: "red" }
                      }
                    >
                      {e.text}
                      <br />
                    </span>
                  ))}
                </div>
              ))}
            </>
          ) : (
            <>
              {question.title}
              <br />
              {question.points}
              <br />
              {question.answers.map((answer) => (
                <div
                  style={{ backgroundColor: answer.istrue ? "green" : "red" }}
                >
                  {answer.text}
                </div>
              ))}
              <br />
              you choised this: {question.mychoise}
              <br />
              <br />
            </>
          )}
        </>
      ))}
    </div>
  );
}

export async function getServerSideProps(context) {
  return {
    props: {
      examid: context.params.examid,
    },
  };
}
