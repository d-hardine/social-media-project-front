import { Link } from "react-router-dom"

function Home() {
    return (
        <>
            <div>You're logged in</div>
            <Link to="/profile">go to profile page</Link>
        </>
    )
}

export default Home