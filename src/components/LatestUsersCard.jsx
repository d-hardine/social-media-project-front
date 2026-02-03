import axiosInstance from "../config/axiosInstance"
import UserContext from "../config/UserContext"
import ThemeContext from "../config/ThemeContext"
import { useState, useEffect, useContext } from "react"
import Button from 'react-bootstrap/Button'
import Card from 'react-bootstrap/Card'
import ListGroup from 'react-bootstrap/ListGroup'
import { Link } from 'react-router-dom'
import Spinner from 'react-bootstrap/Spinner'

function LatestUsersCard() {

  const { user } = useContext(UserContext)
  const { theme } = useContext(ThemeContext)

  const [latestUsers, setLatestUsers] = useState([])
  const [isCardLoading, setIsCardLoading] = useState(true)
  const [following, setFollowing] = useState([])

  const retrieveLatestUsers = async () => {
    try {
      const retrieveLatestUsersResponse = await axiosInstance.get('/api/latest-users')
      if (retrieveLatestUsersResponse.status === 200) {
        setLatestUsers(retrieveLatestUsersResponse.data.latestUsers)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsCardLoading(false)
    }
  }

  const retrieveFollowers = async () => {
    try {
      const retrieveFollowersResponse = await axiosInstance.get(`api/follow/${user.id}`)
      if (retrieveFollowersResponse.status === 200) {
        setFollowing(retrieveFollowersResponse.data.retrievedFollowing)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    retrieveLatestUsers()
    retrieveFollowers()
  }, [])

  const addFollow = async (e, userId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const addFollowResponse = await axiosInstance.post(`/api/follow/${userId}`)
      if (addFollowResponse.status === 200) {
        console.log(addFollowResponse.data)
        retrieveFollowers()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteFollow = async (e, userId) => {
    e.preventDefault()
    e.stopPropagation()
    try {
      const deleteFollowResponse = await axiosInstance.delete(`/api/follow/${userId}`)
      if (deleteFollowResponse.status === 200) {
        console.log(deleteFollowResponse.data)
        retrieveFollowers()
      }
    } catch (err) {
      console.log(err)
    }
  }

  if (isCardLoading) return <Spinner animation="grow" variant="secondary" />

  return (
    <Card>
      <Card.Header><b>Latest Users</b></Card.Header>
      <Card.Body>
        <ListGroup variant="flush">
          {latestUsers.map(latestUser => (
            <ListGroup.Item key={latestUser.id} as={Link} to={`/account/${latestUser.id}`} className='d-flex gap-2 align-items-center justify-content-between' action>
              <div className="user-info-container">
                <div className={theme === 'dark' ? 'text-light' : 'text-dark'}><b>{latestUser.name}</b></div>
                <div>@{latestUser.username}</div>
              </div>
              {following.some(f => f.followedById === latestUser.id) ? (
                <Button variant="secondary" onClick={(e) => deleteFollow(e, latestUser.id)}>Unfollow</Button>
              ) : (
                <Button variant={theme === 'dark' ? 'light' : 'dark'} onClick={(e) => addFollow(e, latestUser.id)}>Follow</Button>
              )}
            </ListGroup.Item>
          ))}
        </ListGroup>
      </Card.Body>
    </Card>
  )
}

export default LatestUsersCard