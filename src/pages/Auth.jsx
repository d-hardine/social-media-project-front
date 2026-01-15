import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Form from "react-bootstrap/Form"
import Button from "react-bootstrap/Button"
import Image from 'react-bootstrap/Image'
import axios from "axios"
import { Link, useNavigate } from "react-router-dom"
import logo from '../assets/information-svgrepo-com.svg'
import { useState } from "react"

function Auth({theme}) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    const loginUser = {
      username,
      password,
    }
    const loginResponse = await axios.post(`${API_BASE_URL}/api/login`, loginUser)
    console.log(loginResponse.data)
    if(loginResponse.status === 201)
      navigate('/home')
  }

  return (
    <Row className="align-items-center justify-content-center" style={{height: '100vh'}}>
      <Col className="d-none d-md-block col-9 text-center">
        <h2><b>Hardine Book</b></h2>
        <h5>Always Connected, Anywhere You Are.</h5>
        <Image src={logo} width={'500px'} className="text-center"/>
      </Col>
      <Col>
        <h3><b>Welcome back!</b></h3>
        <div className="mb-4">We've been waiting for you.</div>
        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Username</Form.Label>
            <Form.Control type="text" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required/>
          </Form.Group>
          <Button variant={theme === 'dark' ? 'light' : 'dark'} type="submit">Login</Button>
        </Form>
        <div className="text-muted">Don't have an account? <Link to="/signup" className={theme === 'dark' ? 'link-light' : 'link-dark'}><b>Sign up</b></Link></div>
      </Col>
    </Row>
  );
}

export default Auth