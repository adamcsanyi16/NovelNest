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

  useEffect(() => {
    userinfo();
  }, [user, felhasznalonev, felhasznalonevKuld]);

  return (
    <div className="profilom">
        <div className="profilomHatter">
          <div className="profilomInfo_Tarto">
        <div className="profilomInfo_container">
                {viewProfilkep && (
                <img
                  src={`data:image/jpeg;base64,${viewProfilkep}`}
                  alt="Profilkép"
                  className="profilomProfil"
                />
                )}
              <div className="profilomFelhasznalonev">
                <h2>{ viewFelhasznalonev }</h2>
                {viewFelhasznalonev == felhasznalonev && (
                  <p type="text" contenteditable="true" >{viewEmail}</p>
                )}
                <h4>Követők: 34</h4>
                {viewIsAdmin &&(
                  <h5>Admin😎</h5>
                )}
                </div>
            </div>
            <div className="profilomBio_container">
              {viewFelhasznalonev == felhasznalonev ?
                <textarea type="text" defaultValue={viewRolam} /> :
                <textarea defaultValue={viewRolam} readOnly />
              }
            </div>
            <button>Változások mentése</button>
            </div>
          </div>
    </div>
  );
};

export default User;
