import './PrivateChat.css'
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Card from "react-bootstrap/Card"
import { format } from "date-fns"
import Sidebar from "../components/Sidebar"
import NavigationBar from "../components/NavigationBar"
import BottomNavigationBar from "../components/BottomNavigationBar"
import { useParams } from "react-router-dom"
import { useState, useEffect, useContext, useOptimistic, useRef, startTransition } from "react"
import UserContext from "../config/UserContext"
import axiosInstance from "../config/axiosInstance"
import socket from "../config/socket"
import Spinner from "react-bootstrap/Spinner"
import DateDivider from '../components/DateDivider'

function PrivateChat() {

  const params = useParams()

  const { user } = useContext(UserContext)

  const messagesEndRef = useRef(null)
  const messagesContainerRef = useRef(null)

  const [members, setMembers] = useState()
  const [groupedMessages, setGroupedMessages] = useState()
  const [isLoading, setIsLoading] = useState(true)
  const [newMessage, setNewMessage] = useState('')

  const [optimisticGroupedMessages, setOptimisticGroupedMessages] = useOptimistic(groupedMessages)

  const retrieveMessages = async () => {
    try {
      const retrieveMessagesResponse = await axiosInstance.get(`/api/messages/${params.conversationId}`)
      if (retrieveMessagesResponse.status === 200) {
        const retrievedMessages = retrieveMessagesResponse.data.retrievedMessages
        messagesContainerRef.current = retrievedMessages
        setGroupedMessages(groupMessagesByDate(retrievedMessages))
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

  const groupMessagesByDate = (messages) => {
    return messages.reduce((groups, message) => {
      const dateKey = format(new Date(message.createdAt), 'yyyy-MM-dd')

      if(!groups[dateKey]) {
        groups[dateKey] = []
      }
      groups[dateKey].push(message)
      return groups

    }, {})
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
      const retrievedMessages = data.newMessages
      setGroupedMessages(groupMessagesByDate(retrievedMessages))
    })
  }, [socket])

  useEffect(() => scrollToBottom, [groupedMessages])

  const handleNewMessage = (e) => {
    startTransition(() => {
      e.preventDefault()
      if(newMessage !== "") {

        const optimisticNewMessage = {
          id: Math.random(),
          conversationId: params.conversationId,
          senderId: user.id,
          content: newMessage,
          createdAt: Date.now()
        }
        messagesContainerRef.current.push(optimisticNewMessage)
        console.log(messagesContainerRef.current)
        setOptimisticGroupedMessages(groupMessagesByDate(messagesContainerRef.current))

        setNewMessage("")
        e.target.reset()
        socket.emit('send_message', {
          conversationId: params.conversationId,
          senderId: user.id,
          content: newMessage
        })
      }
    })
  }

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="d-none d-sm-block col-2">
            <Sidebar />
          </Col>
          <Col>
            {!isLoading ? (
              <>
                <Row>
                  <h3 className="d-flex gap-2 mb-4">
                    <Image src={members[0].user.profilePic} className="object-fit-cover mt-1" width='35px' height='35px' roundedCircle />
                    {members[0].user.name}
                  </h3>
                  <div className="messages-container mb-3" style={{ height: '70vh', overflowY: 'auto' }}>
                    {Object.keys(optimisticGroupedMessages).map((date) => (
                      <div key={date}>
                        <DateDivider dateString={date}/>
                        {optimisticGroupedMessages[date].map((message) => (
                          <div key={message.id}>
                            <div className={`d-flex ${message.senderId !== user.id ? 'justify-content-start' : 'justify-content-end'}`}>
                              <Card className={`chat-bubble ${message.senderId !== user.id ? 'bg-light text-dark' : 'bg-success text-white'}`}>
                                <Card.Body className="p-2">
                                  {message.content}
                                </Card.Body>
                              </Card>
                            </div>
                            <div className={`d-flex mb-3 text-muted ${message.senderId !== user.id ? 'justify-content-start' : 'justify-content-end'}`} title={format(message.createdAt, 'yyyy-MM-dd h:mm a')}>
                              {format(message.createdAt, 'h:mm a')}
                            </div>
                          </div>
                        ))}
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
                        <Form.Control autoComplete='off' type="text" placeholder='type a message here...' onChange={(e) => setNewMessage(e.target.value)} required />
                      </Form.Group>
                    </Col>
                    <Col className='col-1'>
                      <Button type="submit">Send</Button>
                    </Col>
                  </Row>
                </Form>
              </>
            ) : (<Spinner animation="grow" variant="secondary" />)}
          </Col>
        </Row>
        <Button onClick={() => console.log(messagesContainerRef.current)}>console log</Button>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default PrivateChat