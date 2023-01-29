import React, { useState } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";

export default function addquestions() {
  const [passage, setpassage] = useState("");
  const [questions, setquestions] = useState([
    {
      title: "",
      answers: [{ text: "", istrue: false }],
      points: 0,
      tags: ["", "", "", "", "y"],
    },
  ]);
  const { data } = useSession();
  if (!data) {
    return <>loading</>;
  }
  if (!data.user.admin) {
    Router.push("/");
  }

  return (
    <div>
      <textarea value={passage} onChange={(e) => setpassage(e.target.value)} />
      {/* questions */}
      <div>
        {questions.map((question, i) => (
          <>
            <button
              onClick={() => {
                setquestions([
                  ...questions.slice(0, i).concat(questions.slice(i + 1)),
                ]);
              }}
            >
              delete
            </button>
            <br />
            title:{" "}
            <input
              value={question.title}
              onChange={(e) => {
                let nquestions = questions;
                nquestions[i] = { ...nquestions[i], title: e.target.value };
                setquestions([...nquestions]);
              }}
            />
            <br />
            points:{" "}
            <input
              type="number"
              value={question.points}
              onChange={(e) => {
                let nquestions = questions;
                nquestions[i] = { ...nquestions[i], points: e.target.value };
                setquestions([...nquestions]);
              }}
            />
            <br />
            answers
            <div>
              {questions[i].answers.slice(0, length - 1).map((answers, j) => (
                <>
                  <input
                    value={questions[i].answers[j].text}
                    onChange={(e) => {
                      let nquestions = questions;
                      nquestions[i].answers[j].text = e.target.value;
                      return setquestions([...nquestions]);
                    }}
                    onBlur={(e) => {
                      if (!e.target.value) {
                        let nquestions = questions;
                        nquestions[i].answers = nquestions[i].answers
                          .slice(0, j)
                          .concat(nquestions[i].answers.slice(j + 1));
                        return setquestions([...nquestions]);
                      }
                    }}
                  />
                  <input
                    type="checkbox"
                    checked={questions[i].answers[j].istrue}
                    onChange={(e) => {
                      let nquestions = questions;
                      nquestions[i].answers[j].istrue = e.target.checked;
                      return setquestions([...nquestions]);
                    }}
                  />
                </>
              ))}
              <br />
              <input
                value={
                  questions[i].answers[questions[i].answers.length - 1].text
                }
                onChange={(e) => {
                  let nquestions = questions;
                  nquestions[i].answers[nquestions[i].answers.length - 1].text =
                    e.target.value;
                  return setquestions([...nquestions]);
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    let nquestions = questions;
                    nquestions[i].answers.push({ text: "", istrue: false });
                    return setquestions([...nquestions]);
                  }
                }}
              />
              <input
                type="checkbox"
                checked={
                  questions[i].answers[questions[i].answers.length - 1].istrue
                }
                onChange={(e) => {
                  let nquestions = questions;
                  nquestions[i].answers[
                    nquestions[i].answers.length - 1
                  ].istrue = e.target.checked;
                  return setquestions([...nquestions]);
                }}
              />
            </div>
          </>
        ))}
        <button
          onClick={() => {
            setquestions([
              ...questions,
              {
                title: "",
                answers: [{ text: "", istrue: false }],
                points: 0,
                tags: ["", "", "", "", "y"],
              },
            ]);
          }}
        >
          Add question
        </button>
      </div>
      <button
        onClick={async () => {
          await fetch("/api/questions/creatp", {
            method: "POST",
            body: JSON.stringify({
              passage,
              questions: questions.map((e) => {
                return {
                  ...e,
                  answers: e.answers.slice(0, e.answers.length - 1),
                };
              }),
            }),
          });
        }}
      >
        send
      </button>
    </div>
  );
}
