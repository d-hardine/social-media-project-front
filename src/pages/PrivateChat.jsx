import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Sidebar from "../components/Sidebar"
import NavigationBar from "../components/NavigationBar"
import BottomNavigationBar from "../components/BottomNavigationBar"
import { useParams } from "react-router-dom"
import { useState, useEffect, useContext } from "react"
import UserContext from "../config/UserContext"
import axiosInstance from "../config/axiosInstance"
import socket from "../socket"

function PrivateChat() {

  const params = useParams()

  const { user } = useContext(UserContext)

  const [members, setMembers] = useState()
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  const retrieveMessages = async () => {
    try {
      const retrieveMessagesResponse = await axiosInstance.get(`/api/messages/${params.conversationId}`)
      if (retrieveMessagesResponse.status === 200) {
        setMessages(retrieveMessagesResponse.data.retrievedMessages)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const retrieveConversationMembers = async () => {
    try {
      const conversationMembersResponse = await axiosInstance.get(`/api/conversation-members/${params.conversationId}`)
      if (conversationMembersResponse.status === 200) {
        setMembers(conversationMembersResponse.data.retrievedConversationMembers)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    retrieveMessages()
    retrieveConversationMembers()
    socket.emit('join_chat', params.conversationId)
  }, [])

  useEffect(() => {
    socket.on('new_message', (data) => {
      console.log(data)
      setMessages(data.newMessages)
    })
  }, [socket])

  const handleNewMessage = (e) => {
    e.preventDefault()
    console.log(newMessage)
    socket.emit('send_message', {
      conversationId: params.conversationId,
      senderId: user.id,
      content: newMessage
    })
  }

  if(isLoading) return <div>Loading...</div>

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="d-none d-sm-block col-2">
            <Sidebar />
          </Col>
          <Col>
            {messages.length > 0 ? (
              <>
                <h2 className="d-flex gap-2">
                  <Image src={members[0].user.profilePic} className="object-fit-cover mt-1" width='35px' height='35px' roundedCircle />
                  {members[0].user.name}
                </h2>
                {messages.map(message => (
                  <div key={message.id}>{message.sender.name}: {message.content}</div>
                ))}
                <Form onSubmit={handleNewMessage}>
                  <Form.Group className="mb-3" controlId="new-message-form">
                    <Form.Control type="text" onChange={(e) => setNewMessage(e.target.value)} required />
                  </Form.Group>
                  <Button type="submit">Send</Button>
                </Form>
              </>
            ) : (
              <div>empty chat</div>
            )}
          </Col>
        </Row>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default PrivateChat