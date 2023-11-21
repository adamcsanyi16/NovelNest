import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import { io } from "socket.io-client";

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
  const [sajatErtekeles, SetSajatErtekeles] = useState("");

  const userLocalStorage = JSON.parse(localStorage.getItem("user"));
  const token = userLocalStorage.token;
  console.log(token);
  const socket = io.connect("http://localhost:3500", {
    query: { token: token },
  });

  socket.on("connect_error", (error) => {
    console.error("Socket.io connection error:", error);
  });

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

  const ertekeles = async () => {
    try {
      console.log("ertekeles");
      const adat = await fetch(url + "/ertekeles", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ id, felhasznalonev, sajatErtekeles }),
      });
    } catch (error) {
      setError("Valami hiba történt a mentés során!" + error.message);
    }
  };

  const hozzaszolasKuld = () => {
    console.log(hozzaszolas);
    socket.emit("ujhozzaszolas", id, hozzaszolas, felhasznalonev);
  };

  socket.on("hozzaszolasError", (error) => {
    console.log("Error during hozzaszolas:", sajt);
    // Handle the error on the client side
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
            <input type="radio" id="star-1" name="star-radio" value="star-1" />
            <label for="star-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                  SetSajatErtekeles(5);
                  ertekeles();
                }}
              >
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                ></path>
              </svg>
            </label>
            <input type="radio" id="star-2" name="star-radio" value="star-1" />
            <label for="star-2">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                  SetSajatErtekeles(4);
                  ertekeles();
                }}
              >
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                ></path>
              </svg>
            </label>
            <input type="radio" id="star-3" name="star-radio" value="star-1" />
            <label for="star-3">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                  SetSajatErtekeles(3);
                  ertekeles();
                }}
              >
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                ></path>
              </svg>
            </label>
            <input type="radio" id="star-4" name="star-radio" value="star-1" />
            <label for="star-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                  SetSajatErtekeles(2);
                  ertekeles();
                }}
              >
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                ></path>
              </svg>
            </label>
            <input type="radio" id="star-5" name="star-radio" value="star-1" />
            <label for="star-5">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                onClick={() => {
                  SetSajatErtekeles(1);
                  ertekeles();
                }}
              >
                <path
                  pathLength="360"
                  d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z"
                ></path>
              </svg>
            </label>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Onestory;
