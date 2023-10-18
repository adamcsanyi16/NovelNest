import "./App.css";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Notfound from "./pages/Notfound/Notfound";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Addstory from "./pages/Story/Addstory";
import User from "./pages/User/User";

function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="*" element={<Notfound />} />
          <Route path="/" element={<Home />} />
          <Route path="/belepes" element={<Login />} />
          <Route path="/regisztracio" element={<Registration />} />
          <Route path="/storyfelvetel" element={<Addstory />} />
          <Route path="/profil/:felhasznalonevKuld" element={<User />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
