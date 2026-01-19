import { Link } from "react-router-dom"
import UserContext from "../config/UserContext"
import { useContext } from "react"
import Container from "react-bootstrap/Container"
import NavigationBar from "../components/NavigationBar"

function Home() {

  const { user, setUser } = useContext(UserContext)

  return (
    <>
      <NavigationBar />
      <Container>
        <div>You're logged in</div>
        <Link to="/profile">go to profile page</Link>
      </Container>
    </>
  )
}

export default Home