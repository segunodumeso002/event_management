import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { AlertProvider } from './components/AlertProvider'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import Events from './pages/Events'
import Dashboard from './pages/Dashboard'
import Attendees from './pages/Attendees'
import './App.css'
import './styles/features.css'
import './styles/event-actions.css'
import './styles/event-form.css'

function AppContent() {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      const userData = localStorage.getItem('user')
      if (userData) {
        setUser(JSON.parse(userData))
      }
    }
  }, [token])

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    navigate('/')
  }

  return (
    <AlertProvider>
      <div className="App">
        <Navbar user={user} logout={logout} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login setUser={setUser} setToken={setToken} />} />
          <Route path="/register" element={<Register setUser={setUser} setToken={setToken} />} />
          <Route path="/events" element={<Events user={user} token={token} />} />
          <Route path="/dashboard" element={<Dashboard user={user} token={token} />} />
          <Route path="/attendees" element={<Attendees user={user} token={token} />} />
        </Routes>
      </div>
    </AlertProvider>
  )
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
