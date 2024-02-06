import "./App.scss";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useAuthContext } from "./hooks/useAuthContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home/Home";
import Notfound from "./pages/Notfound/Notfound";
import Login from "./pages/Login/Login";
import Registration from "./pages/Registration/Registration";
import Addstory from "./pages/Story/Addstory";
import User from "./pages/User/User";
import Adddropdowns from "./pages/Adddropdowns/Adddropdowns";
import Story from "./pages/Story/Story";
import Onestory from "./pages/Story/Onestory";
import Updatestory from "./pages/Story/Updatestory";
import Reset from "./pages/ResetPass/Reset";
import CodeAuth from "./pages/ResetPass/CodeAuth";

function App() {
  const { user } = useAuthContext;
  return (
    <div className="App">
      <Router>
        <Navbar />
        <Routes>
          <Route path="*" element={<Notfound />} />
          <Route path="/" element={<Home />} />
          <Route
            path="/belepes/"
            element={!user ? <Login /> : <Navigate to="/storyfelvetel" />}
          />
          <Route
            path="/belepes/:redirect"
            element={!user ? <Login /> : <Navigate to="/storyfelvetel" />}
          />
          <Route
            path="/regisztracio"
            element={
              !user ? <Registration /> : <Navigate to="/storyfelvetel" />
            }
          />
          <Route path="/storyfelvetel" element={<Addstory />} />
          <Route path="/story" element={<Story />} />
          <Route path="/story/:id" element={<Onestory />} />
          <Route path="/updatestory/:id" element={<Updatestory />} />
          <Route path="/dropdownfelvetel" element={<Adddropdowns />} />
          <Route path="/profil/:felhasznalonevKuld" element={<User />} />
          <Route path="/valtoztat" element={<Reset />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
