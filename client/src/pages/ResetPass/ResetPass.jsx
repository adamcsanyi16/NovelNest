import { useState, useContext } from "react";
import { Link } from "react-router-dom";
import { RecoveryContext } from "./Reset";
import config from "../../components/config";

const ResetPass = () => {
  const { universalEmail } = useContext(RecoveryContext);
  const [jelszo, setJelszo] = useState("");
  const [jelszoismetles, setJelszoismetles] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const url = config.URL;

  const valtoztat = (event) => {
    event.preventDefault();

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch(url + "/valtoztat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ universalEmail, jelszo, jelszoismetles }),
      });

      if (adat.ok) {
        const response = await adat.json();
        setIsLoading(false);
        setSuccess(response.msg);
      } else {
        const response = await adat.json();
        setIsLoading(false);
        setError(response.msg);
      }
    };

    elkuld();
  };

  return (
    <div className="forms-container">
      <form onSubmit={valtoztat}>
        <h2>Írd be az új jelszavad!</h2>
        <div className="form-row">
          <input
            type="password"
            id="jelszo"
            name="jelszo"
            placeholder="Jelszó"
            autoComplete="off"
            className="input"
            onChange={(e) => setJelszo(e.target.value)}
          />
        </div>

        <div className="form-row">
          <input
            type="password"
            id="jelszoismetles"
            name="jelszoismetles"
            placeholder="Jelszó ismét"
            autoComplete="off"
            className="input"
            onChange={(e) => setJelszoismetles(e.target.value)}
          />
        </div>
        <div className="send-btn">
          <button type="submit" disabled={isLoading}>
            Változtat
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && (
          <div className="success">
            {success}
            <Link to={"/belepes"}>Vissza a belépéshez</Link>
          </div>
        )}
      </form>
    </div>
  );
};

export default ResetPass;
