import React from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";

const Navbar = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const klikk = () => {
    logout();
  };
  return (
    <div className="navbar">
        <Link to={"/"}>Kezdőlap</Link>
        <Link to={"/belepes"}>Belépés</Link>
        <Link to={"/regisztracio"}>Regisztráció</Link>

      {user && (
        <div className="userinfo">
          <span>{user.email}</span>
          <button className="logout-btn" onClick={klikk}>
            Kilépés
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
