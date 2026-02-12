import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Image from 'react-bootstrap/Image'
import Alert from 'react-bootstrap/Alert'
import axiosInstance from "../config/axiosInstance"
import { Link, Navigate, useNavigate } from "react-router-dom"
import logo from '../assets/information-svgrepo-com.svg'
import { useState, useContext } from "react"
import UserContext from "../config/UserContext"
import ThemeContext from "../config/ThemeContext"
import Container from "react-bootstrap/Container"
import githubLogo from '../assets/github-logo.svg'
import googleLogo from '../assets/google-logo.svg'

function Login() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showAlert, setShowAlert] = useState(false)

  const navigate = useNavigate()

  const { user, setUser } = useContext(UserContext)
  const { theme } = useContext(ThemeContext)

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const handleLogin = async (e) => {
    e.preventDefault()
    const loginUser = {
      username,
      password,
    }
    try {
      const loginResponse = await axiosInstance.post('/api/login', loginUser)
      if (loginResponse.status === 201) {
        setUser(loginResponse.data)
        navigate('/home')
      }
    } catch (err) {
      console.error(err)
      setShowAlert(true)
    }
  }

  const handleGuestUserLogin = async () => {
    const loginUser = {
      username: 'guest.user',
      password: '1234qwer',
    }
    const loginResponse = await axiosInstance.post('/api/login', loginUser)
    if (loginResponse.status === 201)
      setUser(loginResponse.data)
    navigate('/home')
  }

  const handleGithubLogin = async () => {
    window.open(`${API_BASE_URL}/api/auth/github`, '_self')
  }

  const handleGoogleLogin = async () => {
    console.log('logging in via google...')
    window.open(`${API_BASE_URL}/api/auth/google`, '_self')
  }

  if (user) { return (<Navigate to="/home" />) }

  return (
    <Container>
      <Row className="mt-3 align-items-center justify-content-center" style={{ height: '100vh' }}>
        <Col className="d-none d-md-block col-9 text-center">
          <h2><b>Hardine Book</b></h2>
          <h5>Always Connected, Anywhere You Are.</h5>
          <Image src={logo} width={'500px'} className="text-center" />
        </Col>
        <Col>
          <h3><b>Welcome back!</b></h3>
          <div className="mb-4">We've been waiting for you.</div>
          <Form onSubmit={handleLogin}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Username</Form.Label>
              <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
            </Form.Group>
            <Button variant={theme === 'dark' ? 'light' : 'dark'} type="submit">Login</Button>
          </Form>
          {showAlert && <Alert variant="danger" onClose={() => setShowAlert(false)} dismissible>Username/password invalid</Alert>}
          <div className="mb-3 text-muted">Don't have an account? <Link to="/signup" className={theme === 'dark' ? 'link-light' : 'link-dark'}><b>Sign up</b></Link></div>
          <div className="mb-2">Or login with</div>
          <div className="button-container d-flex gap-2">
            <Button variant="secondary" onClick={handleGithubLogin}>
              <Image src={githubLogo} width={25} title="GitHub" />
            </Button>
            <Button variant="success" onClick={handleGoogleLogin}>
              <Image src={googleLogo} width={25} title="Google" />
            </Button>
            <Button variant={theme === 'dark' ? 'light' : 'dark'} onClick={handleGuestUserLogin}>Guest User</Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}

export default Login