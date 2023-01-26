import { useSession, getSession } from "next-auth/react";
import { useState } from "react";

export default function profile({ classses }) {
  const { data } = useSession();
  const [code, setcode] = useState();
  if (!data) {
    return <>loading</>;
  }

  return (
    <div>
      <div>
        {classses.map((e) => (
          <div key={e.code}>
            {e.name} ({e.code}) <br />
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
