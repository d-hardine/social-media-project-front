import { Outlet, useLocation, Navigate, useNavigate } from "react-router-dom"
import { useEffect, useContext } from "react"
import { BounceLoader } from "react-spinners"
import axiosInstance from "../config/axiosInstance"
import logoutFunction from "../config/logoutFunction"
import UserContext from "../config/UserContext"

function ProtectedRoutes({ isLoading, setIsLoading}) {

    const location = useLocation()
    const navigate = useNavigate() //THIS IS ESSENTIAL FOR LOGOUT FUNCTION

    const { user, setUser } = useContext(UserContext)

    useEffect(() => {
        const checkAuth = async () => {
        try {
            const response = await axiosInstance.get('/api/auth')
            if(response.status === 201) {
              setUser(response.data)
            }
        } catch (err) {
            logoutFunction(setUser,navigate)
            console.error(err)
        } finally {
            setIsLoading(false)
        }
    }
    checkAuth()
    }, [location.pathname])

    if (isLoading) return <BounceLoader />
    else if (!user) {
        return <Navigate to="/login" replace />
    } else {
        return <Outlet />
    }
}

export default ProtectedRoutes