import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Addstory = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [cim, setCim] = useState("");
  const [szerzo, setSzerzo] = useState("");
  const [boritokep, setBoritokep] = useState("");
  const [story, setStory] = useState("");
  const [karakterek, setKarakterek] = useState("");
  const [nyelv, setNyelv] = useState("");
  const [kategoria, setKategoria] = useState("");
  const url = "http://localhost:3500";

  const feldolgoz = (event) => {
    event.preventDefault();

    if (!user) {
      setError("Nem vagy bejelentkzve!");
      return;
    }

    const adatok = {
      cim,
      szerzo,
      boritokep,
      story,
      karakterek,
      nyelv,
      kategoria,
    };

    const elkuld = async () => {
      setIsLoading(true);
      setError(null);
      setSuccess(null);

      const adat = await fetch(url + "/addstory", {
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

  useEffect(() => {
    setSzerzo(user.felhasznalonev);
  }, [user]);

  return (
    <div className="form-container">
      <form onSubmit={feldolgoz} className="storyform">
        <div className="form-row">
          <input
            type="file"
            accept="image/*"
            className="input"
            onChange={(e) => setBoritokep(e.target.value)}
          />
        </div>
      </form>
      <form onSubmit={feldolgoz} className="storyform">
        <div className="form-row">
          <input
            type="text"
            placeholder="Történet címe"
            className="input"
            onChange={(e) => setCim(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Szerző"
            value={szerzo}
            className="input"
            readOnly
            onChange={(e) => setSzerzo(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Kategória"
            className="input"
            onChange={(e) => setKategoria(e.target.value)}
          />
        </div>
        <div className="form-row">
          <textarea
            type="text"
            placeholder="Kezd el a történetedet!"
            className="input"
            onChange={(e) => setStory(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Karakterek"
            className="input"
            onChange={(e) => setKarakterek(e.target.value)}
          />
        </div>
        <div className="form-row">
          <input
            type="text"
            placeholder="Nyelv"
            className="input"
            onChange={(e) => setNyelv(e.target.value)}
          />
        </div>
        <div className="button-row">
          <button disabled={isLoading} type="submit">
            Felvesz
          </button>
        </div>
        {error && <div className="error">{error}</div>}
        {success && <div className="success">{success}</div>}
      </form>
    </div>
  );
};

export default Addstory;
