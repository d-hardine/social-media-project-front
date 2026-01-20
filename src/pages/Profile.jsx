import { useContext } from "react"
import UserContext from "../config/UserContext"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"

function Profile() {

  const { user, setUser } = useContext(UserContext)

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="col-2">
            <Sidebar />
          </Col>
          <Col className="col-9">
            <p>Your profile here. Hello {user.name}</p>
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Profile