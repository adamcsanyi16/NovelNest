import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const User = () => {
  const { user } = useAuthContext();
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const { felhasznalonevKuld } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewFelhasznalonev, setViewFelhasznalonev] = useState("");
  const [viewEmail, setViewEmail] = useState("");
  const [viewProfilkep, setViewProfilkep] = useState("");
  const [sendProfilkep, setSendProfilkep] = useState("");
  const [viewRolam, setViewRolam] = useState("");
  const [viewIsAdmin, setViewIsAdmin] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const url = "http://localhost:3500";

  //const navigate = useNavigate();

  //GETTING USER DATA FEOM TOKEN
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
          setFelhasznalonev(felhasznalonev);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };
    fetchData();
  }, [user, felhasznalonev, felhasznalonevKuld]);

  //LOADING DATA FOR VIEWING USERS
  const userinfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const adat = await fetch(url + `/userinfo/${felhasznalonevKuld}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (adat.ok) {
        const response = await adat.json();
        setViewFelhasznalonev(response.viewFelhasznalonev);
        setViewEmail(response.viewEmail);
        setViewProfilkep(response.viewProfilkep);
        setViewRolam(response.viewRolam);
        setViewIsAdmin(response.viewIsAdmin);

        console.log(response);
      } else {
        const response = await adat.json();
        setError(response.msg);
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while fetching data.");
    }
  };

  const valtoztatas = async () => {
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    try {
      const response = await fetch(url + `/userupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          felhasznalonev: felhasznalonev,
          email: viewEmail,
          rolam: viewRolam,
          profilkep: sendProfilkep,
        }),
      });
      if (response.ok) {
        setIsLoading(false)
        setSuccess("Profil sikeresen mentve!");
        window.location.reload()
      } else {
        setIsLoading(false)
        const response = await response.json();
        setError(response.error);
      }
    } catch (error) {
      setError("Valami hiba történt a mentés során!" + error.message);
    }
  };

  useEffect(() => {
    userinfo();
  }, [user, felhasznalonev, felhasznalonevKuld]);

  function displayImage(e) {
    const fileInput = e.target;
    
    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      
      reader.onload = function (e) {
        setSendProfilkep(e.target.result);
        setViewProfilkep(e.target.result)
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  return (
    <div className="profilom">
      <div className="profilomHatter">
        <div className="profilomInfo_Tarto">
          <div className="profilomInfo_container">
            {viewFelhasznalonev == felhasznalonev && isEditing === true ? (
              <div className="kepInput">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => displayImage(e)}
                  className="profile-input"
                />
                <img
                  src={`${viewProfilkep}`}
                  alt={`${viewFelhasznalonev} profilképe`}
                  style={{opacity: 0.6}}
                  className="profilomProfil"
                />
                <svg className="editIcon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7 11C8.10457 11 9 10.1046 9 9C9 7.89543 8.10457 7 7 7C5.89543 7 5 7.89543 5 9C5 10.1046 5.89543 11 7 11Z" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M5.56055 21C11.1305 11.1 15.7605 9.35991 21.0005 15.7899" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M12.28 3H5C3.93913 3 2.92172 3.42136 2.17157 4.17151C1.42142 4.92165 1 5.93913 1 7V17C1 18.0609 1.42142 19.0782 2.17157 19.8284C2.92172 20.5785 3.93913 21 5 21H17C18.0609 21 19.0783 20.5785 19.8284 19.8284C20.5786 19.0782 21 18.0609 21 17V12" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M18.75 8.82996V0.829956" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  <path d="M15.5508 4.02996L18.7508 0.829956L21.9508 4.02996" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
              </div>
            ) :
            <img
            src={`${viewProfilkep}`}
            alt={`${viewFelhasznalonev} profilképe`}
            className="profilomProfil"
          />
            }
            <div className="profilomFelhasznalonev">
              <h2>{viewFelhasznalonev}</h2>
              {viewFelhasznalonev == felhasznalonev && isEditing === true ? (
                <input
                  type="text"
                  value={viewEmail}
                  onChange={(e) => setViewEmail(e.target.value)}
                  id="changeEmail"
                ></input>
              ) : (
                <h5 id="changeEmail">{viewEmail}</h5>
              )  
            }
              <h4>Követők: 34</h4>
              {viewIsAdmin && <h5>Admin😎</h5>}
            </div>
          </div>
          <div className="profilomBio_container">
            {viewFelhasznalonev == felhasznalonev && isEditing === true ? (
              <textarea
                type="text"
                onChange={(e) => setViewRolam(e.target.value)}
                defaultValue={viewRolam}
                style={{backgroundColor: "rgba(162, 123, 92, 0.8)"}}
              />
            ) : (
              <textarea defaultValue={viewRolam} readOnly />
            )}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>
        </div>
          {viewFelhasznalonev === felhasznalonev && (
            isEditing === false ? (
              <button onClick={() => setIsEditing(true)}>Szerkesztés</button>
            ) : (
              <div className="editButtons">
                <button onClick={() => setIsEditing(false)}>Vissza</button>
                <button onClick={valtoztatas}>Mentés</button>
              </div>
            )
          )}
      </div>
    </div>
  );
};

export default User;
