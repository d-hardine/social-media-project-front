import './StatusCard.css'
import Image from "react-bootstrap/Image"
import { format, formatDistanceToNow } from "date-fns"
import commentIconWhite from '../assets/comment-icon-white.svg'
import commentIconBlack from '../assets/comment-icon-black.svg'
import likeIconWhite from '../assets/like-icon-white.svg'
import likeIconBlack from '../assets/like-icon-black.svg'
import likeIconRed from '../assets/like-icon-red.svg'
import { useNavigate, Link } from "react-router-dom"
import { useContext, useEffect, useState, useOptimistic, startTransition } from 'react'
import UserContext from '../config/UserContext'
import ThemeContext from "../config/ThemeContext"
import axiosInstance from '../config/axiosInstance'

function StatusCard({ post }) {

  const navigate = useNavigate()

  const { theme } = useContext(ThemeContext)
  const { user } = useContext(UserContext)

  const [totalLikes, setTotalLikes] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [isLikeLoading, setIsLikeLoading] = useState(true)

  const [optimisticTotalLikes, setOptimisticTotalLikes] = useOptimistic(totalLikes)
  const [optimisticIsLiked, setOptimisticIsLiked] = useOptimistic(isLiked)

  const retrieveLike = async () => {
    try {
      const retrieveLikeResponse = await axiosInstance.get(`/like/${post.id}`)
      if (retrieveLikeResponse.status === 200) {
        setTotalLikes(retrieveLikeResponse.data.retrievedLike.length)
        const findIsLiked = retrieveLikeResponse.data.retrievedLike.some(liked => liked.authorId === user.id) //find if user clicked like to the status/post
        setIsLiked(findIsLiked)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsLikeLoading(false)
    }
  }

  useEffect(() => {
    retrieveLike()
  })

  const handleAddLike = (e) => {
    e.stopPropagation() // Prevents the click from reaching the parent
    startTransition(async () => {
      try {
        if (!isLiked) {
          setOptimisticTotalLikes(totalLikes + 1)
          setOptimisticIsLiked(true)
          const likeResponse = await axiosInstance.post(`/like/${post.id}`)
          if (likeResponse.status === 200) {
            await retrieveLike()
          }
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  const handleDeleteLike = (e) => {
    e.stopPropagation() // Prevents the click from reaching the parent
    startTransition(async () => {
      try {
        if (isLiked) {
          setOptimisticTotalLikes(totalLikes - 1)
          setOptimisticIsLiked(false)
          const likeResponse = await axiosInstance.delete(`/like/${post.id}`)
          if (likeResponse.status === 200) {
            await retrieveLike()
          }
        }
      } catch (err) {
        console.error(err)
      }
    })
  }

  const stopPropagation = (e) => {
    e.stopPropagation() // Prevents the click from reaching the parent
  }

  return (
    <div className="status-card d-flex p-3 gap-3 border" onClick={() => navigate(`/status/${post.id}`)} role='button'>
      <Image src={post.author.profilePic} className="object-fit-cover mt-1" width='35px' height='35px' roundedCircle />
      <div className="post-content d-flex flex-column justify-content-between gap-3">
        <div className="post-content-body">
          <div>
            <Link className={['text-decoration-none', theme === 'dark' ? 'text-light' : 'text-dark'].join(" ")} onClick={stopPropagation} to={`/account/${post.author.id}`}>
              <span className='fw-bold hover-text-underline'>{post.author.name}</span>
              <span className="text-muted"> @{post.author.username} </span>
            </Link>
            · <span title={format(post.createdAt, 'yyyy-MM-dd h:mm a')} className="text-muted">{formatDistanceToNow(post.createdAt, { addSuffix: true })}</span></div>
          <div>{post.content}</div>
          {post.image && (<Image className='mt-2 mb-2' src={post.image} fluid rounded />)}
        </div>
        {isLikeLoading ?
          (
            <div>Loading....</div>
          ) :
          (
            <div className="post-content-footer">
              <div className='d-flex gap-3 align-items-center'>
                <div className="comment-icon-container d-flex gap-1 align-items-center">
                  <Image src={theme === 'dark' ? commentIconWhite : commentIconBlack} width={18} />
                  {post.comments.length}
                </div>
                <div className="like-icon-container d-flex gap-1 align-items-center">
                  <Image role='button' onClick={optimisticIsLiked ? handleDeleteLike : handleAddLike} src={optimisticIsLiked ? likeIconRed : (theme === 'dark' ? likeIconWhite : likeIconBlack)} width={18} />
                  {optimisticTotalLikes}
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  )
}

export default StatusCard