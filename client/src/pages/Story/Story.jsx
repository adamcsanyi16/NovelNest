import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import DamerauLevenshtein from "damerau-levenshtein";

const Story = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [osszesStory, SetOsszesStory] = useState([]);
  const [checkboxFilteredStories, setCheckboxFilteredStories] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [magyarChecked, setMagyarChecked] = useState(false);
  const [angolChecked, setAngolChecked] = useState(false);
  const [horrorChecked, setHorrorChecked] = useState(false);
  const [humorChecked, setHumorChecked] = useState(false);
  const [fantaziaChecked, setFantaziaChecked] = useState(false);

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
  }, [user, felhasznalonev]);

  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const response = await fetch(url + "/story", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          SetOsszesStory(data.story);
          setIsLoading(false);
        } else {
          const data = await response.json();
          if (data.msg.includes("Token expired")) {
            logout();
          }
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev]);

  //SEARCHING
  const levenshteinDistance = (str1, str2) =>
    new DamerauLevenshtein(str1, str2);

  useEffect(() => {
    const checkboxFilteredStories = osszesStory.filter((story) => {
      const languageFilter =
        (!magyarChecked || story.nyelv.toLowerCase() === "magyar") &&
        (!angolChecked || story.nyelv.toLowerCase() === "angol");

      const categoryFilter =
        (!horrorChecked || story.kategoria.toLowerCase() === "horror") &&
        (!humorChecked || story.kategoria.toLowerCase() === "humor") &&
        (!fantaziaChecked || story.kategoria.toLowerCase() === "fantazia");

      return categoryFilter || languageFilter;
    });

    setCheckboxFilteredStories(checkboxFilteredStories);
  }, [
    magyarChecked,
    angolChecked,
    horrorChecked,
    humorChecked,
    fantaziaChecked,
  ]);

  /*const combinedFilteredStories = osszesStory.filter((story) => {
    // Checkbox filters
    const languageFilter =
      (!magyarChecked || story.nyelv.toLowerCase() === "magyar") &&
      (!angolChecked || story.nyelv.toLowerCase() === "angol");

    const categoryFilter =
      (!horrorChecked || story.kategoria.toLowerCase() === "horror") &&
      (!humorChecked || story.kategoria.toLowerCase() === "humor") &&
      (!fantaziaChecked || story.kategoria.toLowerCase() === "fantazia");

    // Search filter
    const titleWords = story.cim.toLowerCase().split(" ");
    const searchTermLower = searchTerm.toLowerCase();

    const hasSimilarTitle = titleWords.some((word) => {
      const distance = levenshteinDistance(word, searchTermLower);
      return distance.similarity >= 0.15;
    });

    return (
      categoryFilter &&
      languageFilter &&
      (searchTerm.trim() === "" || hasSimilarTitle)
    );
  });

  const sortedStories = combinedFilteredStories.sort((a, b) => {
    const distanceA = levenshteinDistance(
      a.cim.toLowerCase(),
      searchTerm.toLowerCase()
    ).similarity;
    const distanceB = levenshteinDistance(
      b.cim.toLowerCase(),
      searchTerm.toLowerCase()
    ).similarity;

    return distanceB - distanceA;
  });*/

  return (
    <div className="storyWrap">
      {!isLoading ? <div></div> : <div className="loader"></div>}
      <div className="sortingContainer">
        <input
          className="input"
          type="text"
          placeholder="Keresés..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="nyelv">
          <span>Nyelv</span>
          <div className="checkbox">
            <div class="content">
              <label class="checkBox">
                <input
                  id="ch1"
                  type="checkbox"
                  checked={magyarChecked}
                  onChange={(e) => setMagyarChecked(e.target.checked)}
                />
                <div class="transition"></div>
              </label>
            </div>
            <p>Magyar</p>
          </div>
          <div className="checkbox">
            <div class="content">
              <label class="checkBox">
                <input
                  id="ch1"
                  type="checkbox"
                  checked={angolChecked}
                  onChange={(e) => setAngolChecked(e.target.checked)}
                />
                <div class="transition"></div>
              </label>
            </div>
            <p>Angol</p>
          </div>
        </div>
        <div className="kategoria">
          <span>Kategória</span>
          <div className="checkbox">
            <div class="content">
              <label class="checkBox">
                <input
                  id="ch1"
                  type="checkbox"
                  checked={horrorChecked}
                  onChange={(e) => setHorrorChecked(e.target.checked)}
                />
                <div class="transition"></div>
              </label>
            </div>
            <p>Horror</p>
          </div>
          <div className="checkbox">
            <div class="content">
              <label class="checkBox">
                <input
                  id="ch1"
                  type="checkbox"
                  checked={humorChecked}
                  onChange={(e) => setHumorChecked(e.target.checked)}
                />
                <div class="transition"></div>
              </label>
            </div>
            <p>Humor</p>
          </div>
          <div className="checkbox">
            <div class="content">
              <label class="checkBox">
                <input
                  id="ch1"
                  type="checkbox"
                  checked={fantaziaChecked}
                  onChange={(e) => setFantaziaChecked(e.target.checked)}
                />
                <div class="transition"></div>
              </label>
            </div>
            <p>Fantázia</p>
          </div>
        </div>
      </div>
      <div className="storyContainer">
        {checkboxFilteredStories.map((story) => (
          <div className="storyLink" key={story._id}>
            <Link to={`/story/${story._id}`}>
              <div className="book-container" key={story._id}>
                <div className="book">
                  <div className="front-content">
                    <img src={story.boritokep} alt="" />
                  </div>
                  <div className="content">
                    <p className="heading">{story.cim}</p>
                    <p>{story.leiras}</p>
                    <div id="author">
                      <h3>{story.szerzo}</h3>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Story;
