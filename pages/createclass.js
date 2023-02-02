import React, { useState } from "react";
import Router from "next/router";
import { useSession } from "next-auth/react";
import { Button, Spinner } from "react-bootstrap";

export default function Createclass() {
  const [name, setname] = useState("");
  const { data } = useSession();
  const [isloading, setisloading] = useState(false);
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
      {isloading ? (
        <Spinner variant="border" />
      ) : (
        <Button
          variant="outline-success"
          onClick={async () => {
            setisloading(true);
            await fetch("/api/classes/create", { method: "POST", body: name });
            setisloading(false);
            window.location.href = "http://localhost:3000/profile";
          }}
        >
          send
        </Button>
      )}
    </div>
  );
}
