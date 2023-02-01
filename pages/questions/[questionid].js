import React, { useState } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "react-bootstrap";

export default function editquestions({ question }) {
  const [questionstitle, setquestiontitle] = useState(question.title);
  const [questionschos, setquestionchos] = useState([
    ...question.answers,
    { text: "", istrue: false },
  ]);
  const [questionpoints, setquestionpoints] = useState(question.points);
  const [questiontags, setquestiontags] = useState(
    question.tags.slice(0, question.tags.length - 1)
  );
  const [loading, setloading] = useState(false);
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
              className="form-check-input"
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
          className="form-check-input"
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
      {loading ? (
        <Spinner variant="border" />
      ) : (
        <Button
          variant="outline-success"
          onClick={async () => {
            setloading(true);
            await fetch("/api/questions/edit", {
              method: "POST",
              body: JSON.stringify({
                id: question._id,
                title: questionstitle,
                points: questionpoints,
                answers: questionschos.slice(0, questionschos.length - 1),
                tags: [...questiontags, "none"],
              }),
            });
            setloading(false);
            let currentLocation = window.location.href;
            window.location.href = currentLocation;
          }}
        >
          edit
        </Button>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const d = await fetch("http://localhost:3000/api/questions/get", {
    method: "POST",
    body: JSON.stringify(context.params.questionid),
  });
  const q = await d.json();
  if (q.tags[5] != "none") {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {
      question: q,
    },
  };
}
