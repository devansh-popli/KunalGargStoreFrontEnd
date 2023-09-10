import { useContext } from 'react';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { Link, NavLink } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

function NavbarComponent() {
  const userContext=useContext(UserContext)
  return (
    <Navbar expand="lg" className="bg-body-tertiary" bg='dark' data-bs-theme="dark">
      <Container>
        <Navbar.Brand as={NavLink} to={"/home"}>React-Bootstrap</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto">
          { userContext.isLogin &&  <Nav.Link as={NavLink} to={"/new-ledger-account-form"}>New Ledger Account Form</Nav.Link>}
          { userContext.isLogin &&  <Nav.Link as={NavLink} to={"/stock-item-menu"}>Stock Item Menu</Nav.Link>}
          { userContext.isLogin &&  <Nav.Link as={NavLink} to={"/view-stock-item-menu"}>View Stock Item Menu</Nav.Link>}
          { userContext.isLogin &&  <Nav.Link >{userContext.userData.email}</Nav.Link>}
          { userContext.isLogin &&  <Nav.Link onClick={()=>userContext.doLogout()}>Logout</Nav.Link>}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default NavbarComponent;