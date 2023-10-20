import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Addstory = () => {
  const { user } = useAuthContext();
  const [felhasznalonev, setFelhasznalonev] = useState("");
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
          setSzerzo(felhasznalonev);
          setFelhasznalonev(felhasznalonev);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev]);

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

  return (
    <div className="form-container">
      <form onSubmit={feldolgoz} className="storyform" id="file-storyform">
        <div class="card">
          <div class="card__content">
            <input
              type="file"
              accept="image/*"
              className="file-input"
              onChange={(e) => setBoritokep(e.target.value)}
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="1em"
              height="1em"
              stroke-linejoin="round"
              stroke-linecap="round"
              viewBox="0 0 24 24"
              stroke-width="2"
              fill="none"
              stroke="currentColor"
              className="icon"
            >
              <polyline points="16 16 12 12 8 16"></polyline>
              <line y2="21" x2="12" y1="12" x1="12"></line>
              <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path>
              <polyline points="16 16 12 12 8 16"></polyline>
            </svg>
          </div>
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
        <div className="form-row">
          <textarea
            type="text"
            placeholder="Kezd el a történetedet!"
            className="input"
            id="storyText"
            onChange={(e) => setStory(e.target.value)}
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
