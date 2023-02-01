import { useSession, getSession } from "next-auth/react";
import { useState } from "react";
import { Alert, Button, Card, ListGroup, Spinner } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPencil, faCircleXmark } from "@fortawesome/free-solid-svg-icons";

export default function profile({ classses, qustions }) {
  const { data } = useSession();
  const [code, setcode] = useState();
  const [name, setname] = useState("");
  const [editingname, seteditingname] = useState(false);
  const [alert, setalert] = useState("");
  const [alerttype, setalerttype] = useState("");
  const [isloading, setisloading] = useState(false);
  if (!data) {
    return (
      <div style={{ margin: "auto", width: "max-content", marginTop: "1rem" }}>
        <Spinner animation="border" />
      </div>
    );
  }
  return (
    <div>
      {alert && (
        <Alert
          variant={alerttype}
          style={{ width: "30rem", marginTop: "1rem" }}
          onClose={() => setalert("")}
          dismissible
        >
          {alert}
        </Alert>
      )}
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          paddingRight: "1rem",
          paddingLeft: "1rem",
        }}
      >
        {/* USER CARD */}
        <div>
          <div
            className="card mb-3"
            style={{ width: "18rem", marginTop: "1rem" }}
          >
            <div className="row g-0">
              <div className="col-md-4">
                <img
                  src={data.user.image}
                  className="img-fluid rounded-start"
                  alt="userimage"
                  referrerPolicy="no-referrer"
                  content="no-referrer"
                />
              </div>
              <div className="col-md-8">
                <div className="card-body d-flex align-items-center justify-content-between">
                  {editingname ? (
                    <div className="d-flex flex-column">
                      <input
                        style={{
                          width: "10rem",
                          border: "none",
                          borderBottom: "3px solid",
                        }}
                        autoFocus
                        value={name || data.user.name}
                        onChange={(e) => setname(e.target.value)}
                      />
                      <div
                        style={{
                          marginTop: ".3rem",
                          display: "flex",
                          justifyContent: "space-between",
                        }}
                      >
                        <button
                          style={{ padding: "6px" }}
                          type="button"
                          className="btn btn-outline-success"
                          onClick={async () => {
                            if (name) {
                              setisloading(true);
                              const rdata = await fetch(
                                "/api/users/changename",
                                {
                                  method: "POST",
                                  body: name,
                                }
                              );
                              const sdata = await rdata.json();
                              if (sdata.massage == "DONE") {
                                setalert("Done");
                                setalerttype("success");
                                setisloading(false);
                                data.user.name = name;
                              } else {
                                setalert(data.massage);
                                setalerttype("danger");
                              }
                              seteditingname(false);
                            } else {
                              setalert("you didn't change your name");
                              setalerttype("danger");
                            }
                          }}
                        >
                          {isloading ? (
                            <Spinner animation="border" />
                          ) : (
                            <>Save</>
                          )}
                        </button>
                        <button
                          style={{ padding: "6px" }}
                          type="button"
                          className="btn btn-outline-danger"
                          onClick={() => {
                            seteditingname(false);
                          }}
                        >
                          {isloading ? (
                            <Spinner animation="border" />
                          ) : (
                            <>Discard</>
                          )}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <h5 className="card-title">{data.user.name}</h5>
                      <FontAwesomeIcon
                        onClick={() => {
                          seteditingname(true);
                        }}
                        style={{ cursor: "pointer" }}
                        icon={faPencil}
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Enter Class */}
          <div>
            <Card border="dark" style={{ width: "18rem", marginTop: "1rem" }}>
              <Card.Header>Enter the code</Card.Header>
              <Card.Body
                style={{ display: "flex", justifyContent: "space-between" }}
              >
                <input
                  value={code}
                  style={{ border: "none", borderBottom: "3px solid black" }}
                  onChange={(e) => {
                    setcode(e.target.value);
                  }}
                />
                {isloading ? (
                  <Spinner variant="border" />
                ) : (
                  <Button
                    onClick={async () => {
                      setisloading(true);
                      await fetch("/api/users/addcode", {
                        method: "POST",
                        body: code,
                      });
                      setisloading(false);
                      let currentLocation = window.location.href;
                      window.location.href = currentLocation;
                    }}
                    variant="outline-success"
                  >
                    send
                  </Button>
                )}
              </Card.Body>
            </Card>
          </div>
        </div>
        {/* CLASSES CARD */}
        <div>
          <ListGroup style={{ width: "18rem", marginTop: "1rem" }}>
            {data.user.admin && (
              <ListGroup.Item>
                <a href="/createclass">Add Class</a>
              </ListGroup.Item>
            )}
            {classses.map((rclass) => (
              <>
                <ListGroup.Item
                  key={rclass.code}
                  className="d-flex justify-content-between align-items-center"
                >
                  <div className="d-flex flex-column">
                    <a
                      style={{
                        cursor: "pointer",
                        textDecoration: "none",
                        color: "black",
                      }}
                      href={"/class/" + rclass.code}
                    >
                      {rclass.name}
                    </a>
                    <span>
                      {rclass.inrev.includes(data.user.id) && (
                        <>you are in review</>
                      )}
                      {rclass.accepted.includes(data.user.id) && (
                        <>you are accepted</>
                      )}
                      {rclass.dienyed.includes(data.user.id) && (
                        <>you are dienyed</>
                      )}
                    </span>
                  </div>
                  <span style={{ opacity: "70%" }}>{rclass.code}</span>
                  {isloading ? (
                    <Spinner animation="border" />
                  ) : (
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        cursor: "pointer",
                      }}
                      onClick={async () => {
                        setisloading(true);
                        await fetch(
                          data.user.admin
                            ? "/api/classes/delete"
                            : "/api/classes/dropout",
                          {
                            method: "POST",
                            body: rclass.code,
                          }
                        );
                        setisloading(false);
                        let currentLocation = window.location.href;
                        window.location.href = currentLocation;
                      }}
                    >
                      <FontAwesomeIcon
                        style={{ padding: 0, margin: 0 }}
                        color="red"
                        icon={faCircleXmark}
                      />
                    </div>
                  )}
                </ListGroup.Item>
              </>
            ))}
          </ListGroup>
        </div>
        {/* Questions */}
        <div>
          {data.user.admin && (
            <ListGroup style={{ width: "18rem", marginTop: "1rem" }}>
              <ListGroup.Item>
                <a href="/addquestions">Add</a>
              </ListGroup.Item>
              <ListGroup.Item>
                <a href="/addquestionp">Addp</a>
              </ListGroup.Item>
              {qustions.map((question) => (
                <>
                  {question.passage ? (
                    <ListGroup.Item
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <a
                        style={{ textDecoration: "none", color: "black" }}
                        href={"/pquestions/" + question._id}
                      >
                        {question.data.slice(0, 50)}{" "}
                        {question.data.length >= 55 && (
                          <span style={{ opacity: "50%" }}>
                            {question.data.slice(50, 55)}...
                          </span>
                        )}
                      </a>
                      {isloading ? (
                        <Spinner animation="border" />
                      ) : (
                        <FontAwesomeIcon
                          style={{ padding: 0, margin: 0, cursor: "pointer" }}
                          color="red"
                          icon={faCircleXmark}
                          onClick={async () => {
                            setisloading(true);
                            await fetch("/api/questions/delete", {
                              method: "POST",
                              body: question._id,
                            });
                            setisloading(false);
                            let currentLocation = window.location.href;
                            window.location.href = currentLocation;
                          }}
                        />
                      )}
                    </ListGroup.Item>
                  ) : (
                    <ListGroup.Item
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <a
                        style={{
                          textDecoration: "none",
                          color: "black",
                        }}
                        href={"/questions/" + question._id}
                      >
                        {question.title}
                      </a>
                      {isloading ? (
                        <Spinner animation="border" />
                      ) : (
                        <FontAwesomeIcon
                          style={{ padding: 0, margin: 0, cursor: "pointer" }}
                          color="red"
                          icon={faCircleXmark}
                          onClick={async () => {
                            setisloading(true);
                            await fetch("/api/questions/delete", {
                              method: "POST",
                              body: question._id,
                            });
                            setisloading(false);
                            let currentLocation = window.location.href;
                            window.location.href = currentLocation;
                          }}
                        />
                      )}
                    </ListGroup.Item>
                  )}
                </>
              ))}
            </ListGroup>
          )}
        </div>
        {/* Exams */}
        <div>
          <ListGroup style={{ width: "18rem", marginTop: "1rem" }}>
            {data.user.exams.map((exam, i) => (
              <ListGroup.Item>
                <a
                  style={{ textDecoration: "none", color: "black" }}
                  href={"exams/review/" + exam.examid}
                >
                  {i + 1}. {exam.mypoints}
                </a>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession({ req: context.req });
  const rclasses = await fetch("http://localhost:3000/api/users/getclass", {
    body: JSON.stringify(session),
    method: "POST",
  });
  const classses = await rclasses.json();
  const rquestions = await fetch("http://localhost:3000/api/questions/getall");
  const qustions = await rquestions.json();
  return {
    props: {
      classses: classses.classes,
      qustions,
    },
  };
}
