
import './App.css'
import Admin from './dashboard/Admin.tsx'
import Conge from './dashboard/Conge.tsx'
import Dashboard from './dashboard/Dashboard.tsx'
import TrackingConge from './dashboard/TrackingConge.tsx'
import SignIn from './sign-in/SignIn.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Profile from './dashboard/Profile.tsx'
import Certificate from './dashboard/Certificate.tsx'
import About from './dashboard/About.tsx'
import Task from './dashboard/Task.tsx'
function App() {

  return (
    <Router>
      <Routes>

        <Route path="/" Component={SignIn} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/user" Component={Admin} />
        <Route path="/conge" Component={Conge} />
        <Route path="/tracking" Component={TrackingConge} />
        <Route path="/profile" Component={Profile} />
        <Route path="/certificate" Component={Certificate} />
        <Route path="/about" Component={About} />
        <Route path="/task" Component={Task} />

      </Routes>
    </Router>
  )
}

export default App
