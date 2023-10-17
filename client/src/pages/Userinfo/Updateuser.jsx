import { useEffect, useState } from "react";

const Updateuser = () => {
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const profilkep = async () => {
    setIsLoading(true);
    setError(null);

    if (
      jelszo.trim() === "" ||
      jelszoismetles.trim() === "" ||
      email.trim() === ""
    ) {
      setError("Nem maradhat üres cella!");
      setIsLoading(false);
      return;
    }

    if (jelszo !== jelszoismetles) {
      setError("A jelszó nem egyezik!");
      setIsLoading(false);
      return;
    }

    const hashedPassword = await bcrypt.hash(jelszo, 10);

    const adat = await fetch(url + "/regisztral", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ felhasznalonev, email, jelszo: hashedPassword }),
    });

    if (!adat.ok) {
      const response = await adat.json();
      setIsLoading(false);
      setError(response.msg);
    } else {
      const response = await adat.json();
      console.log(hashedPassword);
      setSuccess(response.msg);
      setIsLoading(false);
    }
  };

  const ShowProfil = async (event) => {
    event.preventDefault();
    await profilkep();
  };
  return <div></div>;
};

export default Updateuser;
