import ListGroup from "react-bootstrap/ListGroup"
import { Link, useMatch, useResolvedPath } from "react-router-dom"
import Image from 'react-bootstrap/Image'
import homeIconWhite from '../assets/home-icon-white.svg'
import homeIconBlack from '../assets/home-icon-black.svg'
import profileIconWhite from '../assets/profile-icon-white.svg'
import profileIconBlack from '../assets/profile-icon-black.svg'
import emailIconWhite from '../assets/email-icon-white.svg'
import emailIconBlack from '../assets/email-icon-black.svg'
import postIconWhite from '../assets/post-icon-white.svg'
import postIconBlack from '../assets/post-icon-black.svg'
import './Sidebar.css'
import { useContext } from "react"
import ThemeContext from "../config/ThemeContext"

const Sidebar = () => {

    const { theme } = useContext(ThemeContext)

    return (
        <ListGroup variant="flush">
            <CustomLinkBootStrap to="/home" action>
                <Image className="m-1" src={theme === 'dark' ? homeIconWhite : homeIconBlack} width={'20px'} title="home" />
                <div className="d-none d-lg-block">Home</div>
            </CustomLinkBootStrap>
            <CustomLinkBootStrap to="/profile" action>
                <Image className="m-1" src={theme === 'dark' ? profileIconWhite : profileIconBlack} width={'20px'} title="profile" />
                <div className="d-none d-lg-block">Profile</div>
            </CustomLinkBootStrap>
            <CustomLinkBootStrap to="/message" action>
                <Image className="m-1" src={theme === 'dark' ? emailIconWhite : emailIconBlack} width={'20px'} title="message" />
                <div className="d-none d-lg-block">Message</div>
            </CustomLinkBootStrap>
            <CustomLinkBootStrap to="/post" action>
                <Image className="m-1" src={theme === 'dark' ? postIconWhite : postIconBlack} width={'20px'} title="post" />
                <div className="d-none d-lg-block">Post</div>
            </CustomLinkBootStrap>
        </ListGroup>
    )

}

function CustomLinkBootStrap({ to, children, ...props }) {
    const resolvedPath = useResolvedPath(to) //retrieve absolute path of the page
    const isActive = useMatch({ path: resolvedPath.pathname, end: true }) //end TRUE to make sure to match the absolute path, not relative
    return (
        <ListGroup.Item className={[isActive ? "active" : "", "d-flex", "align-items-center", "gap-1"].join(" ")} as={Link} to={to} {...props}>
            {children}
        </ListGroup.Item>
    )
}
export default Sidebar