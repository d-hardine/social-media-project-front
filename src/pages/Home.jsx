import UserContext from "../config/UserContext"
import { useContext } from "react"
import Container from "react-bootstrap/Container"
import NavigationBar from "../components/NavigationBar"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"

function Home() {

  const { user, setUser } = useContext(UserContext)

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="col-2">
            <Sidebar />
          </Col>
          <Col className="col-7">
            Status Update
          </Col>
          <Col className="col-3">
            Card Stuff
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home