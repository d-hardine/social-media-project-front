import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Home from './pages/Home'
import ProtectedRoutes from './components/ProtectedRoutes'
import { useState, useEffect } from 'react'
import axios from "axios"
import Profile from './pages/Profile'

function App() {

  //Backend URL
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000'

  //user setup
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/auth`, { withCredentials: true })
        if(response.status === 201) {
          setUser(response.data)
        }
      } catch (err) {
          console.error(err)
      } finally {
        setIsLoading(false)
      }
    }
    checkAuth()
  }, [])

  // Function to detect  theme OS preference
  const getSystemPreference = () => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  };

  // State to hold the current theme
  const [theme, setTheme] = useState(getSystemPreference());

  // UseEffect to apply the theme and listen for OS changes
  useEffect(() => {
    // Apply the data-bs-theme attribute to the document's html element
    document.documentElement.setAttribute('data-bs-theme', theme);

    // Listen for changes in the OS color scheme
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleSystemChange = (e) => {
      // Update the theme state if the user hasn't manually overridden it
      // (a more complex implementation would involve local storage here)
      setTheme(e.matches ? 'dark' : 'light');
    };

    mediaQuery.addEventListener('change', handleSystemChange);

    // Cleanup the event listener on component unmount
    return () => mediaQuery.removeEventListener('change', handleSystemChange);
  }, [theme]); // Re-run if theme changes

  // Optional: Function to allow the user to manually toggle the theme
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };
  
  return (
    <>
      <Container>
        <Routes>
          <Route path='/' element={<Login theme={theme} setUser={setUser} />}/>
          <Route path='/signup' element={<Signup theme={theme} user={user} />}/>
          <Route element={<ProtectedRoutes user={user} isLoading={isLoading} />}>
            <Route path='/home' element={<Home user={user} />}/>
            <Route path='/profile' element={<Profile user={user} />}/>
          </Route>
          <Route path='*' element={<Navigate to="/" />} />
        </Routes>
      </Container>
    </>
  )
}

export default App
