import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import NavDropdown from 'react-bootstrap/NavDropdown'
import { Link } from "react-router-dom"
import Container from "react-bootstrap/Container"
import { useContext } from "react"
import UserContext from "../config/UserContext"
import './NavigationBar.css'
import { useNavigate } from "react-router-dom"
import logoutFunction from "../config/logoutFunction"

function NavigationBar() {

  const { user, setUser } = useContext(UserContext)

  const navigate = useNavigate() //THIS IS ESSENTIAL FOR LOGOUT FUNCTION

  return (
    <Navbar expand="md" className="navbar-background-color">
      <Container>
        <Navbar.Brand as={Link} to ="/home">Hardine Book</Navbar.Brand>
        <Navbar.Toggle aria-controls="account-navbar-nav" />
        <Navbar.Collapse id="account-navbar-nav">
          <Nav className="ms-auto">  {/* Use ms-auto to push items to the end */}
            <NavDropdown title={user.name} className="text-white" id="account-nav-dropdown">
              <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.2">Theme</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logoutFunction(setUser,navigate)}>LOG OUT</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar