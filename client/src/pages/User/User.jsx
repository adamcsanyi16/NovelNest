import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from 'react-router-dom';

const User = () => {
  const { user } = useAuthContext();
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const { felhasznalonevKuld } = useParams();
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [viewFelhasznalonev, setViewFelhasznalonev] = useState("");
  const [viewEmail, setViewEmail] = useState("");
  const [viewProfilkep, setViewProfilkep] = useState("");
  const [viewRolam, setViewRolam] = useState("");
  const [viewIsAdmin, setViewIsAdmin] = useState("");
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
          setFelhasznalonev(felhasznalonev);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev, felhasznalonevKuld]);

  const userinfo = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const adat = await fetch(
        url + `/userinfo/${felhasznalonevKuld}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      if (adat.ok) {
        const response = await adat.json();
        setViewFelhasznalonev(response.viewFelhasznalonev);
        setViewEmail(response.viewEmail);
        setViewProfilkep(response.viewProfilkep);
        setViewRolam(response.viewRolam)
        setViewIsAdmin(response.viewIsAdmin)

        console.log(response);
      } else {
        const response = await adat.json();
        setError(response.msg)
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while fetching data.");
    }
  };


  const valtoztatas = async () => {
    try {
      const response = await fetch(url + `/userupdate`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          felhasznalonev: felhasznalonev,
          email: viewEmail,
          rolam: viewRolam,
        }),
      });

      if (response.ok) {
        setSuccess("Changes saved successfully!");
        console.log("mentve");
      } else {
        const response = await response.json();
        setError(response.error);
      }
    } catch (error) {
      setError("An error occurred while saving changes.");
    }
  };

  useEffect(() => {
    userinfo();
  }, [user, felhasznalonev, felhasznalonevKuld]);

  return (
    <div className="profilom">
        <div className="profilomHatter">
          <div className="profilomInfo_Tarto">
        <div className="profilomInfo_container">
          <input type="file" />
                {viewProfilkep && (
                  <div>
                  <input type="file" accept="image/*" className="file-input"/>
                <img
                  src={`data:image/jpeg;base64,${viewProfilkep}`}
                  alt="Profilkép"
                  className="profilomProfil"
                /></div>
                )}
              <div className="profilomFelhasznalonev">
                <h2>{ viewFelhasznalonev }</h2>
                {viewFelhasznalonev == felhasznalonev && (
                  <input type="text" value={viewEmail} onChange={(e) => setViewEmail(e.target.value)}></input>
                )}
                <h4>Követők: 34</h4>
                {viewIsAdmin &&(
                  <h5>Admin😎</h5>
                )}
                </div>
            </div>
            <div className="profilomBio_container">
              {viewFelhasznalonev == felhasznalonev ?
              <textarea type="text" onChange={(e) => setViewRolam(e.target.value)} defaultValue={viewRolam} />  :
                <textarea defaultValue={viewRolam} readOnly />
              }
            {viewFelhasznalonev == felhasznalonev && (
              <button onClick={valtoztatas}>Mentés</button>
              )}
              {error && <div className="error">{error}</div>}
              {success && <div className="success">{success}</div>}
            </div>
            </div>
            
          </div>
    </div>
  );
};

export default User;