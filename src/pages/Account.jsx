import NavigationBar from "../components/NavigationBar"
import Sidebar from "../components/Sidebar"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Image from "react-bootstrap/Image"
import Button from "react-bootstrap/Button"
import axiosInstance from "../config/axiosInstance"
import UserContext from "../config/UserContext"
import ThemeContext from "../config/ThemeContext"
import { useParams } from "react-router-dom"
import { useContext, useEffect, useState } from "react"
import Spinner from 'react-bootstrap/Spinner'
import webIconWhite from '../assets/web-icon-white.svg'
import webIconBlack from '../assets/web-icon-black.svg'
import BottomNavigationBar from "../components/BottomNavigationBar"
import LatestUsersCard from "../components/LatestUsersCard"
import StatusCard from "../components/StatusCard"

function Account() {

  const { theme } = useContext(ThemeContext)
  const { user } = useContext(UserContext)

  const params = useParams()

  const [account, setAccount] = useState(null)
  const [isAccountLoading, setIsAccountLoading] = useState(true)
  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])
  const [isFollowed, setIsFollowed] = useState(false)
  const [accountPosts, setAccountPosts] = useState()

  const retrieveAccount = async () => {
    try {
      const retrieveAccountResponse = await axiosInstance.get(`/api/account/${params.accountId}`)
      if (retrieveAccountResponse.status === 200) {
        setAccount(retrieveAccountResponse.data.retrievedAccount)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsAccountLoading(false)
    }
  }

  const retrieveFollowers = async () => {
    try {
      const retrieveFollowersResponse = await axiosInstance.get(`api/follow/${params.accountId}`)
      if (retrieveFollowersResponse.status === 200) {
        setFollowers(retrieveFollowersResponse.data.retrievedFollowers)
        setFollowing(retrieveFollowersResponse.data.retrievedFollowing)
        const findIsFollowed = retrieveFollowersResponse.data.retrievedFollowers.some(followed => followed.followingId === user.id) //find if user is followed the clicked account
        setIsFollowed(findIsFollowed)
      }
    } catch (err) {
      console.error(err)
    }
  }

  const retrieveAccountPosts = async () => {
    try {
      const retrieveResponse = await axiosInstance.get(`/api/account-posts/${params.accountId}`)
      if (retrieveResponse.status === 200) {
        setAccountPosts(retrieveResponse.data.accountPosts)
      }
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    retrieveAccount()
    retrieveFollowers()
    retrieveAccountPosts()
  }, [])

  const addFollow = async () => {
    try {
      const addFollowResponse = await axiosInstance.post(`/api/follow/${params.accountId}`)
      if (addFollowResponse.status === 200) {
        console.log(addFollowResponse.data)
        retrieveFollowers()
      }
    } catch (err) {
      console.log(err)
    }
  }

  const deleteFollow = async () => {
    try {
      const deleteFollowResponse = await axiosInstance.delete(`/api/follow/${params.accountId}`)
      if (deleteFollowResponse.status === 200) {
        console.log(deleteFollowResponse.data)
        retrieveFollowers()
      }
    } catch (err) {
      console.log(err)
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
          {isAccountLoading ? (<Spinner animation="grow" variant="secondary" />) : (
            <Col>
              <div className="profile-container mb-3 d-sm-flex gap-3 gap-lg-4">
                <div className="profile-image-container d-flex flex-column gap-2">
                  <Image src={account.profilePic} className="m-auto mb-1 object-fit-cover border-light" width='200px' height='200px' roundedCircle />
                  <br />
                  {user.id !== params.accountId &&
                    (isFollowed ? (
                      <Button style={{ minWidth: 200 }} className="mb-3 m-auto" variant="secondary" onClick={deleteFollow}>Unfollow</Button>
                    ) : (
                      <Button style={{ minWidth: 200 }} className="mb-3 m-auto" variant={theme === 'dark' ? 'light' : 'dark'} onClick={addFollow}>Follow</Button>
                    ))
                  }
                </div>
                <div className="profile-info-container">
                  <div className="fs-2">{account.name}</div>
                  <div className="text-muted mb-3">@{account.username}</div>
                  <div className="mb-3">{account.bio}</div>
                  {account.website && (
                    <div className="mb-3 d-flex align-items-center gap-2">
                      <Image src={theme === 'dark' ? webIconWhite : webIconBlack} width={25} />
                      <a href={account.website} target="_blank" rel="noopener noreferrer">{account.website}</a>
                    </div>
                  )}
                  <div className="d-flex gap-1">
                    <div><b>{followers.length}</b> <span className="text-muted">Followers</span></div>
                    <div><b>{following.length}</b> <span className="text-muted">Following</span></div>
                  </div>
                </div>
              </div>
              <div className="mb-2 fw-bold">Post History</div>
              {accountPosts && (
                accountPosts.map((post) => (
                  <StatusCard post={post} key={post.id} />
                ))
              )}
            </Col>
          )}
          <Col className="d-none d-lg-block col-lg-4 col-xxl-3">
            <LatestUsersCard />
          </Col>
        </Row>
      </Container>
      <BottomNavigationBar />
    </>
  )
}

export default Account