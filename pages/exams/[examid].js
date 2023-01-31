import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";

let firstrender = true;

export default function Exam({ exam }) {
  const session = useSession();
  const [timer, settimer] = useState(0);
  const [qnumber, setqnumber] = useState(0);
  const [storedans, setstoredans] = useState([]);

  const getthechoise = (add) => {
    if (session.data.user.currentexam.questions[qnumber + add].passage) {
      setstoredans(
        session.data.user.currentexam.questions[qnumber + add].questions.map(
          (question) => question.mychoise
        )
      );
    } else {
      setstoredans([
        session.data.user.currentexam.questions[qnumber + add].mychoise,
      ]);
    }
  };

  useEffect(() => {
    if (session.data && firstrender) {
      if (session.data.user.currentexam.examid) {
        firstrender = false;
        getthechoise(0);
        let inter = setInterval(async () => {
          if (
            session.data.user.currentexam.endtime - new Date().getTime() >
            0
          ) {
            settimer(
              session.data.user.currentexam.endtime - new Date().getTime()
            );
          } else {
            await fetch("/api/exams/finish");
            clearInterval(inter);
          }
        }, 1000);
      }
    }
  });
  if (!session.data) {
    return <>loading</>;
  }

  if (!session.data.user.currentexam.examid) {
    return (
      <div>
        <button
          onClick={async () => {
            await fetch("/api/exams/start", {
              method: "POST",
              body: JSON.stringify({
                examid: exam._id,
                starttime: new Date().getTime(),
              }),
            });
          }}
        >
          Start
        </button>
      </div>
    );
  }

  return (
    <div>
      <div>
        {new Date(timer).getHours() - new Date(0).getHours()} :{" "}
        {new Date(timer).getMinutes() - new Date(0).getMinutes()} :{" "}
        {new Date(timer).getSeconds() - new Date(0).getSeconds()}
      </div>
      <div>
        {session.data.user.currentexam.questions[qnumber].passage ? (
          <>
            <div>{session.data.user.currentexam.questions[qnumber].data}</div>
            <div>
              {session.data.user.currentexam.questions[qnumber].questions.map(
                (question, i) => (
                  <>
                    {" "}
                    {question.title} <br />
                    {question.answers.map((ans) => (
                      <>
                        {storedans[i] == ans ? (
                          <>you choise this</>
                        ) : (
                          <>
                            <button
                              onClick={() => {
                                let nstoredans = storedans;
                                nstoredans[i] = ans;
                                setstoredans([...nstoredans]);
                              }}
                            >
                              choise
                            </button>
                          </>
                        )}
                        <br />
                        {ans}
                      </>
                    ))}
                  </>
                )
              )}
            </div>
          </>
        ) : (
          <>
            {session.data.user.currentexam.questions[qnumber].title}
            <br />
            {session.data.user.currentexam.questions[qnumber].answers.map(
              (ans) => (
                <>
                  {storedans[0] == ans ? (
                    <>you choise this</>
                  ) : (
                    <>
                      <button
                        onClick={() => {
                          setstoredans([ans]);
                        }}
                      >
                        choise
                      </button>
                    </>
                  )}
                  {ans}
                  <br />
                </>
              )
            )}
          </>
        )}
        {qnumber != 0 && (
          <button
            onClick={async () => {
              await fetch("/api/exams/store", {
                method: "POST",
                body: JSON.stringify({ qnumber, storedans }),
              });
              setqnumber(qnumber - 1);
              if (session.data.user.currentexam.questions[qnumber].passage) {
                for (
                  let i = 0;
                  i <
                  session.data.user.currentexam.questions[qnumber].questions
                    .length;
                  i++
                ) {
                  session.data.user.currentexam.questions[qnumber].questions[
                    i
                  ].mychoise = storedans[i];
                }
              } else {
                session.data.user.currentexam.questions[qnumber].mychoise =
                  storedans[0];
              }
              getthechoise(-1);
            }}
          >
            back
          </button>
        )}
        {qnumber + 1} / {session.data.user.currentexam.questions.length}
        {qnumber != session.data.user.currentexam.questions.length - 1 ? (
          <button
            onClick={async () => {
              await fetch("/api/exams/store", {
                method: "POST",
                body: JSON.stringify({ qnumber, storedans }),
              });
              setqnumber(qnumber + 1);
              if (session.data.user.currentexam.questions[qnumber].passage) {
                for (
                  let i = 0;
                  i <
                  session.data.user.currentexam.questions[qnumber].questions
                    .length;
                  i++
                ) {
                  session.data.user.currentexam.questions[qnumber].questions[
                    i
                  ].mychoise = storedans[i];
                }
              } else {
                session.data.user.currentexam.questions[qnumber].mychoise =
                  storedans[0];
              }
              getthechoise(1);
            }}
          >
            next
          </button>
        ) : (
          <button
            onClick={async () => {
              await fetch("/api/exams/store", {
                method: "POST",
                body: JSON.stringify({ qnumber, storedans }),
              });
              await fetch("/api/exams/finish");
            }}
          >
            submit
          </button>
        )}
      </div>
    </div>
  );
}
export async function getServerSideProps(context) {
  const rexam = await fetch("http://localhost:3000/api/exams/get", {
    body: context.params.examid,
    method: "POST",
  });
  const exam = await rexam.json();
  return {
    props: {
      exam,
    },
  };
}
