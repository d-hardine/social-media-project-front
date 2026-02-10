import { useState, useContext, useEffect } from "react"
import { Link } from "react-router-dom"
import UserContext from "../config/UserContext"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"
import Image from "react-bootstrap/Image"
import BottomNavigationBar from "../components/BottomNavigationBar"
import axiosInstance from "../config/axiosInstance"

function Chat() {

  const { user } = useContext(UserContext)

  const [conversations, setConversations] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  const retrieveConversations = async () => {
    try {
      const retrieveConversationsResponse = await axiosInstance.get(`/api/conversations/${user.id}`)
      if (retrieveConversationsResponse.status === 200) {
        setConversations(retrieveConversationsResponse.data.retrievedConversations)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    retrieveConversations()
  }, [])

  if(isLoading) return (
    <>
      <NavigationBar />
      <div>Loading...</div>
    </>
  )

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="d-none d-sm-block col-2">
            <Sidebar />
          </Col>
          <Col>
            <h1 className="mb-3">Chats</h1>
            {conversations.length > 0 ? (
              conversations.map(conversation => (
                <Link to={`/chat/${conversation.id}`} style={{color: "inherit"}} className="mb-3 d-flex gap-3 text-decoration-none" key={conversation.id}>
                  <Image src={conversation.members[0].user.profilePic} className="object-fit-cover mt-1" width='40px' height='40px' roundedCircle />
                  <div className="chat-content">
                    <div><b>{conversation.members[0].user.name}</b> <span className="text-muted">@{conversation.members[0].user.username}</span></div>
                  </div>
                </Link>
              ))
            ) : (
              <div>you don't have chat history.</div>
            )}
          </Col>
        </Row>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default Chat