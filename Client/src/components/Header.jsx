import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { NavLink } from "react-router-dom";
import "../styles/header.css";

export default function Header() {
  return (
    <Navbar collapseOnSelect expand="lg" fixed="top" className="main-header">
      <Container>
        <Navbar.Brand href="/">
          <h1 className="m-0">QuizCard</h1>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/manage-cards" eventKey="1">Manage Cards</Nav.Link>
            <Nav.Link as={NavLink} to="/study" eventKey="2">Study Mode</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
