import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const User = () => {
  const url = "http://localhost:3500";
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
  const [viewBoritokep, setViewBoritokep] = useState("");
  const [sendBoritokep, setSendBoritokep] = useState("");
  const [viewRolam, setViewRolam] = useState("");
  const [viewIsAdmin, setViewIsAdmin] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [viewKovetoim, setViewKovetoim] = useState("");
  const [viewKoveteseim, setViewKoveteseim] = useState("");
  const [kovetem, setKovetem] = useState("");
  const [story, setStory] = useState([]);

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
        setViewBoritokep(response.viewBoritokep);
        setViewRolam(response.viewRolam);
        setViewIsAdmin(response.viewIsAdmin);
        setViewKovetoim(response.viewKovetoim);
        setViewKoveteseim(response.viewKoveteseim);
        setStory(response.story);
        console.log(story);
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
          boritokep: sendBoritokep,
        }),
      });
      if (response.ok) {
        setIsLoading(false);
        setSuccess("Profil sikeresen mentve!");
        setInterval(() => {
          window.location.reload();
        }, 1500);
      } else {
        setIsLoading(false);
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

  //(UN)FOLLOWING SYSTEM
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

  function displayImage_profil(e) {
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
  function displayImage_borito(e) {
    const fileInput = e.target;

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setSendBoritokep(e.target.result);
        setViewBoritokep(e.target.result);
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  return (
    <div className="profilom">
      <div
        className="profilomHatter"
        style={
          viewBoritokep
            ? { backgroundImage: `url('${viewBoritokep}')` }
            : { background: "linear-gradient(#3f4e4f, #3f4e4f)" }
        }
      >
        <div className="profilom_Tarto">
          <div className="profilomInfo_Tarto">
            <div>
              <div className="profilomInfo_container">
                {viewFelhasznalonev == felhasznalonev && isEditing === true ? (
                  <div className="kepInput">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => displayImage_profil(e)}
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
                  {viewFelhasznalonev == felhasznalonev &&
                  isEditing === true ? (
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
            <div className="profilomBio_container">Harmadik div</div>
          </div>

          <div className="boritokepFeltoltes">
            {isEditing && (
              <div>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => displayImage_borito(e)}
                  className="cover-input"
                />
                <img
                  className="boritokepFeltoltesImg"
                  src="/images/boritoupload.png"
                  alt="Borító feltőltése"
                />
              </div>
            )}
          </div>
        </div>
        {viewFelhasznalonev === felhasznalonev &&
          (isEditing === false ? (
            <div className="editButtons">
              <button onClick={() => setIsEditing(true)}>Szerkesztés</button>
            </div>
          ) : (
            <div className="editButtons">
              <button onClick={userinfo}>Vissza</button>
              <button onClick={valtoztatas}>Mentés</button>
            </div>
          ))}
        <div className="storyContainer">
          {story.map((story) =>
            viewFelhasznalonev === felhasznalonev ? (
              <div class="book-container">
                <div class="book">
                  <div class="front-content">
                    <img src={story.boritokep} alt="" />
                  </div>
                  <div class="content">
                    <p class="heading">{story.cim}</p>
                    <p>{story.leiras}</p>
                  </div>
                </div>
              </div>
            ) : (
              story.isPublished === true && (
                <div class="book-container">
                  <div class="book">
                    <div class="front-content">
                      <img src={story.boritokep} alt="" />
                    </div>
                    <div class="content">
                      <p class="heading">{story.cim}</p>
                      <p>{story.leiras}</p>
                    </div>
                  </div>
                </div>
              )
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default User;
