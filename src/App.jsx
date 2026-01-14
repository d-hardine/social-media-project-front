import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'
import Container from 'react-bootstrap/Container'
import { Routes, Route, Navigate } from 'react-router-dom'
import Auth from './pages/Auth'
import Test from './pages/Test'
import { useState, useEffect } from 'react'

function App() {
    // Function to detect OS preference
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
          <Route path='/' element={<Auth />}/>
          <Route path='/test' element={<Test />}/>
        </Routes>
      </Container>
    </>
  )
}

export default App
