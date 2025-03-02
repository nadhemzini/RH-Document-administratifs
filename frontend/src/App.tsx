
import './App.css'
import Admin from './dashboard/Admin.tsx'
import Conge from './dashboard/Conge.tsx'
import Dashboard from './dashboard/Dashboard.tsx'
import TrackingConge from './dashboard/TrackingConge.tsx'
import SignIn from './sign-in/SignIn.tsx'
import SignUp from './sign-up/SignUp.tsx'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import Profile from './dashboard/Profile.tsx'
import Certificate from './dashboard/Certificate.tsx'
function App() {

  return (
    <Router>
      <Routes>

        <Route path="/" Component={SignIn} />
        <Route path="/dashboard" Component={Dashboard} />
        <Route path="/signup" Component={SignUp} />
        <Route path="/user" Component={Admin} />
        <Route path="/conge" Component={Conge} />
        <Route path="/tracking" Component={TrackingConge} />
        <Route path="/profile" Component={Profile} />
        <Route path="/certificate" Component={Certificate} />

      </Routes>
    </Router>
  )
}

export default App
