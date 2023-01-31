import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";

export default function Class({
  inrevusers,
  classid,
  accepted,
  denyed,
  posts,
  cname,
  votes,
  tests,
  massages,
}) {
  const { data } = useSession();
  const [inputtext, setinputtext] = useState("");
  const [img, setimg] = useState("");
  const [titles, settitles] = useState([""]);
  const [classname, setclassname] = useState(cname);
  const [iseditingpost, setiseditingpost] = useState(false);
  const [editingpostid, seteditingpostid] = useState("");
  const [massage, setmassage] = useState("");
  if (!data) {
    return <>loading</>;
  }

  if (inrevusers.includes(data.user.id)) {
    return <>you are still in review</>;
  }

  return (
    <div>
      {data.user.admin && (
        <>
          <div>
            <h2>in review</h2>
            {inrevusers.map((e) => (
              <div>
                <span title={e.email}>{e.name}</span>
                <button
                  onClick={async () => {
                    await fetch("/api/users/changerev", {
                      method: "POST",
                      body: JSON.stringify({
                        userid: e.id,
                        content: "accept",
                        classid,
                      }),
                    });
                  }}
                >
                  accept
                </button>
                <button
                  onClick={async () => {
                    await fetch("/api/users/changerev", {
                      method: "POST",
                      body: JSON.stringify({
                        userid: e.id,
                        content: "deny",
                        classid,
                      }),
                    });
                  }}
                >
                  deny
                </button>
              </div>
            ))}
          </div>

          <div>
            <h2>accepted</h2>
            {accepted.map((e) => (
              <div>
                <span title={e.email}>{e.name}</span>
                <button
                  onClick={async () => {
                    await fetch("/api/users/changerev", {
                      method: "POST",
                      body: JSON.stringify({
                        userid: e.id,
                        content: "deny",
                        classid,
                      }),
                    });
                  }}
                >
                  deny
                </button>
              </div>
            ))}
          </div>

          <div>
            <h2>dienyed</h2>
            {denyed.map((e) => (
              <div>
                <span title={e.email}>{e.name}</span>
                <button
                  onClick={async () => {
                    await fetch("/api/users/changerev", {
                      method: "POST",
                      body: JSON.stringify({
                        userid: e.id,
                        content: "accept",
                        classid,
                      }),
                    });
                  }}
                >
                  accept
                </button>
              </div>
            ))}
          </div>

          {/* Name */}
          <div>
            <input
              value={classname}
              onChange={(e) => setclassname(e.target.value)}
            />
            <button
              onClick={async () => {
                await fetch("/api/classes/edit", {
                  method: "POST",
                  body: JSON.stringify({ classid, classname }),
                });
              }}
            >
              send
            </button>
          </div>

          <div>
            <a href={"/exams/create?classid=" + classid}>Add exam</a>
          </div>
        </>
      )}
      <span>{cname}</span>

      {/* News */}
      <div>
        {posts.map((post, i) => {
          if (post) {
            return (
              <>
                {data.user.admin && (
                  <>
                    <button
                      onClick={async () => {
                        fetch("/api/posts/delete", {
                          method: "POST",
                          body: JSON.stringify({ postid: post._id, classid }),
                        });
                      }}
                    >
                      delete
                    </button>
                    <button
                      onClick={() => {
                        setiseditingpost(true);
                        seteditingpostid(post._id);
                        setinputtext(post.text);
                        setimg(post.image);
                        let ntitles = post.vote.map((e) => e.title);
                        ntitles.push("");
                        settitles([...ntitles]);
                      }}
                    >
                      edit
                    </button>
                  </>
                )}
                {post.text} <br /> {post.image && <img src={post.image} />}{" "}
                <br />{" "}
                {post.vote.map((e) => {
                  console.log(votes["63d50f68d9f8346e66085bd1"]["sssss"][0]);
                  console.log(votes["63d50f68d9f8346e66085bd1"]["sssss"][0]);
                  return (
                    <div
                      onClick={async () => {
                        await fetch("/api/posts/changevote", {
                          method: "POST",
                          body: JSON.stringify({
                            postid: post._id,
                            vote: e.title,
                          }),
                        });
                      }}
                    >
                      {e.count.includes(data.user.id) && (
                        <>
                          <span>you choose this</span> <br />
                        </>
                      )}
                      {e.title} <span>{e.count.length}</span>
                      {data.user.admin && (
                        <div>
                          {votes[post._id][e.title] &&
                            votes[post._id][e.title].map((f) => (
                              <span>{f}</span>
                            ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </>
            );
          }
        })}
        {data.user.admin && (
          <div>
            <input
              value={inputtext}
              onChange={(e) => setinputtext(e.target.value)}
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                let reader = new FileReader();
                reader.onload = (a) => {
                  setimg(a.target.result);
                };
                if (e.target.files.length) {
                  reader.readAsDataURL(e.target.files[0]);
                }
              }}
            />
            <button
              onClick={() => {
                setimg("");
              }}
            >
              delete image
            </button>
            <div>
              {titles.slice(0, length - 1).map((title, i) => (
                <input
                  value={title}
                  onChange={(e) => {
                    let ntitles = titles;
                    ntitles[i] = e.target.value;
                    return settitles([...ntitles]);
                  }}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      let ntitles = titles
                        .slice(0, i)
                        .concat(titles.slice(i + 1));
                      settitles([...ntitles]);
                    }
                  }}
                />
              ))}
              <input
                value={titles[titles.length - 1]}
                onChange={(e) => {
                  let ntitles = titles;
                  ntitles[ntitles.length - 1] = e.target.value;
                  return settitles([...ntitles]);
                }}
                onBlur={(e) => {
                  if (e.target.value) {
                    settitles([...titles, ""]);
                  }
                }}
              />
            </div>
            {iseditingpost && (
              <>
                <button
                  onClick={async () => {
                    await fetch("/api/posts/create", {
                      method: "POST",
                      body: JSON.stringify({
                        text: inputtext,
                        img,
                        titles: titles.splice(0, titles.length - 1),
                        classid,
                        postid: editingpostid,
                        editing: true,
                      }),
                    });
                  }}
                >
                  save the edit
                </button>
                <button
                  onClick={() => {
                    setimg("");
                    settitles([""]);
                    setinputtext("");
                    seteditingpostid("");
                    setiseditingpost(false);
                  }}
                >
                  exit edit
                </button>
              </>
            )}
            <button
              onClick={async () => {
                await fetch("/api/posts/create", {
                  method: "POST",
                  body: JSON.stringify({
                    text: inputtext,
                    img,
                    titles: titles.splice(0, titles.length - 1),
                    classid,
                  }),
                });
              }}
            >
              create new
            </button>
          </div>
        )}
      </div>
      {/* Tests */}
      <div>
        {tests.map((test) => (
          <>
            you have a{" "}
            <a href={"/exams/" + test._id}> {test.duration} min test</a> between{" "}
            {test.startdate} and {test.enddate}
            {data.user.admin && (
              <>
                <button
                  onClick={async () => {
                    await fetch("/api/exams/delete", {
                      method: "POST",
                      body: test._id,
                    });
                  }}
                >
                  delete
                </button>
              </>
            )}
          </>
        ))}
      </div>
      {/* massages */}
      {data.user.admin ? (
        <div>
          {massages.map((massage) => (
            <>
              {massage.from} send {massage.content}
            </>
          ))}
        </div>
      ) : (
        <>
          <input value={massage} onChange={(e) => setmassage(e.target.value)} />
          <button
            onClick={async () => {
              await fetch("/api/chat/send", {
                method: "POST",
                body: JSON.stringify({ massage, classid }),
              });
            }}
          >
            send
          </button>
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const rid = context.params.classid;
  const rsclass = await fetch("http://localhost:3000/api/classes/get", {
    method: "POST",
    body: rid,
  });
  const sclass = await rsclass.json();
  const session = await getSession({ req: context.req });
  if (
    (!session.user.admin &&
      !sclass.sclass.inrev.includes(session.user.id) &&
      !sclass.sclass.accepted.includes(session.user.id) &&
      !sclass.sclass.dienyed.includes(session.user.id)) ||
    !sclass.sclass
  ) {
    return {
      redirect: {
        destination: "/",
      },
    };
  }
  let inrevusers = [];
  let accepted = [];
  let denyed = [];
  for (let user of sclass.sclass.inrev) {
    const rduser = await fetch("http://localhost:3000/api/users/get", {
      method: "POST",
      body: user,
    });
    const duser = await rduser.json();
    inrevusers.push(duser);
  }
  for (let user of sclass.sclass.accepted) {
    const rduser = await fetch("http://localhost:3000/api/users/get", {
      method: "POST",
      body: user,
    });
    const duser = await rduser.json();
    accepted.push(duser);
  }
  for (let user of sclass.sclass.dienyed) {
    const rduser = await fetch("http://localhost:3000/api/users/get", {
      method: "POST",
      body: user,
    });
    const duser = await rduser.json();
    denyed.push(duser);
  }

  let posts = [];
  for (let postid of sclass.sclass.posts) {
    const rpost = await fetch("http://localhost:3000/api/posts/get", {
      method: "POST",
      body: postid,
    });
    const post = await rpost.json();
    posts.push(post);
  }
  let votes = {};
  if (session.user.admin) {
    for (let post of posts) {
      votes[post._id] = {};
      for (let vote of post.vote) {
        votes[post._id][vote.title] = [];
        for (let user of vote.count) {
          const ruser = await fetch("http://localhost:3000/api/users/get", {
            method: "POST",
            body: user,
          });
          const u = await ruser.json();

          votes[post._id][vote.title].push(u.name);
        }
      }
    }
  }

  const rtests = await fetch("http://localhost:3000/api/classes/gettests", {
    method: "POST",
    body: rid,
  });
  const tests = await rtests.json();

  const rmassages = await fetch(
    "http://localhost:3000/api/classes/getmassages",
    {
      method: "POST",
      body: rid,
    }
  );
  const massages = await rmassages.json();

  return {
    props: {
      inrevusers,
      accepted,
      denyed,
      classid: rid,
      posts,
      cname: sclass.sclass.name,
      votes,
      tests,
      massages,
    },
  };
}
