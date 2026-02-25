import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import Spinner from 'react-bootstrap/Spinner'
import axiosInstance from "../config/axiosInstance"
import logoutFunction from "../config/logoutFunction"
import UserContext from "../config/UserContext"
import socket from '../config/socket.js'

function ProtectedRoutes({ isLoading, setIsLoading }) {

    const location = useLocation()
    const navigate = useNavigate() //THIS IS ESSENTIAL FOR LOGOUT FUNCTION

    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const response = await axiosInstance.get('/auth')
                if (response.status === 201) {
                    setUser(response.data)
                    localStorage.setItem('isLoggedIn', 'true')
                    socket.connect()
                }
            } catch (err) {
                logoutFunction(setUser, navigate)
                console.error(err)
            } finally {
                setIsLoading(false)
            }
        }
        checkAuth()
    }, [location.pathname])

    if (isLoading) return ( <div className="d-flex justify-content-center align-items-center" style={{height: '50vh'}}><Spinner animation="grow" variant="secondary" /></div>)
    else if (!user) {
        return <Navigate to="/login" replace />
    } else {
        return <Outlet />
    }
}

export default ProtectedRoutes