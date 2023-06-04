import { BrowserRouter as Router,Routes, Route } from "react-router-dom";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./pages/Home";
import 'bootstrap/dist/css/bootstrap.min.css';


function App() {
  return (
    <div className="App">
      <Router>
      <Routes>
        <Route path="/Home" element={<Home/>} /> 
       <Route path="/SignUp" element={<Signup/>}/>
       <Route path="/" element={<Login/>}/>
       <Route path="/Profile/:userID" element={<Profile/>}/>
       </Routes>
       </Router>    
    </div>
  );
}

export default App;
