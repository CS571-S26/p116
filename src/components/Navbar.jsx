import { NavLink } from 'react-router-dom'
import { Navbar as BsNavbar, Nav, Container } from 'react-bootstrap'
import './Navbar.css'

export default function Navbar() {
  return (
    <BsNavbar className="mims-navbar" expand="md" sticky="top">
      <Container fluid className="mims-navbar__inner">
        <BsNavbar.Brand as={NavLink} to="/" className="mims-navbar__logo">
          MIMS
        </BsNavbar.Brand>
        <BsNavbar.Toggle aria-controls="main-nav" />
        <BsNavbar.Collapse id="main-nav">
          <Nav className="ms-auto">
            <Nav.Link as={NavLink} to="/" end>Home</Nav.Link>
            <Nav.Link as={NavLink} to="/about">About</Nav.Link>
            <Nav.Link as={NavLink} to="/leadership">Leadership</Nav.Link>
            <Nav.Link as={NavLink} to="/events">Events</Nav.Link>
            <Nav.Link as={NavLink} to="/my-events">My Events</Nav.Link>
          </Nav>
        </BsNavbar.Collapse>
      </Container>
    </BsNavbar>
  )
}
