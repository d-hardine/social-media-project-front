import './PrivateChat.css'
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import Sidebar from "../components/Sidebar"
import NavigationBar from "../components/NavigationBar"
import BottomNavigationBar from "../components/BottomNavigationBar"
import { useParams } from "react-router-dom"
import { useState, useEffect, useContext, useRef } from "react"
import UserContext from "../config/UserContext"
import axiosInstance from "../config/axiosInstance"
import socket from "../socket"

function PrivateChat() {

  const params = useParams()

  const { user } = useContext(UserContext)

  const messagesEndRef = useRef(null)

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
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

  useEffect(() => scrollToBottom, [messages])

  const handleNewMessage = (e) => {
    e.preventDefault()
    setNewMessage("")
    e.target.reset()
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
            <Row>
            <h2 className="d-flex gap-2 mb-4">
              <Image src={members[0].user.profilePic} className="object-fit-cover mt-1" width='35px' height='35px' roundedCircle />
              {members[0].user.name}
            </h2>
            <div className="messages-container mb-3" style={{ maxHeight: '670px', overflowY: 'auto' }}>
              {messages.map(message => (
                <div key={message.id} className={`d-flex mb-2  ${message.senderId !== user.id ? 'justify-content-start' : 'justify-content-end'}`}>
                  <Card className={`chat-bubble ${message.senderId !== user.id ? 'bg-light text-dark' : 'bg-success text-white'}`}>
                    <Card.Body className="p-2">
                      {message.content}
                    </Card.Body>
                  </Card>
                </div>
              ))}
              {/* Invisible div to scroll to */}
              <div ref={messagesEndRef} />
            </div>
            </Row>
            <Form onSubmit={handleNewMessage}>
              <Row>
              <Col className='col-10 col-lg-11'>
                <Form.Group className="mb-3" controlId="new-message-form">
                  <Form.Control autoComplete='off' type="text" onChange={(e) => setNewMessage(e.target.value)} required />
                </Form.Group>
              </Col>
              <Col className='col-1'>
                <Button type="submit">Send</Button>
              </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default PrivateChat