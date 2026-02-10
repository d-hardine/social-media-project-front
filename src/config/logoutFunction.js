import axiosInstance from "./axiosInstance"
import socket from '../socket.js'

const logoutFunction = async (setUser, navigate) => {
    try {
        const logoutResponse = await axiosInstance.post('/api/logout')
        if(logoutResponse.status === 200) {
            setUser(null)
            socket.disconnect()
            navigate('/')
        }
    } catch (err) {
        console.error('Logout failed: ', err)
    }
}

export default logoutFunction