import { useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

const Updateuser = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [email, setEmail] = useState("");
  const [profilkep, setProfilkep] = useState("");
  const { user } = useAuthContext();
  const url = "http://localhost:3500";

  const userinfo = async () => {
    setIsLoading(true);
    setError(null);
  
    try {
      const adat = await fetch(url + `/userinfo?felhasznalonev=${user.felhasznalonev}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      });
    
      if (adat.ok) {
        const response = await adat.json();
        setFelhasznalonev(response.felhasznalonev)
        setEmail(response.email)
        setProfilkep(response.profilkep)

        console.log(response);
      }
      else {
        const response = await adat.json();
        console.log(response.msg);
      }
    } catch (error) {
      setIsLoading(false);
      setError("An error occurred while fetching data.");
    }
  };
  

  const showUserinfo = async (event) => {
    event.preventDefault();
    await userinfo();
  };

  return ( 
    <div>
      <center>
      <table>
      <tbody>
        <tr>
        <td>Felhasználónév: </td>
        <td><input type="text" defaultValue={ felhasznalonev } /></td>
        </tr>
        <tr>
        <td>Email: </td>
        <td>{ email }</td>
        </tr>
        <tr>
        <td>Profilkép: </td>
        <td><img
              src={`data:image/jpeg;base64,${profilkep}`}
              alt="Profilkép"
              className="profile-image"
            /></td>
        </tr>
        </tbody>
        </table>

      
      <button onClick={showUserinfo}>nyomj meg</button>
      </center>
    </div>
  );
};

export default Updateuser;
