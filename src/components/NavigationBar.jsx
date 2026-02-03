import Nav from "react-bootstrap/Nav"
import Navbar from "react-bootstrap/Navbar"
import Form from "react-bootstrap/Form"
import NavDropdown from 'react-bootstrap/NavDropdown'
import Container from "react-bootstrap/Container"
import { Link, useNavigate } from "react-router-dom"
import { useContext } from "react"
import UserContext from "../config/UserContext"
import ThemeContext from "../config/ThemeContext"
import logoutFunction from "../config/logoutFunction"
import './NavigationBar.css'

function NavigationBar() {

  const { user, setUser } = useContext(UserContext)
  const { theme, setTheme } = useContext(ThemeContext)

  //Allow the user to manually toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const navigate = useNavigate() //THIS IS ESSENTIAL FOR LOGOUT FUNCTION

  return (
    <Navbar expand="md" className={theme === 'light' ? "navbar-background-color-light" : "navbar-background-color-dark"} >
      <Container>
        <Navbar.Brand as={Link} to="/home">Hardine Book</Navbar.Brand>
        <Navbar.Toggle aria-controls="account-navbar-nav" />
        <Navbar.Collapse id="account-navbar-nav">
          <Nav className="ms-auto">  {/* Use ms-auto to push items to the end */}
            <NavDropdown title={user.name} id="account-nav-dropdown">
              <NavDropdown.Item as={'div'}>
                <Form>
                  <Form.Check type="switch" onChange={toggleTheme} id='dark-mode-switch' label='Dark Mode' checked={theme === 'dark' ? true : false} />
                </Form>
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item onClick={() => logoutFunction(setUser, navigate)}>LOG OUT</NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  )
}

export default NavigationBar