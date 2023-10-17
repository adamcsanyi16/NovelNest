import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const url = "http://localhost:3500";

  const handleLogout = () => {
    logout();
  };

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
            <Link to="/profilom">
              <img
            src={`data:image/jpeg;base64,${user.userprofilkep}`}
            alt="Profilkép"
            className="profile-image"
          /></Link>
            
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
