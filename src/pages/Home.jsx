import axiosInstance from "../config/axiosInstance"
import { useEffect, useState, useContext } from "react"
import Container from "react-bootstrap/Container"
import NavigationBar from "../components/NavigationBar"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"
import StatusCard from "../components/StatusCard"
import LatestUsersCard from "../components/LatestUsersCard"
import Spinner from 'react-bootstrap/Spinner'
import BottomNavigationBar from "../components/BottomNavigationBar"
import ThemeContext from "../config/ThemeContext"

function Home() {

  const { theme } = useContext(ThemeContext)

  const [allPosts, setAllPosts] = useState()
  const [followingPosts, setFollowingPosts] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [isLatest, setIsLatest] = useState(true)

  const retrieveAllPosts = async () => {
    try {
      const retrieveResponse =  await axiosInstance.get('/api/all-posts')
      if(retrieveResponse.status === 200) {
        setAllPosts(retrieveResponse.data.allPosts)
      }
    } catch(err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const retrieveFollowingPosts = async () => {
    try {
      const retrieveResponse =  await axiosInstance.get(`/api/following-posts/`)
      if(retrieveResponse.status === 200) {
        console.log(retrieveResponse.data.followingPosts)
        setFollowingPosts(retrieveResponse.data.followingPosts)
      }
    } catch(err) {
      console.error(err)
    }
  }

  useEffect(() => {

    retrieveAllPosts()
    retrieveFollowingPosts()
  }, [])

  const latestSwitch = () => {
    retrieveAllPosts()
    setIsLatest(true)
  }

  const followingSwitch = () => {
    retrieveFollowingPosts()
    setIsLatest(false)
  }

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="d-none d-sm-block col-2">
            <Sidebar />
          </Col>
          {isLoading ? (<Spinner animation="grow" variant="secondary" />) :
          (
            <Col>
              <div className="feed-button-container d-flex gap-3 justify-content-center mb-2">
                <div className={isLatest ? ['border-bottom', 'border-5', theme === 'dark' ? 'border-light' : 'border-dark'].join(' ') : ''} onClick={latestSwitch}>
                  Latest
                </div>
                <div className={!isLatest ? ['border-bottom', 'border-5', theme === 'dark' ? 'border-light' : 'border-dark'].join(' ') : ''} onClick={followingSwitch}>
                  Following
                </div>
              </div>
              {isLatest ? (
                allPosts.map((post) => (
                  <StatusCard post={post} key={post.id} />
                ))
              ) : (
                followingPosts.map((post) => (
                  <StatusCard post={post} key={post.id} />
                ))
              )}
            </Col>
          )}
          <Col className="d-none d-lg-block col-lg-4 col-xxl-3">
            <LatestUsersCard />
          </Col>
        </Row>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default Home