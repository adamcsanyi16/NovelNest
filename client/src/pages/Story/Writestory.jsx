import { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useParams } from "react-router-dom";

const Writestory = () => {
  const { user } = useAuthContext();
  const { cim } = useParams();

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [story, setStory] = useState("");

  const writestory = async () => {
    setIsLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const adat = await fetch(url + `/writestory/${cim}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          story: story,
        }),
      });
      if (adat.ok) {
        const response = await adat.json();
        setSuccess(response.msg);
        setIsLoading(false);
      } else {
        const response = await adat.json();
        setError(response.msg);
        setIsLoading(false);
      }
    } catch (error) {
      setIsLoading(false);
      setError("Hiba történt fetchelés közben.");
    }
  };

  return (
    <div className="onlyStory">
      <div id="storyform">
        <form onSubmit={writestory} id="onlyStoryUpdate">
          <div className="button-container">
            <button type="submit" disabled={isLoading}>
              Mentés
            </button>
          </div>
          <textarea
            type="text"
            placeholder="Kezd el a történetírást!"
            className="input"
            id="storyText"
            onChange={(e) => setStory(e.target.value)}
          />
          {error && <div className="error">{error}</div>}
          {success && <div className="success">{success}</div>}
        </form>
      </div>
    </div>
  );
};

export default Writestory;
