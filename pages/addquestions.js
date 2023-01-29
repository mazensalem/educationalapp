import React, { useState } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";

export default function addquestions() {
  const [questionstitle, setquestiontitle] = useState("");
  const [questionschos, setquestionchos] = useState([
    { text: "", istrue: false },
  ]);
  const [questionpoints, setquestionpoints] = useState(0);
  const [questiontags, setquestiontags] = useState(["", "", "", "", ""]);
  const { data } = useSession();
  if (!data) {
    return <>loading</>;
  }
  if (!data.user.admin) {
    Router.push("/");
  }

  return (
    <div>
      title:{" "}
      <input
        value={questionstitle}
        onChange={(e) => setquestiontitle(e.target.value)}
      />
      <br />
      points:{" "}
      <input
        type="number"
        value={questionpoints}
        onChange={(e) => setquestionpoints(e.target.value)}
      />
      <br />
      answers
      <div>
        {questionschos.slice(0, length - 1).map((chos, i) => (
          <>
            <input
              value={chos.text}
              onChange={(e) => {
                let nquestionchos = questionschos;
                nquestionchos[i].text = e.target.value;
                return setquestionchos([...nquestionchos]);
              }}
              onBlur={(e) => {
                if (!e.target.value) {
                  setquestionchos(
                    questionschos.slice(0, i).concat(questionschos.slice(i + 1))
                  );
                }
              }}
            />
            <input
              type="checkbox"
              checked={chos.istrue}
              onChange={(e) => {
                let nquestionchos = questionschos;
                nquestionchos[i].istrue = e.target.checked;
                return setquestionchos([...nquestionchos]);
              }}
            />
          </>
        ))}
        <br />
        <input
          value={questionschos[questionschos.length - 1].text}
          onChange={(e) => {
            let nquestionchos = questionschos;
            nquestionchos[questionschos.length - 1].text = e.target.value;
            return setquestionchos([...nquestionchos]);
          }}
          onBlur={(e) => {
            if (e.target.value) {
              setquestionchos([...questionschos, { text: "", istrue: false }]);
            }
          }}
        />
        <input
          type="checkbox"
          checked={questionschos[questionschos.length - 1].istrue}
          onChange={(e) => {
            let nquestionchos = questionschos;
            nquestionchos[questionschos.length - 1].istrue = e.target.checked;
            return setquestionchos([...nquestionchos]);
          }}
        />
      </div>
      <br />
      <div>
        tags:
        {questiontags.map((tag, i) => (
          <>
            <input
              value={tag}
              placeholder={
                i == 0
                  ? "grade"
                  : i == 1
                  ? "semester"
                  : i == 2
                  ? "lesson"
                  : i == 3
                  ? "major"
                  : "difficulty"
              }
              onChange={(e) => {
                let nquestiontags = questiontags;
                nquestiontags[i] = e.target.value;
                return setquestiontags([...nquestiontags]);
              }}
            />
          </>
        ))}
      </div>
      <button
        onClick={async () => {
          await fetch("/api/questions/create", {
            method: "POST",
            body: JSON.stringify({
              title: questionstitle,
              points: questionpoints,
              answers: questionschos.splice(0, questionschos.length - 1),
              tags: [...questiontags, "none"],
            }),
          });
        }}
      >
        send
      </button>
    </div>
  );
}
