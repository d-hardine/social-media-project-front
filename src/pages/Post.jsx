import { useContext } from "react"
import ThemeContext from "../config/ThemeContext"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"

function Post() {

  const { theme, setTheme } = useContext(ThemeContext)

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="col-2">
            <Sidebar />
          </Col>
          <Col className="col-9">
            <Form>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control type="text" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} required />
              </Form.Group>
            <Button variant={theme === 'dark' ? 'light' : 'dark'} type="submit">Signup</Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Post