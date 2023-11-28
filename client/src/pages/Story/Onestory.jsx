import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { io } from "socket.io-client";

const socket = io.connect("http://localhost:3500");

const Onestory = () => {
  const url = "http://localhost:3500";
  const { user } = useAuthContext();
  const { id } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [isLoading, SetIsLoading] = useState(false);

  const [cim, setCim] = useState("");
  const [szerzo, setSzerzo] = useState("");
  const [boritokep, setBoritokep] = useState("");
  const [leiras, setLeiras] = useState("");
  const [karakterek, setKarakterek] = useState("");
  const [nyelv, setNyelv] = useState("");
  const [kategoria, setKategoria] = useState("");
  const [story, SetStory] = useState("");
  const [hozzaszolas, SetHozzaszolas] = useState("");
  const [osszesHozzaszolas, SetOsszesHozzaszolas] = useState([]);
  const [sajatErtekeles, SetSajatErtekeles] = useState("");
  const [star1Src, SetStar1Src] = useState("/images/star.png");
  const [star2Src, SetStar2Src] = useState("/images/star.png");
  const [star3Src, SetStar3Src] = useState("/images/star.png");
  const [star4Src, SetStar4Src] = useState("/images/star.png");
  const [star5Src, SetStar5Src] = useState("/images/star.png");
  const [atlagErtekeles, SetAtlagErtekeles] = useState(null);
  const [isRated, SetIsRated] = useState(false);
  const [ertekelok, setErtekelok] = useState([]);

  const userLocalStorage = JSON.parse(localStorage.getItem("user"));
  const token = userLocalStorage.token;

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
  }, [user, felhasznalonev]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(url + "/hozzaszolas", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          const data = await response.json();
          SetOsszesHozzaszolas(data.hozzaszolas);
        } else {
          const data = await response.json();
          setError(data.msg);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev]);

  useEffect(() => {
    SetIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(url + "/onestory", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
          body: JSON.stringify({ id }),
        });

        if (response.ok) {
          const data = await response.json();
          const onestory = data.onestory[0];
          setCim(onestory.cim);
          setSzerzo(onestory.szerzo);
          setBoritokep(onestory.boritokep);
          setKarakterek(onestory.karakterek);
          setKategoria(onestory.kategoria);
          setNyelv(onestory.nyelv);
          setLeiras(onestory.leiras);
          SetStory(onestory.story);
          const osszesErtekelesTomb = onestory.ertekelesek;
          const ertekelesek = [];
          const ertekelok = [];
          osszesErtekelesTomb.forEach((ertekeles) => {
            ertekelesek.push(ertekeles.ertekeles);
            ertekelok.push(ertekeles.felhasznalonev);
          });
          setErtekelok(ertekelok);
          const avgRating =
            ertekelesek.reduce((a, b) => a + b, 0) / ertekelesek.length;
          SetAtlagErtekeles(Math.round(avgRating * 10) / 10);
          SetIsLoading(false);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, id]);

  const ertekeles = () => {
    if (ertekelok.includes(felhasznalonev)) {
      setError("Te már értékelted ezt a történetet!");
      setTimeout(() => {
        setError("");
      }, 2000);
      SetIsRated(true);
    } else {
      socket.emit("newrating", { id, felhasznalonev, sajatErtekeles });
      SetIsLoading(true);
    }
  };

  const hozzaszolasKuld = () => {
    if (hozzaszolas.trim() === "") {
    } else {
      socket.emit("ujHozzaszolas", { id, felhasznalonev, hozzaszolas });
      SetHozzaszolas("");
    }
  };

  socket.on("rating", (msg) => {
    if (id === msg.id) {
      const osszesErtekelesTomb = msg.osszesErtekelesTomb;
      const ertekelesek = [];
      const ertekelok = [];
      osszesErtekelesTomb.forEach((ertekeles) => {
        ertekelesek.push(ertekeles.ertekeles);
      });
      osszesErtekelesTomb.forEach((ertekeles) => {
        ertekelok.push(ertekeles.felhasznalonev);
      });
      const avgRating =
        ertekelesek.reduce((a, b) => a + b, 0) / ertekelesek.length;
      if (ertekelok.includes(felhasznalonev)) {
        SetIsRated(true);
      }
      SetAtlagErtekeles(Math.round(avgRating * 10) / 10);
      SetIsLoading(false);
    }
  });

  socket.on("error", (msg) => {
    setError(msg);
  });

  socket.on("success", (msg) => {
    setSuccess(msg);
  });

  socket.on("hozzaszolasok", (msg) => {
    if (id == msg.id) {
      SetOsszesHozzaszolas(msg.hozzaszolasok);
    }
  });

  return (
    <div>
      {!isLoading ? <div></div> : <div className="loader"></div>}

      <div className="oneStory-container">
        <div className="info">
          <div className="boritokep">
            <img src={boritokep} alt="" />
          </div>
          <Link to={`/profil/${szerzo}`}>
            <h3>{szerzo}</h3>
          </Link>
          <p>{karakterek}</p>
          {atlagErtekeles > 0 ? (
            <div>
              <p style={{ marginTop: 5 }}>{atlagErtekeles}⭐</p>
            </div>
          ) : (
            <div>
              <p style={{ marginTop: 5 }}>⭐Értékeld te először⭐</p>
            </div>
          )}
          {isRated == true ? (
            <div></div>
          ) : (
            <div className="rating">
              <img
                onClick={() => {
                  SetStar1Src("/images/starfilled.png");
                  SetStar2Src("/images/star.png");
                  SetStar3Src("/images/star.png");
                  SetStar4Src("/images/star.png");
                  SetStar5Src("/images/star.png");
                  SetSajatErtekeles(1);
                }}
                src={star1Src}
                alt=""
              />
              <img
                onClick={() => {
                  SetStar1Src("/images/starfilled.png");
                  SetStar2Src("/images/starfilled.png");
                  SetStar3Src("/images/star.png");
                  SetStar4Src("/images/star.png");
                  SetStar5Src("/images/star.png");
                  SetSajatErtekeles(2);
                }}
                src={star2Src}
                alt=""
              />
              <img
                onClick={() => {
                  SetStar1Src("/images/starfilled.png");
                  SetStar2Src("/images/starfilled.png");
                  SetStar3Src("/images/starfilled.png");
                  SetStar4Src("/images/star.png");
                  SetStar5Src("/images/star.png");
                  SetSajatErtekeles(3);
                }}
                src={star3Src}
                alt=""
              />
              <img
                onClick={() => {
                  SetStar1Src("/images/starfilled.png");
                  SetStar2Src("/images/starfilled.png");
                  SetStar3Src("/images/starfilled.png");
                  SetStar4Src("/images/starfilled.png");
                  SetStar5Src("/images/star.png");
                  SetSajatErtekeles(4);
                }}
                src={star4Src}
                alt=""
              />
              <img
                onClick={() => {
                  SetStar1Src("/images/starfilled.png");
                  SetStar2Src("/images/starfilled.png");
                  SetStar3Src("/images/starfilled.png");
                  SetStar4Src("/images/starfilled.png");
                  SetStar5Src("/images/starfilled.png");
                  SetSajatErtekeles(5);
                }}
                src={star5Src}
                alt=""
              />
              <button onClick={ertekeles}>Értékelés</button>
            </div>
          )}

          {error && <div className="error">{error}</div>}
          <div className="comments">
            <h3>Hozzászólások ({osszesHozzaszolas.length})</h3>
            <div className="allComments">
              <table>
                {osszesHozzaszolas.reverse().map((comment) => (
                  <tr>
                    <td>
                      <Link to={`/profil/${comment.felhasznalonev}`}>
                        <b>{comment.felhasznalonev}</b>
                      </Link>
                      : <i>{comment.hozzaszolas}</i>
                    </td>
                  </tr>
                ))}
              </table>
            </div>
            <div className="commentInputContainer">
              <input
                className="input"
                id="commentInput"
                value={hozzaszolas}
                type="text"
                placeholder="Hozzászólás írása"
                onChange={(e) => SetHozzaszolas(e.target.value)}
                autoComplete="off"
              />
              <button id="commentButton" onClick={hozzaszolasKuld}>
                Küldés
              </button>
            </div>
          </div>
        </div>
        <div className="onlystory">
          <h1>{cim}</h1>
          <p>{story}</p>
        </div>
      </div>
    </div>
  );
};

export default Onestory;
