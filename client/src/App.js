import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'
import Home from './Pages/Home';
import Important from './components/Important';
import Landing from './Pages/Landing';
import LoginForm from './components/LoginForm';


function App() {
  const logout =() => {
    localStorage.removeItem("accessToken")
  }
  return (
    <div className="App">
     
      <Router>
      <nav>
        <ul>
          <li><Link to="/">App</Link></li>
          <li><Link to="/home">home</Link></li>
          <li><Link to="/login">Login</Link></li>
          <li><Link to="/about">About</Link></li>
          <li><button onClick={logout}>Logout</button></li>
        </ul>
      </nav>
        <Routes>
        <Route path="/" element={<Landing/>} />
        <Route path="home" element={<Home />} />
        <Route path="about" element={<Important />} />
        <Route path="login" element={<LoginForm />} />
        </Routes>
      </Router>


    </div>
  );
}

export default App;
