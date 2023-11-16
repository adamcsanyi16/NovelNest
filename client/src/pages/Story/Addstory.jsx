import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";
import Select from "react-select";

const Addstory = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [toggleForm, setToggleForm] = useState(false);
  const [published, setPublished] = useState(false);

  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [cim, setCim] = useState("");
  const [szerzo, setSzerzo] = useState("");
  const [boritokep, setBoritokep] = useState("");
  const [leiras, setLeiras] = useState("");
  const [karakterek, setKarakterek] = useState("");
  const [nyelv, setNyelv] = useState("");
  const [kategoria, setKategoria] = useState("");
  const [story, SetStory] = useState("");

  const [dropdownKategoria, setDropDownKategoria] = useState("");
  const [dropdownNyelv, setDropDownNyelv] = useState("");
  const url = "http://localhost:3500";

  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchDropdownCategory = async () => {
      try {
        const adat = await fetch(url + "/kategoria", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const response = await adat.json();
          const CategoryOptions = response.kategoria.map((option) => ({
            label: option.kategoria,
            value: option.kategoria,
          }));
          setDropDownKategoria(CategoryOptions);
        } else {
          const response = await adat.json();
          setError(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownCategory();
  }, [user]);

  useEffect(() => {
    const fetchDropdownLanguage = async () => {
      try {
        const adat = await fetch(url + "/nyelv", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (adat.ok) {
          const response = await adat.json();
          const LanguageOptions = response.nyelv.map((option) => ({
            label: option.nyelv,
            value: option.nyelv,
          }));
          setDropDownNyelv(LanguageOptions);
        } else {
          const response = await adat.json();
          setError(response.msg);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchDropdownLanguage();
  }, [user]);

  const handleDropdownCategory = (selectedOption) => {
    setKategoria(selectedOption.value);
  };

  const handleDropdownLanguage = (selectedOption) => {
    setNyelv(selectedOption.value);
  };

  const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      lineHeight: "28px",
      border: state.isFocused ? "3px solid #f99417" : "3px solid transparent",
      borderBottomColor: "#f99417",
      borderRadius: state.isFocused ? "1rem" : "0",
      outline: state.isFocused && "none",
      width: "200%",
      backgroundColor: "transparent",
      borderColor: state.isFocused ? "#f99417" : "transparent",
      color: "#363062",
      transition:
        "border-color 0.3s cubic-bezier(0.645, 0.045, 0.355, 1), padding 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
      transform: "scale(1)",
      "&:hover": {
        borderColor: "#f99417",
        borderRadius: "1rem",
      },
      fontFamily: '"Martian Mono", monospace',
      fontSize: "9px",
    }),
    singleValue: (provided) => ({
      ...provided,
      color: "#363062",
      fontFamily: '"Martian Mono", monospace',
      fontSize: "9px",
    }),
    placeholder: (provided, state) => ({
      ...provided,
      opacity: state.isFocused ? 0 : 1,
      transition: "opacity 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)",
      color: "#2c3639",
      fontFamily: '"Martian Mono", monospace',
      fontSize: "11px",
    }),
  };

  const tovabb = () => {
    setToggleForm(!toggleForm);
  };

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
      leiras,
      karakterek,
      nyelv,
      kategoria,
      story,
      published,
    };
    if (toggleForm == true) {
      const elkuld = async () => {
        setIsLoading(true);
        setError(null);
        setSuccess(null);

        if (
          cim.trim() === "" ||
          szerzo.trim() === "" ||
          boritokep.trim() === "" ||
          leiras.trim() === "" ||
          karakterek.trim() === "" ||
          nyelv.trim() === "" ||
          kategoria.trim() === "" ||
          story.trim() === ""
        ) {
          setError("Nem maradhat üres cella!");
          setIsLoading(false);
          return;
        }

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
          navigate(`/profil/${felhasznalonev}`);
        } else {
          const response = await adat.json();
          setIsLoading(false);
          setError(response.msg);
        }
      };

      elkuld();
    }
  };

  const publikalas = (e) => {
    setPublished(true);
    feldolgoz(e);
  };

  function displayImage(e) {
    const fileInput = e.target;

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();

      reader.onload = function (e) {
        setBoritokep(e.target.result);
      };

      reader.readAsDataURL(fileInput.files[0]);
    }
  }

  function resetPic() {
    setBoritokep("");
  }

  return (
    <div className="storyfelv">
      {!toggleForm ? (
        <div className="form-container">
          <form onSubmit={feldolgoz} className="storyform" id="file-storyform">
            <div class="card">
              <div class="card__content">
                <input
                  value={""}
                  type="file"
                  accept="image/*"
                  className="file-input"
                  onChange={(e) => displayImage(e)}
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
                {boritokep && <img src={boritokep} alt="Uploaded Image" />}
              </div>
              <span>Ajánlott képméret 300x400px</span>
              <button id="reset" onClick={resetPic}>
                Töröl
              </button>
            </div>
          </form>
          <form onSubmit={feldolgoz} className="storyform">
            <div className="form-row">
              <input
                value={cim}
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
            <div className="form-row" id="select-row">
              <Select
                defaultInputValue={kategoria}
                className="custom-select"
                placeholder="Kategória"
                styles={selectStyles}
                options={dropdownKategoria}
                onChange={handleDropdownCategory}
              />
              <Select
                defaultInputValue={nyelv}
                className="custom-select"
                placeholder="Nyelv"
                styles={selectStyles}
                options={dropdownNyelv}
                onChange={handleDropdownLanguage}
              />
            </div>
            <div className="form-row">
              <input
                value={karakterek}
                type="text"
                placeholder="Karakterek"
                className="input"
                onChange={(e) => setKarakterek(e.target.value)}
              />
            </div>
            <div className="form-row">
              <textarea
                maxLength="150"
                value={leiras}
                type="text"
                placeholder="Írd le röviden miről fog szólni a történeted!"
                className="input"
                id="leirasText"
                onChange={(e) => setLeiras(e.target.value)}
              />
            </div>
            <div className="button-row">
              <button disabled={isLoading} onClick={tovabb}>
                Tovább
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="addstory-container">
          <div className="textarea">
            <textarea
              type="text"
              onChange={(e) => SetStory(e.target.value)}
              className="input"
              id="storyText"
            />
          </div>
          <div className="buttons">
            <button onClick={tovabb}>Vissza</button>
            <button onClick={feldolgoz}>Mentés</button>
            <button onClick={publikalas}>Mentés és publikálás</button>
          </div>
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </div>
      )}
    </div>
  );
};

export default Addstory;
