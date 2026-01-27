import axiosInstance from "../config/axiosInstance"
import { useEffect, useState } from "react"
import Container from "react-bootstrap/Container"
import NavigationBar from "../components/NavigationBar"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"
import StatusCard from "../components/StatusCard"

function Home() {

  const [allPosts, setAllPosts] = useState()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
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

    retrieveAllPosts()
  }, [])

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="col-2">
            <Sidebar />
          </Col>
          {isLoading ? (<Col className="col-7">Loading</Col>) :
          ( 
            <Col className="col-7">
              {allPosts.map((post) => (
                <StatusCard post={post} key={post.id} />
              ))}
            </Col>
          )}
          <Col className="col-3">
            Card Stuff
          </Col>
        </Row>
      </Container>
    </>
  )
}

export default Home