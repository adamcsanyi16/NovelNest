import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import config from "./config";

const Navbar = () => {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [profilkep, setProfilkep] = useState("");
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const url = config.URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + "/getInfos", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          const isAdmin = data.isAdmin;
          const felhasznalonev = data.felhasznalonev;
          setProfilkep(data.profilkep);
          setFelhasznalonev(felhasznalonev);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev]);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="navbar">
      <div id="logo">
        <img src="/images/novelnest-blue.png" alt="" />
        <h1>NovelNest</h1>
      </div>
      {!user ? (
        <div className="main">
          <Link to="/">Kezdőlap</Link>
          <Link to="/belepes">Belépés</Link>
          <Link to="/regisztracio">Regisztráció</Link>
        </div>
      ) : (
        <div className="main">
          <Link to="/storyfelvetel">Írj sztorit!</Link>
          <Link to="/story">Történetek</Link>
        </div>
      )}
      {user && (
        <div className="userinfo">
          <span>{felhasznalonev}</span>
          {user.profilkep && (
            <Link to={`/profil/${felhasznalonev}`}>
              <img src={`${profilkep}`} alt="  " className="profile-image" />
            </Link>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Kilépés
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
