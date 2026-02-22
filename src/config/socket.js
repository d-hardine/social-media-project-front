import { io } from 'socket.io-client'

const url = !import.meta.env.VITE_API_BASE_URL ? 'http://localhost:3000' : 'https://chubby-poppy-hardine-d51d6d84.koyeb.app'
const socket = io(url, {
    autoConnect: false,
    withCredentials: true,
    transports: ["polling", "websocket"]
})

export default socket