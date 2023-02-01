import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "react-bootstrap";

let firstrender = true;

export default function Exam({ exam }) {
  const session = useSession();
  const [timer, settimer] = useState(0);
  const [qnumber, setqnumber] = useState(0);
  const [storedans, setstoredans] = useState([]);
  const [loading, setloading] = useState(false);

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
        {loading ? (
          <Spinner variant="outline-danger" />
        ) : (
          <Button
            variant="outline-success"
            onClick={async () => {
              setloading(true);
              await fetch("/api/exams/start", {
                method: "POST",
                body: JSON.stringify({
                  examid: exam._id,
                  starttime: new Date().getTime(),
                }),
              });
              setloading(false);
              let currentLocation = window.location.href;
              window.location.href = currentLocation;
            }}
          >
            Start
          </Button>
        )}
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
            <br />
            <div>
              {session.data.user.currentexam.questions[qnumber].questions.map(
                (question, i) => (
                  <>
                    {" "}
                    {question.title} <br />
                    {question.answers.map((ans) => (
                      <>
                        {storedans[i] == ans ? (
                          <>
                            you choise this
                            <br />
                          </>
                        ) : (
                          <>
                            <Button
                              variant="outline-secondary"
                              onClick={() => {
                                let nstoredans = storedans;
                                nstoredans[i] = ans;
                                setstoredans([...nstoredans]);
                              }}
                            >
                              choise
                            </Button>
                          </>
                        )}
                        {ans}
                        <br />
                      </>
                    ))}
                    <br />
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
                    <>
                      you choise this
                      <br />
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outline-secondary"
                        onClick={() => {
                          setstoredans([ans]);
                        }}
                      >
                        choise
                      </Button>
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
          <>
            {loading ? (
              <Spinner variant="border" />
            ) : (
              <Button
                variant="outline-success"
                onClick={async () => {
                  setloading(true);
                  await fetch("/api/exams/store", {
                    method: "POST",
                    body: JSON.stringify({ qnumber, storedans }),
                  });
                  setqnumber(qnumber - 1);
                  if (
                    session.data.user.currentexam.questions[qnumber].passage
                  ) {
                    for (
                      let i = 0;
                      i <
                      session.data.user.currentexam.questions[qnumber].questions
                        .length;
                      i++
                    ) {
                      session.data.user.currentexam.questions[
                        qnumber
                      ].questions[i].mychoise = storedans[i];
                    }
                  } else {
                    session.data.user.currentexam.questions[qnumber].mychoise =
                      storedans[0];
                  }
                  getthechoise(-1);
                  setloading(false);
                }}
              >
                back
              </Button>
            )}
          </>
        )}
        {qnumber + 1} / {session.data.user.currentexam.questions.length}
        {qnumber != session.data.user.currentexam.questions.length - 1 ? (
          <>
            {loading ? (
              <Spinner variant="border" />
            ) : (
              <Button
                variant="outline-success"
                onClick={async () => {
                  setloading(true);
                  await fetch("/api/exams/store", {
                    method: "POST",
                    body: JSON.stringify({ qnumber, storedans }),
                  });
                  setqnumber(qnumber + 1);
                  if (
                    session.data.user.currentexam.questions[qnumber].passage
                  ) {
                    for (
                      let i = 0;
                      i <
                      session.data.user.currentexam.questions[qnumber].questions
                        .length;
                      i++
                    ) {
                      session.data.user.currentexam.questions[
                        qnumber
                      ].questions[i].mychoise = storedans[i];
                    }
                  } else {
                    session.data.user.currentexam.questions[qnumber].mychoise =
                      storedans[0];
                  }
                  getthechoise(1);
                  setloading(false);
                }}
              >
                next
              </Button>
            )}
          </>
        ) : (
          <>
            {loading ? (
              <Spinner variant="border" />
            ) : (
              <Button
                variant="outline-success"
                onClick={async () => {
                  setloading(true);
                  await fetch("/api/exams/store", {
                    method: "POST",
                    body: JSON.stringify({ qnumber, storedans }),
                  });
                  await fetch("/api/exams/finish");
                  setloading(false);
                  window.location.href = "/profile";
                }}
              >
                submit
              </Button>
            )}
          </>
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
