import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [profilkep, setProfilkep] = useState("");
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const url = "http://localhost:3500";

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
              <img
                src={`${profilkep}`}
                alt="Profilkép"
                className="profile-image"
              />
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
