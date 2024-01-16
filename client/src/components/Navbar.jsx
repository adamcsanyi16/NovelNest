import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { useLogout } from "../hooks/useLogout";
import { useAuthContext } from "../hooks/useAuthContext";
import config from "./config";

const Navbar = () => {
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [profilkep, setProfilkep] = useState("");
  const [profilMenu, setProfilMenu] = useState(false);
  const [windowSize, setWindowSize] = useState([
    window.innerWidth,
    window.innerHeight,
  ]);
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
        } else {
          const data = await response.json();
          if (data.msg.includes("Token expired")) {
            logout();
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev]);

  useEffect(() => {
    const handleWindowResize = () => {
      setWindowSize([window.innerWidth, window.innerHeight]);
    };

    window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener("resize", handleWindowResize);
    };
  }, []);

  const handleLogout = () => {
    logout();
  };

  const menuLogout = () => {
    setProfilMenu(false);
    logout();
  };

  return (
    <div className="navbar">
      <div id="logo">
        {user ? (
          <div>
            <Link to="/story">
              <img
                onClick={() => {
                  setProfilMenu(false);
                }}
                src="/images/novelnest-blue.png"
                alt=""
              />
            </Link>
          </div>
        ) : (
          <Link to="/">
            <img src="/images/novelnest-blue.png" alt="" />
          </Link>
        )}

        <div>
          {windowSize[0] > 760 ? (
            <div className="main">
              <p>
                Novel<span>Nest</span>
              </p>
            </div>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {!user ? (
        <div className="main">
          <Link to="/">Kezdőlap</Link>
          <Link to="/belepes">Belépés</Link>
          <Link to="/regisztracio">Regisztráció</Link>
        </div>
      ) : (
        <div className="navbarIkon_tarto">
          {windowSize[0] > 940 ? (
            <div className="main">
              <Link to="/storyfelvetel">Írj sztorit!</Link>
              <Link to="/story">Történetek</Link>
            </div>
          ) : (
            <div className="main">
              <div className="navbarIkon">
                <Link to="/storyfelvetel">
                  <span
                    onClick={() => {
                      setProfilMenu(false);
                    }}
                    id="ujStory_ikon"
                    class="material-symbols-outlined"
                  >
                    edit_note
                  </span>
                </Link>
              </div>
              <div className="navbarIkon">
                <Link to="/story">
                  <span
                    onClick={() => {
                      setProfilMenu(false);
                    }}
                    id="storys_ikon"
                    class="material-symbols-outlined"
                  >
                    sticky_note_2
                  </span>
                </Link>
              </div>
            </div>
          )}
        </div>
      )}
      {user && windowSize[0] > 940 ? (
        <div className="userinfo">
          <span>{felhasznalonev}</span>
          {profilkep && (
            <Link to={`/profil/${felhasznalonev}`}>
              <img src={`${profilkep}`} alt="  " className="profile-image" />
            </Link>
          )}
          <button className="logout-btn" onClick={handleLogout}>
            Kilépés
          </button>
        </div>
      ) : (
        <div>
          <div className="navbarProfilkep">
            {user && profilkep && (
              <img
                src={`${profilkep}`}
                alt="  "
                className="profile-image"
                onClick={() => {
                  setProfilMenu(!profilMenu);
                }}
                style={{ cursor: "pointer" }}
              />
            )}
          </div>
          {user && profilMenu && (
            <div className="profilMenu">
              <Link to={`/profil/${felhasznalonev}`}>
                <h2>{felhasznalonev}</h2>
              </Link>
              <div className="profilMenu_logout" onClick={menuLogout}>
                <span class="material-symbols-outlined">logout</span>
                <h2>Kilépés</h2>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Navbar;
