import { getSession } from "next-auth/react";
import { Card } from "react-bootstrap";

export default function Home({ classses }) {
  return (
    <div className="d-flex flex-wrap">
      {classses.map((clas) => (
        <>
          <Card
            style={{
              width: "18rem",
              marginTop: "1rem",
              marginLeft: "1rem",
              backgroundColor: "gainsboro",
              border: "1px solid",
              borderRadius: "5px",
            }}
          >
            <Card.Body>
              <Card.Title>{clas.name}</Card.Title>
              <Card.Subtitle className="mb-2 text-muted">
                {clas.code}
              </Card.Subtitle>
              <Card.Link href={"/class/" + clas.code}>See more</Card.Link>
            </Card.Body>
          </Card>
        </>
      ))}
    </div>
  );
}
export async function getServerSideProps(context) {
  console.log(session);
  const session = await getSession({ req: context.req });
  const rclasses = await fetch(
    process.env.NEXTAUTH_URL + "/api/users/getclass",
    {
      body: JSON.stringify(session),
      method: "POST",
    }
  );
  const classses = await rclasses.json();

  return {
    props: {
      classses: classses.classes,
    },
  };
}
