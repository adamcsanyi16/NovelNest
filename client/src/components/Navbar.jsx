import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [profilkep, setProfilkep] = useState("");
  const url = "http://localhost:3500";

  const handleLogout = () => {
    logout();
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const adat = await fetch(url + "/userinfo", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const response = await adat.json();
          
          setProfilkep(profilkep);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user]);

  return (
    <div className="navbar">
      {!user && (
        <div className="main">
          <Link to="/">Kezdőlap</Link>
          <Link to="/belepes">Belépés</Link>
          <Link to="/regisztracio">Regisztráció</Link>
        </div>
      )}
      {user && (
        <div className="userinfo">
          <span>{user.felhasznalonev}</span>
          {user.userprofilkep && (
            <img
              src={`data:image/jpeg;base64,${user.userprofilkep}`}
              alt="Profilkép"
              className="profile-image"
            />
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
