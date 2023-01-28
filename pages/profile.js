import { useSession, getSession } from "next-auth/react";
import { useState } from "react";

export default function profile({ classses }) {
  const { data } = useSession();
  const [code, setcode] = useState();
  const [name, setname] = useState("");
  const [editingname, seteditingname] = useState(false);
  if (!data) {
    return <>loading</>;
  }

  return (
    <div>
      <div>
        <div>
          {editingname ? (
            <>
              <input
                value={name || data.user.name}
                onChange={(e) => setname(e.target.value)}
              />
              <button
                onClick={() => {
                  seteditingname(false);
                }}
              >
                discard
              </button>
              <button
                onClick={async () => {
                  if (name) {
                    await fetch("/api/users/changename", {
                      method: "POST",
                      body: name,
                    });
                    seteditingname(false);
                  } else {
                    alert("you didn't change your name");
                  }
                }}
              >
                save
              </button>
            </>
          ) : (
            <>
              {data.user.name}{" "}
              <button
                onClick={() => {
                  seteditingname(true);
                }}
              >
                edit
              </button>
            </>
          )}
        </div>
        {classses.map((e) => (
          <div key={e.code}>
            <a href={"/class/" + e.code}>
              {e.name} ({e.code})
            </a>{" "}
            <br />
            {e.inrev.includes(data.user.id) && (
              <>
                you are in review
                <br />
              </>
            )}
            {e.accepted.includes(data.user.id) && (
              <>
                you are accepted
                <br />
              </>
            )}
            {e.dienyed.includes(data.user.id) && (
              <>
                you are dienyed
                <br />{" "}
              </>
            )}
            <br />
            <button
              onClick={async () => {
                await fetch(
                  data.user.admin
                    ? "/api/classes/delete"
                    : "/api/classes/dropout",
                  {
                    method: "POST",
                    body: e.code,
                  }
                );
              }}
            >
              drop out
            </button>
          </div>
        ))}
      </div>
      <div>
        <input
          value={code}
          onChange={(e) => {
            setcode(e.target.value);
          }}
        />
        <button
          onClick={async () => {
            fetch("/api/users/addcode", {
              method: "POST",
              body: code,
            });
          }}
        >
          send
        </button>
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
  return {
    props: {
      classses: classses.classes,
    },
  };
}
