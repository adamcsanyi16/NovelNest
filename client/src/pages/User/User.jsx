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
  const [viewKovetoim, setViewKovetoim] = useState("");
  const [viewKoveteseim, setViewKoveteseim] = useState("");
  const [kovetem, setKovetem] = useState("");
  const [story, setStory] = useState("");
  const [isPublished, setIsPublished] = useState("");
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

  //LOADING STORIES UPLOADED BY THE LOGGED IN USER
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + "/story", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          setStory(data.story);
          setIsPublished(data.isPublished);
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
    setIsEditing(false);

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
        setViewKovetoim(response.viewKovetoim);
        setViewKoveteseim(response.viewKoveteseim);
      } else {
        const response = await adat.json();
        setError(response.msg);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Hiba történt fetchelés közben.");
    }

    try {
      const adat = await fetch(url + `/userinfo/${felhasznalonevKuld}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          felhasznalonev: felhasznalonev,
        }),
      });
      if (adat.ok) {
        const response = await adat.json();
        setKovetem(response.kovetem);
        console.log(response.kovetem);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Hiba történt fetchelés közben.");
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
        setIsLoading(false);
        setSuccess("Profil sikeresen mentve!");
        window.location.reload();
      } else {
        setIsLoading(false);
        const response = await response.json();
        setError(response.error);
      }
    } catch (error) {
      setError("Valami hiba történt a mentés során!" + error.message);
    }
  };

  const bekovetes = async () => {
    setIsLoading(true);
    setSuccess(null);
    setError(null);
    setKovetem(true);
    setViewKovetoim(viewKovetoim + 1);
    try {
      const response = await fetch(`${url}/bekovet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          felhasznalonev: felhasznalonev,
          viewFelhasznalonev: viewFelhasznalonev,
        }),
      });
      if (response.ok) {
        setIsLoading(false);
        setSuccess("Profil sikeresen bekövetve!");
      } else {
        setIsLoading(false);
        const data = await response.json();
        setError(data.msg);
      }
    } catch (error) {
      setError("Valami hiba történt a mentés során!" + error.message);
    }
  };

  const kikovetes = async () => {
    setIsLoading(true);
    setSuccess(null);
    setError(null);
    setKovetem(false);
    setViewKovetoim(viewKovetoim - 1);
    try {
      const response = await fetch(`${url}/kikovet`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          felhasznalonev: felhasznalonev,
          viewFelhasznalonev: viewFelhasznalonev,
        }),
      });
      if (response.ok) {
        setIsLoading(false);
        setSuccess("Profil sikeresen kikövetve!");
      } else {
        setIsLoading(false);
        const data = await response.json();
        setError(data.msg);
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
        setViewProfilkep(e.target.result);
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  return (
    <div className="profilom">
      <div className="profilomHatter">
        <div className="profilomInfo_Tarto">
          <div>
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
                    style={{ opacity: 0.6 }}
                    className="profilomProfil"
                  />
                </div>
              ) : (
                <img
                  src={`${viewProfilkep}`}
                  alt={`${viewFelhasznalonev} profilképe`}
                  className="profilomProfil"
                />
              )}
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
                )}

                {viewIsAdmin && <h5>Admin😎</h5>}
              </div>
            </div>
            <div id="profilomInfo_container">
              <div className="kovetok">
                <h4>Követők: {viewKovetoim}</h4>
                <h4>Követés: {viewKoveteseim}</h4>
              </div>
              <div className="kovetoGomb">
                {felhasznalonev != viewFelhasznalonev ? (
                  kovetem === false ? (
                    <button onClick={bekovetes}>Követés</button>
                  ) : (
                    <button onClick={kikovetes}>Kikövetés</button>
                  )
                ) : (
                  ""
                )}
              </div>
            </div>
          </div>
          <div className="profilomBio_container">
            {viewFelhasznalonev == felhasznalonev && isEditing === true ? (
              <textarea
                type="text"
                onChange={(e) => setViewRolam(e.target.value)}
                defaultValue={viewRolam}
                style={{ backgroundColor: "rgba(162, 123, 92, 0.8)" }}
              />
            ) : (
              <textarea defaultValue={viewRolam} readOnly />
            )}
            {error && <div className="error">{error}</div>}
            {success && <div className="success">{success}</div>}
          </div>
        </div>
        {viewFelhasznalonev === felhasznalonev &&
          (isEditing === false ? (
            <button onClick={() => setIsEditing(true)}>Szerkesztés</button>
          ) : (
            <div className="editButtons">
              <button onClick={userinfo}>Vissza</button>
              <button onClick={valtoztatas}>Mentés</button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default User;
