import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import bcrypt from "bcryptjs";

const Login = () => {
  const [email, setEmail] = useState("");
  const [jelszo, setJelszo] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { dispatch } = useAuthContext();
  const url = "http://localhost:3500";

  const navigate = useNavigate();

  const belep = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    if (jelszo.trim() === "" || email.trim() === "") {
      setError("Nem maradhat üres cella!");
      setIsLoading(false);
      return;
    }

    const data = await fetch(url + "/belepesJelszo", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    if (data.ok) {
      const response = await data.json();
      const talalat = await bcrypt.compare(jelszo, response.msg);
      if (talalat) {
        const adat = await fetch(url + "/belepes", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        });

        if (!adat.ok) {
          const response = await adat.json();
          setIsLoading(false);
          setError(response.msg);
        } else {
          const response = await adat.json();
          setSuccess(response.msg);
          localStorage.setItem("user", JSON.stringify(response));
          dispatch({ type: "LOGIN", payload: response });
          setIsLoading(false);
        }
      } else {
        setError("A jelszó nem egyezik!");
        setIsLoading(false);
      }
    } else {
      const response = await data.json();
      setError(response.msg);
      setIsLoading(false);
    }
  };

  const belepes = async (event) => {
    event.preventDefault();
    await belep();
  };

  return (
    <div className="forms-container">
      <form onSubmit={belepes}>
        <h2>Belépés</h2>
        <div className="form-row">
          <input
            type="text"
            id="email"
            name="email"
            placeholder="Email-cím"
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="off"
          />
        </div>
        <div className="form-row">
          <input
            type="password"
            id="jelszo"
            name="jelszo"
            placeholder="Jelszó"
            onChange={(e) => setJelszo(e.target.value)}
          />
        </div>
        <div className="button-container">
          <Link to={"/regisztracio"}>Még nincs fiókod? Regisztrálj!</Link>
          <button type="submit" disabled={isLoading}>
            Belépés
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default Login;
