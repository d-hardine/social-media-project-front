import NavigationBar from "../components/NavigationBar"
import Sidebar from "../components/Sidebar"
import axiosInstance from "../config/axiosInstance"
import ThemeContext from "../config/ThemeContext"
import { useParams } from "react-router-dom"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import { useEffect, useState, useContext } from "react"
import Spinner from 'react-bootstrap/Spinner'
import StatusCard from "../components/StatusCard"
import LatestUsersCard from "../components/LatestUsersCard"
import BottomNavigationBar from "../components/BottomNavigationBar"
import CommentCard from "../components/CommentCard"

function Status() {

  const { theme } = useContext(ThemeContext)

  const [post, setPost] = useState(null)
  const [isStatusLoading, setIsStatusLoading] = useState(true)
  const [isCommentLoading, setIsCommentLoading] = useState(true)
  const [comments, setComments] = useState(null)
  const [newComment, setNewComment] = useState('')

  const params = useParams()

  const retrieveSinglePost = async () => {
    try {
      const retrieveResponse = await axiosInstance.get(`/api/single-post/${params.statusId}`)
      if (retrieveResponse.status === 200) {
        setPost(retrieveResponse.data.singlePost)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsStatusLoading(false)
    }
  }

  const retrieveComments = async () => {
    try {
      const retrieveComments = await axiosInstance.get(`/api/comments/${params.statusId}`)
      if (retrieveComments.status === 200) {
        setComments(retrieveComments.data.comments)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsCommentLoading(false)
    }
  }

  useEffect(() => {
    retrieveSinglePost()
    retrieveComments()
  }, [])

  const handleSubmitComment = async (e) => {
    e.preventDefault()
    try {
      const commentResponse = await axiosInstance.post('/api/create-comment', { newComment, postId: params.statusId })
      if (commentResponse.status === 200) {
        retrieveComments()
        retrieveSinglePost()
        setNewComment('')
        e.target.reset()
      }
    } catch (err) {
      console.error(err)
    }
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
            {!isStatusLoading ?
              (
                <StatusCard post={post} />
              ) :
              (
                <Spinner animation="grow" variant="secondary" />
              )
            }
            <div className="mt-3 mb-3">Comment section</div>
            {!isCommentLoading ?
              (
                <>
                  <Form onSubmit={handleSubmitComment} className="mb-3">
                    <Form.Group className="mb-3" controlId="createComment">
                      <Form.Control style={{ resize: "none" }} as="textarea" rows={2} placeholder="Post your comment" onChange={(e) => setNewComment(e.target.value)} required />
                    </Form.Group>
                    <Button variant={theme === 'dark' ? 'light' : 'dark'} type="submit">Comment</Button>
                  </Form>
                  {comments.map((comment) => (
                    <CommentCard comment={comment} key={comment.id} />
                  ))}
                </>
              ) :
              (
                <Spinner animation="grow" variant="secondary" />
              )}
          </Col>
          <Col className="d-none d-lg-block col-lg-4 col-xxl-3">
            <LatestUsersCard />
          </Col>
        </Row>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default Status