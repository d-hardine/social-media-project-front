import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import Navbar from 'react-bootstrap/Navbar'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'
import ThemeContext from "../config/ThemeContext"
import { useContext } from "react"

function BottomNavigationBar() {

  const { theme } = useContext(ThemeContext)

  return (
    <Navbar bg={theme === 'dark' ? 'dark' : 'light'} fixed='bottom' className={'d-sm-none border-top'}>
      <Container>
        <Nav className={"m-auto gap-2"}>
          <CustomBottomLink to="/home"><span className={theme === 'dark' ? 'text-light' : 'text-dark'}>Home</span></CustomBottomLink>
          <CustomBottomLink to="/profile"><span className={theme === 'dark' ? 'text-light' : 'text-dark'}>Profile</span></CustomBottomLink>
          <CustomBottomLink to="/message"><span className={theme === 'dark' ? 'text-light' : 'text-dark'}>Message</span></CustomBottomLink>
          <CustomBottomLink to="/post"><span className={theme === 'dark' ? 'text-light' : 'text-dark'}>Post</span></CustomBottomLink>
        </Nav>
      </Container>
    </Navbar>
  )
}

function CustomBottomLink({ to, children, ...props }) {
  const resolvedPath = useResolvedPath(to) //retrieve absolute path of the page
  const isActive = useMatch({ path: resolvedPath.pathname, end: true }) //end TRUE to make sure to match the absolute path, not relative
  return (
    <Nav.Link className={isActive ? "fw-bold" : ""} as={Link} to={to} {...props}>
      {children}
    </Nav.Link>
  )
}

export default BottomNavigationBar