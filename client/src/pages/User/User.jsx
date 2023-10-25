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
        setSuccess("Profil sikeresen mentve!");
        console.log("mentve");
      } else {
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
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  return (
    <div className="profilom">
      <div className="profilomHatter">
        <div className="profilomInfo_Tarto">
          <div className="profilomInfo_container">
            {viewFelhasznalonev == felhasznalonev && (
              <div className="kepInput">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => displayImage(e)}
                  className="profile-input"
                />
                {sendProfilkep && (
                  <img src={sendProfilkep} alt="Uploaded Image" />
                )}
              </div>
            )}
            {viewProfilkep && (
              <img
                src={`${viewProfilkep}`}
                alt="Profilkép"
                className="profilomProfil"
              />
            )}
            <div className="profilomFelhasznalonev">
              <h2>{viewFelhasznalonev}</h2>
              {viewFelhasznalonev == felhasznalonev && (
                <input
                  type="text"
                  value={viewEmail}
                  onChange={(e) => setViewEmail(e.target.value)}
                ></input>
              )}
              <h4>Követők: 34</h4>
              {viewIsAdmin && <h5>Admin😎</h5>}
            </div>
          </div>
          <div className="profilomBio_container">
            {viewFelhasznalonev == felhasznalonev ? (
              <textarea
                type="text"
                onChange={(e) => setViewRolam(e.target.value)}
                defaultValue={viewRolam}
              />
            ) : (
              <textarea defaultValue={viewRolam} readOnly />
            )}
            {viewFelhasznalonev == felhasznalonev && (
              <button onClick={valtoztatas}>Mentés</button>
            )}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
