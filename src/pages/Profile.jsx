import { Link } from "react-router-dom"
import { useContext } from "react"
import UserContext from "../config/UserContext"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"

function Profile() {

    const { user, setUser } = useContext(UserContext)

    return (
        <>
            <NavigationBar />
            <Container>
                <div>Your Profile Here, hello {user.name}!</div>
                <Link to="/home">go to home page</Link>
            </Container>
        </>
    )
}

export default Profile