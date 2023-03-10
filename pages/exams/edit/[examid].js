import React, { useState } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "react-bootstrap";

export default function Create({ exam }) {
  const [startdate, setstartdate] = useState(exam.startdate);
  const [enddate, setenddate] = useState(exam.enddate);
  const [duration, setduration] = useState(exam.duration);
  const [questions, setquestions] = useState(exam.questions);
  const [searchtitle, setsearchtitle] = useState("");
  const [searchpoints, setsearchpoints] = useState(0);
  const [searchtags, setsearchtags] = useState(["", "", "", "", "", ""]);
  const [searchresults, setsearchresults] = useState([]);
  const [totalpoints, settotalpoints] = useState(exam.totalpoints);
  const { data } = useSession();
  const [loading, setloading] = useState(false);
  if (!data) {
    return <>loading</>;
  }
  if (!data.user.admin) {
    Router.push("/");
  }
  return (
    <div>
      start:{" "}
      <input
        type="date"
        value={startdate}
        onChange={(e) => setstartdate(e.target.value)}
      />
      end:{" "}
      <input
        type="date"
        value={enddate}
        onChange={(e) => setenddate(e.target.value)}
      />
      duration:{" "}
      <input
        type="number"
        value={duration}
        onChange={(e) => setduration(e.target.value)}
      />{" "}
      min
      {/* Questions */}
      <div>
        {/* search */}
        <div>
          {/* search */}
          <div>
            <input
              type="text"
              placeholder="search title"
              value={searchtitle}
              onChange={(e) => setsearchtitle(e.target.value)}
            />
            <input
              type="number"
              placeholder="search points"
              value={searchpoints}
              onChange={(e) => setsearchpoints(e.target.value)}
            />
            <input
              type="text"
              placeholder="search grade"
              value={searchtags[0]}
              onChange={(e) => {
                let ntags = searchtags;
                ntags[0] = e.target.value;
                return setsearchtags([...ntags]);
              }}
            />
            <input
              type="text"
              placeholder="search semester"
              value={searchtags[1]}
              onChange={(e) => {
                let ntags = searchtags;
                ntags[1] = e.target.value;
                return setsearchtags([...ntags]);
              }}
            />
            <input
              type="text"
              placeholder="search lesson"
              value={searchtags[2]}
              onChange={(e) => {
                let ntags = searchtags;
                ntags[2] = e.target.value;
                return setsearchtags([...ntags]);
              }}
            />
            <input
              type="text"
              placeholder="search major"
              value={searchtags[3]}
              onChange={(e) => {
                let ntags = searchtags;
                ntags[3] = e.target.value;
                return setsearchtags([...ntags]);
              }}
            />
            <input
              type="text"
              placeholder="search diffeculty"
              value={searchtags[4]}
              onChange={(e) => {
                let ntags = searchtags;
                ntags[4] = e.target.value;
                return setsearchtags([...ntags]);
              }}
            />
            get passage:
            <input
              type="checkbox"
              checked={searchtags[5]}
              onChange={(e) => {
                let ntags = searchtags;
                ntags[5] = e.target.checked;
                return setsearchtags([...ntags]);
              }}
            />
            {loading ? (
              <Spinner variant="border" />
            ) : (
              <Button
                variant="outline-success"
                onClick={async () => {
                  setloading(true);
                  const rresults = await fetch("/api/questions/search", {
                    method: "POST",
                    body: JSON.stringify({
                      title: searchtitle,
                      points: searchpoints,
                      tags: searchtags,
                    }),
                  });
                  const results = await rresults.json();
                  setsearchresults(results);
                  setloading(false);
                }}
              >
                search
              </Button>
            )}
          </div>
          {/* results */}
          <div>
            <Button
              variant="outline-success"
              onClick={() => {
                let r = [];
                let k = 0;
                for (let j of searchresults) {
                  if (!questions.map((e) => e._id).includes(j._id)) {
                    r.push(j);
                    if (j.passage) {
                      let t = 0;
                      for (let p of j.questions) {
                        t += p.points;
                      }
                      k += parseInt(t);
                    } else {
                      k += parseInt(j.points);
                    }
                  }
                }
                settotalpoints(totalpoints + k);
                setquestions([...questions, ...r]);
              }}
            >
              Add All
            </Button>
            {searchresults.map((e, i) =>
              e.passage ? (
                <>
                  <Button
                    key={i}
                    variant="outline-success"
                    onClick={() => {
                      if (!questions.map((a) => a._id).includes(e._id)) {
                        setquestions([...questions, e]);
                        let t = 0;
                        for (let p of e.questions) {
                          t += p.points;
                        }
                        settotalpoints(totalpoints + parseInt(t));
                      }
                    }}
                  >
                    Add
                  </Button>
                  <div>{e.data}</div>
                  <br />
                  {e.questions.map((question, i) => (
                    <div key={i}>
                      {question.title}
                      <br />
                      marks: {question.points}
                      <br />
                      {question.answers.map((e, i) => (
                        <span
                          key={i}
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
                  <div>
                    <Button
                      variant="outline-success"
                      onClick={() => {
                        if (!questions.map((e) => e._id).includes(e._id)) {
                          setquestions([...questions, e]);
                          settotalpoints(totalpoints + parseInt(e.points));
                        }
                      }}
                    >
                      Add
                    </Button>
                    <br />
                    {e.title}
                    <br />
                    marks: {e.points}
                    <br />
                    {e.answers.map((e, i) => (
                      <span
                        key={i}
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
                    <br />
                    {e.tags.map(
                      (e, i) => e != "none" && <div key={i}>{e} </div>
                    )}
                  </div>
                </>
              )
            )}
          </div>
        </div>
        <br />
        <br />
        {/* approved */}
        <div>
          total : {totalpoints} <br />
          <Button
            variant="outline-danger"
            onClick={() => {
              setquestions([]);
              settotalpoints(0);
            }}
          >
            clear
          </Button>
          <br />
          {questions.map((question, i) => {
            if (question.passage) {
              return (
                <>
                  <Button
                    key={i}
                    variant="outline-danger"
                    onClick={() => {
                      setquestions(questions.filter((e) => e != question));
                      let t = 0;
                      for (let p of question.questions) {
                        t += p.points;
                      }
                      settotalpoints(totalpoints - parseInt(t));
                    }}
                  >
                    delete
                  </Button>
                  {question.data}
                  {question.questions.length}
                  <br />
                </>
              );
            } else {
              return (
                <div key={i}>
                  <Button
                    variant="outline-danger"
                    onClick={() => {
                      setquestions(questions.filter((e) => e != question));
                      settotalpoints(totalpoints - parseInt(question.points));
                    }}
                  >
                    delete
                  </Button>
                  {question.title} {question.points}
                  <br />
                </div>
              );
            }
          })}
        </div>
      </div>
      {loading ? (
        <Spinner variant="border" />
      ) : (
        <Button
          variant="outline-success"
          onClick={async () => {
            setloading(true);
            await fetch("/api/exams/edit", {
              method: "POST",
              body: JSON.stringify({
                id: exam._id,
                questions,
                duration,
                startdate,
                enddate,
                totalpoints,
              }),
            });
            setloading(false);
            let currentLocation = window.location.href;
            window.location.href = currentLocation;
          }}
        >
          send
        </Button>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  if (!context.params.examid) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  const exam = await fetch(process.env.NEXTAUTH_URL + "/api/exams/get", {
    method: "POST",
    body: context.params.examid,
  });
  return {
    props: {
      exam: await exam.json(),
    },
  };
}
