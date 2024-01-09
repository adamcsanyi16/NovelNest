import { useState, useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { RecoveryContext } from "./Reset";
import axios from "axios";
import config from "../../components/config";

const CodeAuth = () => {
  const { universalEmail, setPage, KOD } = useContext(RecoveryContext);
  const [timer, setTimer] = useState(30);
  const [disable, setDisable] = useState(true);
  const [KODinput, setKODinput] = useState([0, 0, 0, 0]);
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const url = config.URL;

  function ujrakuld() {
    if (disable) {
      return;
    }
    axios
      .post(url + "/emailkuldes", {
        KOD: KOD,
        email: universalEmail,
      })
      .then(() => setDisable(true))
      .then(() => setSuccess("Az új kódod el lett küldve!"))
      .then(() => setTimer(30))
      .catch(() => setError("Valami hiba tortént!"));
  }

  function KODhitelesites() {
    if (parseInt(KODinput.join("")) === KOD) {
      setPage("reset");
      return;
    }
    setError("Nem jó kódot adtál meg! Próbáld meg újra!");
    return;
  }

  useEffect(() => {
    let interval = null;

    if (disable) {
      interval = setInterval(() => {
        setTimer((lastTimerCount) => {
          if (lastTimerCount <= 1) {
            clearInterval(interval);
            setDisable(false);
            setSuccess(null);
          }
          return lastTimerCount - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [disable]);

  return (
    <div className="forms-container">
      <form className="addcomp">
        <h2 id="KOD">Írd be a megkapott kódot!</h2>
        <p>Egy kódot küldtünk erre az email címre {universalEmail}</p>
        <div className="reset-row">
          <input
            type="text"
            className="input"
            name=""
            onChange={(e) =>
              setKODinput([
                e.target.value,
                KODinput[1],
                KODinput[2],
                KODinput[3],
              ])
            }
          />
          <input
            type="text"
            className="input"
            name=""
            onChange={(e) =>
              setKODinput([
                KODinput[0],
                e.target.value,
                KODinput[2],
                KODinput[3],
              ])
            }
          />
          <input
            type="text"
            className="input"
            name=""
            onChange={(e) =>
              setKODinput([
                KODinput[0],
                KODinput[1],
                e.target.value,
                KODinput[3],
              ])
            }
          />
          <input
            type="text"
            className="input"
            name=""
            onChange={(e) =>
              setKODinput([
                KODinput[0],
                KODinput[1],
                KODinput[2],
                e.target.value,
              ])
            }
          />
        </div>
        <div className="reset-btn">
          <button onClick={KODhitelesites}>Hitelesít</button>
        </div>
        <div className="reset-link">
          <p>Nem kaptad meg a kódot?</p>
          <Link
            onClick={ujrakuld}
            style={{
              color: disable ? "#4d471bc9" : "#998d33c9",
              cursor: disable ? "none" : "pointer",
              textDecorationLine: disable ? "none" : "underline",
            }}
          >
            {disable ? `Újraküldés (${timer})` : "Újraküldés"}
          </Link>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default CodeAuth;
