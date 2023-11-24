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
          SetIsLoading(false);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, id]);

  const ertekeles = () => {
    socket.emit("ujErtekeles", { id, felhasznalonev, sajatErtekeles });
  };

  const hozzaszolasKuld = () => {
    socket.emit("ujHozzaszolas", { id, felhasznalonev, hozzaszolas });
  };

  socket.on("error", (msg) => {
    setError(msg);
  });

  socket.on("success", (msg) => {
    setSuccess(msg);
  });

  const hozzaszolasLeker = () => {
    socket.emit("hozzaszolasokLeker", id);
  };

  socket.on("hozzaszolasok", (hozzaszolasok) => {
    if (id == hozzaszolasok.id) {
      console.log(hozzaszolasok);
      SetOsszesHozzaszolas(hozzaszolasok);
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
          <p>{sajatErtekeles}⭐</p>
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
        </div>
        <div className="onlystory">
          <h1>{cim}</h1>
          <p>{story}</p>
          <div className="comments">
            <h3>Hozzászólások</h3>
            <input
              className="input"
              id="commentInput"
              type="text"
              placeholder="Hozzászólás írása"
              onChange={(e) => SetHozzaszolas(e.target.value)}
            />
            <button onClick={hozzaszolasKuld}>Yaay</button>
            <button onClick={hozzaszolasLeker}>Leker</button>
          </div>
          {success && <div className="success">{success}</div>}
          {error && <div className="error">{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default Onestory;
