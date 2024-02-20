import React from "react";
import { Link } from "react-router-dom";

const Notfound = () => {
  return (
    <div className="not-found">
      <div className="keret">
        <img
          className="lany-kep"
          src="/images/merges-lany.png"
          alt="lany-kep"
        />
        <p className="egyszer1">Egyszer</p>
        <p className="volt1">volt</p>
        <p className="hol">hol</p>
        <p className="nem">nem</p>
        <p className="volt2">volt.</p>
        <p className="volt3">Volt</p>
      </div>
      <div className="keret2">
        <p className="page-not">PAGE NOT FOUND</p>
        <div className="utolso">
          <p className="egyszer2">egyszer</p>
          <p className="egy">egy...</p>
        </div>
        <div className="gomb">
          <Link to={"/"}>
            <button className="vissza">Vissza a főoldalra!</button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Notfound;
