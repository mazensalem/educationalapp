import React from "react";
import Navbar from "react-bootstrap/Navbar";
import { useSession, signIn, signOut } from "next-auth/react";
import { Button, Container, Image, NavDropdown } from "react-bootstrap";
import Spinner from "react-bootstrap/Spinner";

export default function Nav() {
  const { data: session, status } = useSession();
  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Navbar.Brand href="/">
          <img
            src="/favicon.ico"
            width="30"
            height="30"
            className="d-inline-block align-top"
            alt="logo"
          />
          LOGO
        </Navbar.Brand>
        <Navbar.Collapse className="justify-content-end">
          <Navbar.Text>
            {status == "loading" ? (
              <Spinner animation="border" />
            ) : session ? (
              <NavDropdown
                title={
                  <Image
                    roundedCircle
                    width={40}
                    height={40}
                    src={session.user.image}
                    referrerPolicy="no-referrer"
                  />
                }
                align="end"
              >
                <NavDropdown.Item href="/profile" style={{ color: "black" }}>
                  profile
                </NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => signOut()}
                  style={{ color: "red" }}
                >
                  logout
                </NavDropdown.Item>
              </NavDropdown>
            ) : (
              <Button onClick={() => signIn()} variant="outline-success">
                log in
              </Button>
            )}
          </Navbar.Text>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
