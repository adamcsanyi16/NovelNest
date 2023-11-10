import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuthContext } from "../../hooks/useAuthContext";

const Onestory = () => {
  const url = "http://localhost:3500";
  const { user } = useAuthContext();
  const { id } = useParams();
  const [felhasznalonev, setFelhasznalonev] = useState("");

  const [cim, setCim] = useState("");
  const [szerzo, setSzerzo] = useState("");
  const [boritokep, setBoritokep] = useState("");
  const [leiras, setLeiras] = useState("");
  const [karakterek, setKarakterek] = useState("");
  const [nyelv, setNyelv] = useState("");
  const [kategoria, setKategoria] = useState("");
  const [story, SetStory] = useState("");

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
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, id]);
  return (
    <div className="oneStory-container">
      <div className="info">
        <div className="boritokep">
          <img src={boritokep} alt="" />
        </div>
        <Link to={`/profil/${szerzo}`}>
          <h3>{szerzo}</h3>
        </Link>
        <p>{karakterek}</p>
      </div>
      <div className="onlystory">
        <h1>{cim}</h1>
        <p>{story}</p>
      </div>
    </div>
  );
};

export default Onestory;
