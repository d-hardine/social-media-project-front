import './CommentCard.css'
import Image from 'react-bootstrap/Image'
import { Link } from 'react-router-dom'
import ThemeContext from "../config/ThemeContext"
import { useContext } from "react"
import { formatDistanceToNow, format } from "date-fns"

function CommentCard({ comment }) {

  const { theme } = useContext(ThemeContext)

  return (
    <div className="comment-container d-flex p-3 gap-3 border">
      <Image src={comment.author.profilePic} className="object-fit-cover mt-1" width='35px' height='35px' roundedCircle />
      <div className="comment-content">
        <Link className={["text-decoration-none", theme === 'dark' ? 'text-light' : 'text-dark'].join(" ")} to={`/account/${comment.author.id}`}>
          <div>
            <b>{comment.author.name}</b> <span className="text-muted">@{comment.author.username}</span> · <span title={format(comment.createdAt, 'yyyy-MM-dd h:mm a')} className="text-muted">{formatDistanceToNow(comment.createdAt, { addSuffix: true })}</span>
          </div>
        </Link>
        <div>{comment.body}</div>
      </div>
    </div>
  )
}

export default CommentCard