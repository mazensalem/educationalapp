import React from "react";
import { getSession, useSession } from "next-auth/react";

export default function Class({ inrevusers, classid, accepted, denyed }) {
  const { data } = useSession();
  if (!data) {
    return <>loading</>;
  }

  if (data.user.inrev) {
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
  if (!session.user.admin && session.user.classcode !== rid) {
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

  return {
    props: {
      inrevusers,
      accepted,
      denyed,
      classid: rid,
    },
  };
}
