import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import Modal from "react-modal";

const User = () => {
  const url = "http://localhost:3500";
  const { user } = useAuthContext();
  const { logout } = useLogout();

  const [felhasznalonev, setFelhasznalonev] = useState("");
  const { felhasznalonevKuld } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const [viewFelhasznalonev, setViewFelhasznalonev] = useState("");
  const [viewEmail, setViewEmail] = useState("");
  const [viewProfilkep, setViewProfilkep] = useState("");
  const [sendProfilkep, setSendProfilkep] = useState("");
  const [viewBoritokep, setViewBoritokep] = useState("");
  const [sendBoritokep, setSendBoritokep] = useState("");
  const [viewRolam, setViewRolam] = useState("");
  const [viewIsAdmin, setViewIsAdmin] = useState("");
  const [viewKovetoim, setViewKovetoim] = useState("");
  const [viewKoveteseim, setViewKoveteseim] = useState("");
  const [viewKovetoimList, setViewKovetoimList] = useState("");
  const [viewKoveteseimList, setViewKoveteseimList] = useState("");
  const [viewKovetoimListKep, setViewKovetoimListKep] = useState("");
  const [viewKoveteseimListKep, setViewKoveteseimListKep] = useState("");

  const [toggleKovetoim, setToggleKovetoim] = useState(false);
  const [toggleKoveteseim, SetToggleKoveteseim] = useState(false);
  const [kovetem, setKovetem] = useState("");

  const [story, setStory] = useState([]);
  const [legujabbStory, setLegujabbStory] = useState("");

  const navigate = useNavigate();

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
        console.log(response);
        setViewFelhasznalonev(response.viewFelhasznalonev);
        setViewEmail(response.viewEmail);
        setViewProfilkep(response.viewProfilkep);
        setViewBoritokep(response.viewBoritokep);
        setViewRolam(response.viewRolam);
        setViewIsAdmin(response.viewIsAdmin);
        setViewKovetoim(response.viewKovetoim);
        setViewKoveteseim(response.viewKoveteseim);
        setViewKovetoimList(response.viewKovetoimList);
        setViewKovetoimListKep(response.viewKovetoimListKep);
        setViewKoveteseimList(response.viewKoveteseimList);
        setViewKoveteseimListKep(response.viewKoveteseimListKep);
        setStory(response.story);
        setLegujabbStory(response.legujabbStory);
        setIsLoading(false);
      } else {
        const response = await adat.json();
        setError(response.msg);
        if (response.msg.includes("Token expired")) {
          logout();
        }
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
        setSuccess("Profil sikeresen mentve!");
        setInterval(() => {
          window.location.reload();
        }, 1500);
        setIsLoading(false);
      } else {
        const response = await response.json();
        setError(response.error);
        setIsLoading(false);
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
        setSuccess("Profil sikeresen bekövetve!");
        setIsLoading(false);
      } else {
        const data = await response.json();
        setError(data.msg);
        setIsLoading(false);
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
        setSuccess("Profil sikeresen kikövetve!");
        setIsLoading(false);
      } else {
        const data = await response.json();
        setError(data.msg);
        setIsLoading(false);
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

  const modalKovetoim = () => {
    setToggleKovetoim(!toggleKovetoim);
    SetToggleKoveteseim(false);
  };

  const modalKoveteseim = () => {
    SetToggleKoveteseim(!toggleKoveteseim);
    setToggleKovetoim(false);
  };

  if (toggleKovetoim || toggleKoveteseim) {
    document.body.classList.add("active-modal");
  } else {
    document.body.classList.remove("active-modal");
  }

  //DELETING STORIES
  const torol = (item) => {
    const { _id: id } = item;
    const adatTorol = async () => {
      try {
        const toroltAdat = await fetch(url + "/story", {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ id }),
        });

        if (toroltAdat.ok) {
          const modositottAdat = story.filter((item) => item._id !== id);
          setStory(modositottAdat);
          const data = await toroltAdat.json();
          setSuccess(data.msg);
          setInterval(() => {
            setSuccess(null);
          }, 3000);
        } else {
          const data = await toroltAdat.json();
          setError(data.msg);
        }
      } catch (error) {
        console.log(error.message);
      }
    };

    adatTorol();
    closeModal();
  };

  const deleteId = (id) => {
    const item = story.find((story) => story._id === id);
    openModal(item);
  };

  const openModal = (item) => {
    setShowModal(true);
    setItemToDelete(item);
  };

  const closeModal = () => {
    setShowModal(false);
    setItemToDelete(null);
  };

  const modalStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
      zIndex: 9999,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      maxWidth: "400px",
      maxHeight: "400px",
      margin: "auto",
      padding: "20px",
      backgroundColor: "fff",
      borderRadius: "2rem",
    },
  };

  return (
    <div className="profilom">
      {!isLoading ? <div></div> : <div className="loader"></div>}
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
                      alt="  "
                      style={{ opacity: 0.6 }}
                      className="profilomProfil"
                    />
                    <div className="profilomProfil" id="profilomSzerkesztes">
                      Szerkesztés
                    </div>
                  </div>
                ) : (
                  <img
                    src={`${viewProfilkep}`}
                    alt="  "
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
                {viewKoveteseim && (
                  <div>
                    <div className="kovetok">
                      <h4 style={{ cursor: "pointer" }} onClick={modalKovetoim}>
                        Követők: {viewKovetoim}
                      </h4>
                      <h4
                        style={{ cursor: "pointer" }}
                        onClick={modalKoveteseim}
                      >
                        Követés: {viewKoveteseim}
                      </h4>
                    </div>
                    <div className="kovetoGomb">
                      {felhasznalonev != viewFelhasznalonev ? (
                        kovetem === false ? (
                          <button onClick={bekovetes}>Követés</button>
                        ) : (
                          <button
                            onClick={kikovetes}
                            style={{
                              backgroundColor: "#f5f5f5",
                              color: "black",
                            }}
                          >
                            Követem
                          </button>
                        )
                      ) : (
                        ""
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="profilomBio_container">
              {viewFelhasznalonev == felhasznalonev && isEditing === true ? (
                <textarea
                  type="text"
                  onChange={(e) => setViewRolam(e.target.value)}
                  defaultValue={viewRolam}
                  style={{ backgroundColor: "#5756ae" }}
                />
              ) : (
                <textarea defaultValue={viewRolam} readOnly />
              )}
            </div>
            <div id="legujabbStoryTarto">
              {viewFelhasznalonev === felhasznalonev && legujabbStory ? (
                <div className="legujabbStory">
                  <div id="legujabbStoryMutato" className="bookTarto">
                    <Link to={`/story/${legujabbStory._id}`}>
                      <div className="book-container">
                        <div className="book">
                          <div className="front-content">
                            <img src={legujabbStory.boritokep} alt="" />
                          </div>
                          <div className="content">
                            <p className="heading">{legujabbStory.cim}</p>
                            <p className="leiras">{legujabbStory.leiras}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <h2>Legújabb sztorim</h2>
                  </div>
                </div>
              ) : (
                legujabbStory && (
                  <div id="legujabbStoryMutato" className="legujabbStory">
                    <Link to={`/story/${legujabbStory._id}`}>
                      <div className="book-container">
                        <div className="book">
                          <div className="front-content">
                            <img src={legujabbStory.boritokep} alt="" />
                          </div>
                          <div className="content">
                            <p className="heading">{legujabbStory.cim}</p>
                            <p className="leiras">{legujabbStory.leiras}</p>
                          </div>
                        </div>
                      </div>
                    </Link>
                    <h2>Legújabb sztorim</h2>
                  </div>
                )
              )}
            </div>
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
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
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
        {toggleKovetoim && (
          <div className="kovetesModal kovetokLista">
            <div className="kovetolistak-btnContainer">
              <button className="kovetolistak-btn" onClick={modalKovetoim}>
                X
              </button>
            </div>
            <div className="kovetokMutato">
              <h4 id="kovetoMutatoCim">
                {viewFelhasznalonev} követői({viewKovetoim})
              </h4>
              {viewKovetoimListKep &&
                viewKovetoimListKep.map((item, index) => (
                  <div className="egyKoveto" key={index}>
                    <img src={item} alt="" />
                    <a href={"/profil/" + viewKovetoimList[index]}>
                      <h4>{viewKovetoimList[index]}</h4>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}

        {toggleKoveteseim && (
          <div className="kovetesModal kovetesekLista">
            <button className="kovetolistak-btn" onClick={modalKoveteseim}>
              X
            </button>
            <div className="kovetokMutato">
              <h4 id="kovetoMutatoCim">
                {viewFelhasznalonev} követi({viewKoveteseim})
              </h4>
              {viewKoveteseimListKep &&
                viewKoveteseimListKep.map((item, index) => (
                  <div className="egyKoveto" key={index}>
                    <img src={item} alt="" />
                    <a href={"/profil/" + viewKoveteseimList[index]}>
                      <h4>{viewKoveteseimList[index]}</h4>
                    </a>
                  </div>
                ))}
            </div>
          </div>
        )}

        <div className="storyContainer">
          {story.map((story) =>
            viewFelhasznalonev === felhasznalonev ? (
              <div className="storyLink">
                <div className="book-container" id="user-book-container">
                  <div className="book">
                    {story.isPublished === true && (
                      <img
                        src="/images/verify.png"
                        id="publishedBagde"
                        hidden={showModal}
                      />
                    )}
                    <div className="front-content">
                      <img src={story.boritokep} alt="" />
                    </div>
                    <div className="content">
                      <Link to={`/story/${story._id}`}>
                        <p className="heading">{story.cim}</p>
                      </Link>
                      <p className="leiras">{story.leiras}</p>
                      <div className="storyIconsTarto">
                        <div id="storyIconEdit" className="storyIcons">
                          <Link to={`/updatestory/${story._id}`}>
                            <img
                              id="story_edit"
                              src="/images/story_edit.png"
                              alt=""
                            />
                          </Link>
                        </div>
                        <div id="storyIconDelete" className="storyIcons">
                          <img
                            id="story_delete"
                            src="/images/story_delete.png"
                            alt=""
                            onClick={() => deleteId(story._id)}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              story.isPublished === true && (
                <div className="storyLink">
                  <Link to={`/story/${story._id}`}>
                    <div className="book-container">
                      <div className="book">
                        <div className="front-content">
                          <img src={story.boritokep} alt="" />
                        </div>
                        <div className="content">
                          <p className="heading">{story.cim}</p>
                          <p className="leiras">{story.leiras}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </div>
              )
            )
          )}
        </div>
      </div>
      <Modal
        isOpen={showModal}
        onRequestClose={closeModal}
        contentLabel="Megerősítés"
        style={modalStyles}
        id="deleteModal"
      >
        <h2 id="deleteText">Biztos hogy törlöd az adatot?</h2>
        <div className="modal-buttons">
          <button onClick={() => torol(itemToDelete)}>Törlés</button>
          <button onClick={closeModal}>Mégsem</button>
        </div>
      </Modal>
    </div>
  );
};

export default User;
