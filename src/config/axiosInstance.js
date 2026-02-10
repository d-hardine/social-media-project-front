import axios from "axios"

//Backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

const axiosInstance = axios.create({
    baseURL: API_BASE_URL,
    withCredentials: true,
})

export default axiosInstance