import React, { useState } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";

export default function createclass() {
  const [name, setname] = useState("");
  const { data } = useSession();
  if (!data) {
    return <>loading</>;
  } else {
    if (!data.user.admin) {
      Router.push("/");
    }
  }
  return (
    <div>
      <input value={name} onChange={(e) => setname(e.target.value)} />
      <button
        onClick={async () => {
          await fetch("/api/classes/create", { method: "POST", body: name });
        }}
      >
        send
      </button>
    </div>
  );
}
