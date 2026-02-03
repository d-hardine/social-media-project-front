import { useContext, useState, useRef } from "react"
import ThemeContext from "../config/ThemeContext"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import Alert from 'react-bootstrap/Alert'
import Sidebar from "../components/Sidebar"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import axiosInstance from "../config/axiosInstance"
import { useNavigate } from "react-router-dom"
import BottomNavigationBar from "../components/BottomNavigationBar"
import LatestUsersCard from "../components/LatestUsersCard"
import imagePlusBlack from '../assets/image-plus-black.svg'
import imagePlusWhite from '../assets/image-plus-white.svg'
import Spinner from "react-bootstrap/Spinner"

function Post() {

  const { theme } = useContext(ThemeContext)

  const fileInputRef = useRef(null)

  const [post, setPost] = useState('')
  const [preview, setPreview] = useState(null)
  const [newImage, setNewImage] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')

  const navigate = useNavigate()

  // Function to handle the custom button click
  const handleClick = () => {
    // Trigger the click event of the hidden file input
    fileInputRef.current.click()
  }

  // Function to handle file selection
  const handleChange = (e) => {
    const files = e.target.files
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'] //Client-side validation: Check MIME type

    if (files && files.length > 0) {
      if (!allowedTypes.includes(files[0].type)) { //if chosen file isn't an image
        setShowAlert(true)
        setAlertMessage('Only image files are allowed!')
      }
      else if (files[0].size > 1048576) {
        setShowAlert(true)
        setAlertMessage('Image size must not exceed 1MB!')
      } else {
        setNewImage(files[0])
        setPreview(URL.createObjectURL(files[0]))
      }
    }
  }

  const handlePost = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    const formData = new FormData()
    formData.append("image", newImage)
    formData.append("newPost", post)
    const postResponse = await axiosInstance.post('/api/create-post', formData)
    if (postResponse.status === 201)
      navigate('/home')
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
            <Form onSubmit={handlePost} encType="multipart/form-data">

              <Form.Group className="mb-3" controlId="createPost">
                <Form.Control style={{ resize: "none" }} as="textarea" rows={4} placeholder="What's on your mind?" onChange={(e) => setPost(e.target.value)} required />
              </Form.Group>

              <Form.Group className="mb-3" controlId="formImageUpload">
                {preview && (
                  <>
                    <Image src={preview} rounded fluid />
                    <br />
                  </>
                )}

                {/* The custom button that the user will click */}
                <Image src={theme == 'dark' ? imagePlusWhite : imagePlusBlack} width={30} role="button" title="upload image" onClick={handleClick} />

                {/* The actual file input, which is hidden */}
                <Form.Control type="file" ref={fileInputRef} onChange={handleChange} /*Hide the input visually but keep it accessible */ style={{ display: 'none' }} />
                {newImage && (<Button className="ms-2" variant="secondary" onClick={() => { setPreview(null); setNewImage(null) }}>Clear Image</Button>)}
                <Button className="ms-2" variant={theme === 'dark' ? 'light' : 'dark'} disabled={isLoading} type="submit">
                  {!isLoading ? "Post" : <Spinner animation="grow" size="sm" variant="secondary" />}
                </Button>
              </Form.Group>
            </Form>
            <Alert show={showAlert} variant="danger" onClose={() => setShowAlert(false)} dismissible>{alertMessage}</Alert>

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

export default Post