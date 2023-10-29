import { useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Addcategory = () => {
  const [kategoria, setKategoria] = useState("");
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuthContext();
  const url = "http://localhost:3500";

  const feldolgoz = (event) => {
    event.preventDefault();

    if (!user) {
      setError("Nem vagy bejelentkezve!");
      return;
    }

    const adatok = {
      kategoria,
    };

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch(url + "/kategoria", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(adatok),
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

  const torles = async (e) => {
    e.preventDefault();
    setKategoria("");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="form-container">
      <form onSubmit={feldolgoz} className="addcategory">
        <h2>Vedd fel az kategóriát!</h2>
        <div className="form-row">
          <input
            type="text"
            placeholder="Kategória neve"
            value={kategoria}
            className="input"
            onChange={(e) => setKategoria(e.target.value)}
          />
        </div>
        <div className="button-row">
          <button disabled={isLoading} type="submit">
            Felvesz
          </button>
          <button disabled={isLoading} onClick={torles}>
            Törlés
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default Addcategory;
