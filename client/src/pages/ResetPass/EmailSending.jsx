import { useState, useContext } from "react";
import { RecoveryContext } from "./Reset";
import axios from "axios";
import config from "../../components/config";

const EmailSending = () => {
  const { setUniversalEmail, setPage, setKOD } = useContext(RecoveryContext);
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const url = config.URL;

  function elkuld() {
    setIsLoading(true);
    setError(null);
    setSuccess(null);
    const kod = Math.floor(Math.random() * 9000 + 1000);
    setKOD(kod);
    setUniversalEmail(email);

    axios
      .post(url + "/emailkuldes", {
        KOD: kod,
        email: email,
      })
      .then(() => setPage("code"))
      .catch(() => setError("Valami hiba történt"));
  }

  return (
    <div className="forms-container">
      <form onSubmit={elkuld} className="addcomp">
        <h2>Add meg az email címed!</h2>
        <div className="form-row">
          <input
            type="email"
            value={email}
            id="email"
            name="email"
            placeholder="Email-cím"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
            className="input"
          />
        </div>
        <div className="send-btn">
          <button disabled={isLoading} type="submit">
            Elküld
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default EmailSending;
