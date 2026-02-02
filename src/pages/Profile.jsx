import { useContext, useEffect, useState } from "react"
import UserContext from "../config/UserContext"
import ThemeContext from "../config/ThemeContext"
import NavigationBar from "../components/NavigationBar"
import Container from "react-bootstrap/Container"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Sidebar from "../components/Sidebar"
import Form from "react-bootstrap/Form"
import Alert from 'react-bootstrap/Alert'
import Button from "react-bootstrap/Button"
import Image from "react-bootstrap/Image"
import axiosInstance from "../config/axiosInstance"
import Spinner from "react-bootstrap/Spinner"
import editIconWhite from '../assets/edit-icon-white.svg'
import editIconBlack from '../assets/edit-icon-black.svg'
import BottomNavigationBar from "../components/BottomNavigationBar"
import LatestUsersCard from "../components/LatestUsersCard"

function Profile() {

  const { user, setUser } = useContext(UserContext)
  const { theme } = useContext(ThemeContext)

  //followers states
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  //image modal/popup states
  const [showImageModal, setShowImageModal] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [alertMessage, setAlertMessage] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [preview, setPreview] = useState(user.profilePic)
  const [loadingSpinner, setLoadingSpinner] = useState(false)
  const [disableSubmit, setDisableSubmit] = useState(false)

  //bio states
  const [showEditBioModal, setShowEditBioModal] = useState(false)
  const [newBio, setNewBio] = useState(user.bio)

  //website states
  const [showEditWebsiteModal, setShowEditWebsiteModal] = useState(false)
  const [newWebsite, setNewWebsite] = useState(user.website)

  const retrieveFollowers = async () => {
    try {
      const retrieveFollowersResponse = await axiosInstance.get(`api/follow/${user.id}`)
      if(retrieveFollowersResponse.status === 200) {
        setFollowers(retrieveFollowersResponse.data.retrievedFollowers)
        setFollowing(retrieveFollowersResponse.data.retrievedFollowing)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    retrieveFollowers()
  }, [])

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'] //Client-side validation: Check MIME type
    if(!allowedTypes.includes(selectedImage.type)) { //if chosen file isn't an image
      setShowAlert(true)
      setAlertMessage('Only image files are allowed!')
      setNewImage(null)
    }
    else if(selectedImage.size > 1048576) {
      setShowAlert(true)
      setAlertMessage('Image size must not exceed 1MB!')
      setNewImage(null)
    } else {
      setNewImage(selectedImage)
      setPreview(URL.createObjectURL(selectedImage))
    }
  }

  const handleSubmitImageChange = async (e) => {
    e.preventDefault()
    setLoadingSpinner(true)
    setDisableSubmit(true)
    if(!newImage) {
      setShowAlert(true)
      setLoadingSpinner(false)
    } else {
      console.log('uploading...') //needs to show inside modal
      const formData = new FormData()
      formData.append("image", newImage)
      const uploadImageResponse = await axiosInstance.put('/api/upload-image', formData)
      setUser(uploadImageResponse.data.updatedUser)
      setLoadingSpinner(false)
      setDisableSubmit(false)
      setShowImageModal(false)
    }
  }

  const handleSubmitUpdateBio = async (e) => {
    e.preventDefault()
    const updateBioResponse = await axiosInstance.put('/api/update-bio', { newBio })
    setUser(updateBioResponse.data.updatedUser)
    setShowEditBioModal(false)
  }

  const handleSubmitUpdateWebsite = async (e) => {
    e.preventDefault()
    const updateWebsiteResponse = await axiosInstance.put('/api/update-website', { newWebsite })
    setUser(updateWebsiteResponse.data.updatedUser)
    setShowEditWebsiteModal(false)
  }

  //open and close profile picture modal/popup
  const handleCloseImageModal = () => {
    setShowImageModal(false)
    setShowAlert(false)
    setPreview(user.profilePic)
  }
  const handleShowImageModal = () => setShowImageModal(true)

  //open and close edit bio modal/popup
  const handleCloseEditBioModal = () => {
    setShowEditBioModal(false)
    setNewBio(user.bio)
  }
  const handleShowEditBioModal = () => setShowEditBioModal(true)

  //open and close edit website modal/popup
  const handleCloseEditWebsiteModal = () => {
    setShowEditWebsiteModal(false)
    setNewWebsite(user.website)
  }
  const handleShowEditWebsiteModal = () => setShowEditWebsiteModal(true)

  return (
    <>
      <NavigationBar />
      <Container>
        <Row className="pt-4">
          <Col className="d-none d-sm-block col-2">
            <Sidebar />
          </Col>
          <Col className="profile-container mb-3 d-sm-flex gap-3 gap-lg-4">
            <div className="profile-image-container d-flex flex-column gap-2">
              <Image src={user.profilePic} className="m-auto mb-1 object-fit-cover border-light" width='200px' height='200px' roundedCircle />
              <br />
              <Button style={{minWidth: 200}} className="mb-3 m-auto" variant={theme === 'dark' ? 'light' : 'dark'} onClick={handleShowImageModal}>Change Picture</Button>
            </div>
            <div className="profile-info-container">
              <div className="fs-2">{user.name}</div>
              <div className="text-muted mb-3">@{user.username}</div>
              <div className="mb-3">
                {user.bio}
                <Image className="mx-2" role="button" src={theme === 'dark' ? editIconWhite : editIconBlack} width={20} onClick={handleShowEditBioModal}/>
                <i className="text-muted">bio</i>
              </div>
              <div className="mb-3">
                <a href={user.website} target="_blank" rel="noopener noreferrer">{user.website}</a>
                <Image className="mx-2" role="button" src={theme === 'dark' ? editIconWhite : editIconBlack} width={20} onClick={handleShowEditWebsiteModal}/>
                <i className="text-muted">website</i>
              </div>
              <div className="d-flex gap-1">
                  <div><b>{followers.length}</b> <span className="text-muted">Followers</span></div>
                  <div><b>{following.length}</b> <span className="text-muted">Following</span></div>
              </div>
            </div>
          </Col>
          <Col className="d-none d-lg-block col-lg-4 col-xxl-3">
            <LatestUsersCard />
          </Col>
        </Row>
        <BottomNavigationBar />

        {/*Modal popup for change Profile Picture */}
        <Modal size="lg" show={showImageModal} onHide={handleCloseImageModal}>
          <Form onSubmit={(e) => handleSubmitImageChange(e)} encType="multipart/form-data">
            <Modal.Header closeButton>
              <Modal.Title>Change Profile Picture</Modal.Title>
            </Modal.Header>
            <Modal.Body className="d-flex align-items-center flex-column gap-3">

              <Image src={preview} className="object-fit-cover" width='200px' height='200px' roundedCircle/>
              <Form.Group controlId="formFile">
                <Form.Label>Pick new profile picture file (Picture size must not exceed 1MB)</Form.Label>
                <Form.Control type="file" name="new-profile-picture" onChange={handleImageChange} required/>
                <Alert show={showAlert} variant="danger">{alertMessage}</Alert>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseImageModal}>Close</Button>
              <Button variant="primary" type="submit" disabled={disableSubmit}>
                {!loadingSpinner ? 'Apply New Image' : <Spinner animation="grow" size="sm" variant="secondary" />}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/*Modal popup for edit bio */}
        <Modal size="lg" show={showEditBioModal} onHide={handleCloseEditBioModal}>
          <Form onSubmit={handleSubmitUpdateBio}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Bio</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form.Group className="mb-3" controlId="bio">
                <Form.Control style={{ resize: "none" }} as="textarea" rows={4} defaultValue={newBio} onChange={(e) => setNewBio(e.target.value)} required/>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditBioModal}>Close</Button>
              <Button variant="primary" type="submit">Edit Bio</Button>
            </Modal.Footer>
          </Form>
        </Modal>

        {/*Modal popup for edit website */}
        <Modal show={showEditWebsiteModal} onHide={handleCloseEditWebsiteModal}>
          <Form onSubmit={handleSubmitUpdateWebsite}>
            <Modal.Header closeButton>
              <Modal.Title>Edit Website</Modal.Title>
            </Modal.Header>
            <Modal.Body>

              <Form.Group className="mb-3" controlId="website">
                <Form.Control type="text" defaultValue={newWebsite} onChange={(e) => setNewWebsite(e.target.value)} required/>
              </Form.Group>

            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleCloseEditWebsiteModal}>Close</Button>
              <Button variant="primary" type="submit">Edit Website</Button>
            </Modal.Footer>
          </Form>
        </Modal>

      </Container>
    </>
  )
}

export default Profile