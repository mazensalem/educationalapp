import React, { useState } from "react";
import { getSession, useSession } from "next-auth/react";
import { Button, Spinner } from "react-bootstrap";

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
  const [loading, setloading] = useState(false);
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
          <div
            style={{
              maxWidth: "40rem",
              border: "1px solid gainsboro",
              borderRadius: "3px",
              margin: "1rem",
            }}
          >
            <nav>
              <div className="nav nav-tabs" id="nav-tab" role="tablist">
                <button
                  className="nav-link active"
                  id="nav-home-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-home"
                  type="button"
                  role="tab"
                  aria-controls="nav-home"
                  aria-selected="true"
                >
                  Inrev
                </button>
                <button
                  className="nav-link"
                  id="nav-profile-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-profile"
                  type="button"
                  role="tab"
                  aria-controls="nav-profile"
                  aria-selected="false"
                >
                  Accept
                </button>
                <button
                  className="nav-link"
                  id="nav-contact-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#nav-contact"
                  type="button"
                  role="tab"
                  aria-controls="nav-contact"
                  aria-selected="false"
                >
                  Rejection
                </button>
              </div>
            </nav>
            <div
              style={{ margin: ".5rem" }}
              className="tab-content"
              id="nav-tabContent"
            >
              <div
                className="tab-pane fade show active"
                id="nav-home"
                role="tabpanel"
                aria-labelledby="nav-home-tab"
              >
                <div>
                  <h2>in review</h2>
                  {inrevusers.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "50%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span title={e.email}>{e.name}</span>
                      {loading ? (
                        <Spinner variant="border" />
                      ) : (
                        <>
                          <Button
                            variant="outline-success"
                            onClick={async () => {
                              setloading(true);
                              await fetch("/api/users/changerev", {
                                method: "POST",
                                body: JSON.stringify({
                                  userid: e.id,
                                  content: "accept",
                                  classid,
                                }),
                              });
                              setloading(true);
                              let currentLocation = window.location.href;
                              window.location.href = currentLocation;
                            }}
                          >
                            accept
                          </Button>
                          <Button
                            variant="outline-danger"
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
                          </Button>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="nav-profile"
                role="tabpanel"
                aria-labelledby="nav-profile-tab"
              >
                <div>
                  <h2>accepted</h2>
                  {accepted.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "50%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span title={e.email}>{e.name}</span>
                      {loading ? (
                        <Spinner variant="border" />
                      ) : (
                        <Button
                          variant="outline-danger"
                          onClick={async () => {
                            setloading(true);
                            await fetch("/api/users/changerev", {
                              method: "POST",
                              body: JSON.stringify({
                                userid: e.id,
                                content: "deny",
                                classid,
                              }),
                            });
                            setloading(false);
                            let currentLocation = window.location.href;
                            window.location.href = currentLocation;
                          }}
                        >
                          deny
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              <div
                class="tab-pane fade"
                id="nav-contact"
                role="tabpanel"
                aria-labelledby="nav-contact-tab"
              >
                <div>
                  <h2>dienyed</h2>
                  {denyed.map((e, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        width: "50%",
                        justifyContent: "space-between",
                      }}
                    >
                      <span title={e.email}>{e.name}</span>
                      {loading ? (
                        <Spinner variant="border" />
                      ) : (
                        <Button
                          variant="outline-success"
                          onClick={async () => {
                            setloading(true);
                            await fetch("/api/users/changerev", {
                              method: "POST",
                              body: JSON.stringify({
                                userid: e.id,
                                content: "accept",
                                classid,
                              }),
                            });
                            setloading(false);
                            let currentLocation = window.location.href;
                            window.location.href = currentLocation;
                          }}
                        >
                          accept
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Name */}
          <div>
            <input
              value={classname}
              onChange={(e) => setclassname(e.target.value)}
            />
            {loading ? (
              <Spinner variant="border" />
            ) : (
              <Button
                variant="outline-success"
                onClick={async () => {
                  setloading(true);
                  await fetch("/api/classes/edit", {
                    method: "POST",
                    body: JSON.stringify({ classid, classname }),
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
              <div key={i}>
                {data.user.admin && (
                  <>
                    {loading ? (
                      <Spinner variant="border" />
                    ) : (
                      <Button
                        variant="outline-danger"
                        onClick={async () => {
                          setloading(true);
                          await fetch("/api/posts/delete", {
                            method: "POST",
                            body: JSON.stringify({ postid: post._id, classid }),
                          });
                          setloading(false);
                          let currentLocation = window.location.href;
                          window.location.href = currentLocation;
                        }}
                      >
                        delete
                      </Button>
                    )}

                    <Button
                      variant="outline-secondary"
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
                    </Button>
                  </>
                )}
                <div className="card" style={{ width: "18rem" }}>
                  <h5 className="card-title">{post.text}</h5>
                  {post.image && (
                    <img
                      src={post.image}
                      className="card-img-top"
                      alt="postimage"
                    />
                  )}
                  <div className="card-body">
                    <ul class="list-group list-group-flush">
                      {post.vote.map((e, i) => {
                        return (
                          <div key={i}>
                            {loading ? (
                              <Spinner variant="border" />
                            ) : (
                              <li
                                className="list-group-item"
                                style={{
                                  cursor: "pointer",
                                  backgroundColor: e.count.includes(
                                    data.user.id
                                  )
                                    ? "green"
                                    : "white",
                                }}
                                onClick={async () => {
                                  setloading(true);
                                  await fetch("/api/posts/changevote", {
                                    method: "POST",
                                    body: JSON.stringify({
                                      postid: post._id,
                                      vote: e.title,
                                    }),
                                  });
                                  setloading(false);
                                  let currentLocation = window.location.href;
                                  window.location.href = currentLocation;
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  {e.title} <span>{e.count.length}</span>
                                </div>
                                {data.user.admin && (
                                  <div>
                                    {votes[post._id][e.title] &&
                                      votes[post._id][e.title].map((f, i) => (
                                        <span key={i}>{f}</span>
                                      ))}
                                  </div>
                                )}
                              </li>
                            )}
                          </div>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            );
          }
        })}
        <br />
        {data.user.admin && (
          <div>
            ADD A POST
            <br />
            <input
              value={inputtext}
              onChange={(e) => setinputtext(e.target.value)}
            />
            <input
              type="file"
              className="form-control"
              style={{ width: "25rem" }}
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
            <Button
              variant="outline-danger"
              onClick={() => {
                setimg("");
              }}
            >
              delete image
            </Button>
            <div>
              {titles.slice(0, length - 1).map((title, i) => (
                <input
                  key={i}
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
                {loading ? (
                  <Spinner variant="border" />
                ) : (
                  <Button
                    variant="outline-success"
                    onClick={async () => {
                      setloading(true);
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
                      setloading(false);
                      let currentLocation = window.location.href;
                      window.location.href = currentLocation;
                    }}
                  >
                    save the edit
                  </Button>
                )}

                <Button
                  variant="outline-secondary"
                  onClick={() => {
                    setimg("");
                    settitles([""]);
                    setinputtext("");
                    seteditingpostid("");
                    setiseditingpost(false);
                  }}
                >
                  exit edit
                </Button>
              </>
            )}
            {loading ? (
              <Spinner variant="border" />
            ) : (
              <Button
                variant="outline-success"
                onClick={async () => {
                  setloading(true);
                  await fetch("/api/posts/create", {
                    method: "POST",
                    body: JSON.stringify({
                      text: inputtext,
                      img,
                      titles: titles.splice(0, titles.length - 1),
                      classid,
                    }),
                  });
                  setloading(false);
                  let currentLocation = window.location.href;
                  window.location.href = currentLocation;
                }}
              >
                create new
              </Button>
            )}
          </div>
        )}
      </div>
      <br />
      {/* Tests */}
      <div>
        EXAMS
        <ul class="list-group list-group" style={{ width: "25rem" }}>
          {tests.map((test, i) => (
            <li
              key={i}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignContent: "center",
              }}
              class="list-group-item"
            >
              <div style={{ width: "10rem" }}>
                <a href={"/exams/" + test._id}> {test.duration} min test</a>{" "}
                between {test.startdate} and {test.enddate}
              </div>
              {data.user.admin && (
                <>
                  {loading ? (
                    <Spinner variant="border" />
                  ) : (
                    <Button
                      variant="outline-danger"
                      onClick={async () => {
                        setloading(true);
                        await fetch("/api/exams/delete", {
                          method: "POST",
                          body: test._id,
                        });
                        setloading(false);
                        let currentLocation = window.location.href;
                        window.location.href = currentLocation;
                      }}
                    >
                      delete
                    </Button>
                  )}
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      <br />
      {/* massages */}
      MASSAGES
      {data.user.admin ? (
        <div>
          {massages.map((massage, i) => (
            <div key={i}>
              {massage.from} send {massage.content}
            </div>
          ))}
        </div>
      ) : (
        <>
          <input value={massage} onChange={(e) => setmassage(e.target.value)} />
          {loading ? (
            <Spinner variant="border" />
          ) : (
            <Button
              onClick={async () => {
                setloading(true);
                await fetch("/api/chat/send", {
                  method: "POST",
                  body: JSON.stringify({ massage, classid }),
                });
                setloading(false);
                let currentLocation = window.location.href;
                window.location.href = currentLocation;
              }}
            >
              send
            </Button>
          )}
        </>
      )}
    </div>
  );
}

export async function getServerSideProps(context) {
  const rid = context.params.classid;
  const rsclass = await fetch(process.env.NEXTAUTH_URL + "/api/classes/get", {
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
    const rduser = await fetch(process.env.NEXTAUTH_URL + "/api/users/get", {
      method: "POST",
      body: user,
    });
    const duser = await rduser.json();
    inrevusers.push(duser);
  }
  for (let user of sclass.sclass.accepted) {
    const rduser = await fetch(process.env.NEXTAUTH_URL + "/api/users/get", {
      method: "POST",
      body: user,
    });
    const duser = await rduser.json();
    accepted.push(duser);
  }
  for (let user of sclass.sclass.dienyed) {
    const rduser = await fetch(process.env.NEXTAUTH_URL + "/api/users/get", {
      method: "POST",
      body: user,
    });
    const duser = await rduser.json();
    denyed.push(duser);
  }

  let posts = [];
  for (let postid of sclass.sclass.posts) {
    const rpost = await fetch(process.env.NEXTAUTH_URL + "/api/posts/get", {
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
          const ruser = await fetch(
            process.env.NEXTAUTH_URL + "/api/users/get",
            {
              method: "POST",
              body: user,
            }
          );
          const u = await ruser.json();

          votes[post._id][vote.title].push(u.name);
        }
      }
    }
  }

  const rtests = await fetch(
    process.env.NEXTAUTH_URL + "/api/classes/gettests",
    {
      method: "POST",
      body: rid,
    }
  );
  const tests = await rtests.json();

  const rmassages = await fetch(
    process.env.NEXTAUTH_URL + "/api/classes/getmassages",
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
