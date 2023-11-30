import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";
import { useLogout } from "../../hooks/useLogout";
import DamerauLevenshtein from "damerau-levenshtein";
import { ketElem } from "../../components/sorting";
import config from "../../components/config";

const Story = () => {
  const { user } = useAuthContext();
  const { logout } = useLogout();
  const [isLoading, setIsLoading] = useState(false);

  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [osszesStory, SetOsszesStory] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [magyarChecked, setMagyarChecked] = useState(false);
  const [angolChecked, setAngolChecked] = useState(false);

  const [akcioChecked, setAkcioChecked] = useState(false);
  const [dramaChecked, setDramaChecked] = useState(false);
  const [fantaziaChecked, setFantaziaChecked] = useState(false);
  const [horrorChecked, setHorrorChecked] = useState(false);
  const [humorChecked, setHumorChecked] = useState(false);
  const [kalandChecked, setKalandChecked] = useState(false);
  const [krimiChecked, setKrimiChecked] = useState(false);
  const [paranormalChecked, setParanormalChecked] = useState(false);
  const [romantikaChecked, setRomantikaChecked] = useState(false);
  const [scifiChecked, setScifiChecked] = useState(false);
  const [versChecked, setVersChecked] = useState(false);

  const url = config.URL;

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

  //VARIABLES
  const angol = "angol";
  const magyar = "magyar";

  const akcio = "akció";
  const drama = "dráma";
  const fantazia = "fantázia";
  const horror = "horror";
  const humor = "humor";
  const kaland = "kaland";
  const krimi = "krimi";
  const paranormal = "paranormális";
  const romantika = "romantikus";
  const scifi = "sci-fi";
  const vers = "vers";

  //SEARCHING
  const levenshteinDistance = (str1, str2) =>
    new DamerauLevenshtein(str1, str2);

  const combinedFilteredStories = osszesStory.filter((story) => {
    // Checkbox filters
    const languageFilter =
      ((!magyarChecked || story.nyelv.toLowerCase() === "magyar") &&
        (!angolChecked || story.nyelv.toLowerCase() === "angol")) ||
      ketElem(angolChecked, magyarChecked, angol, magyar, story.nyelv);

    const categoryFilter =
      (!akcioChecked || story.kategoria.toLowerCase() === "akció") &&
      (!dramaChecked || story.kategoria.toLowerCase() === "dráma") &&
      (!fantaziaChecked || story.kategoria.toLowerCase() === "fantázia") &&
      (!horrorChecked || story.kategoria.toLowerCase() === "horror") &&
      (!humorChecked || story.kategoria.toLowerCase() === "humor") &&
      (!kalandChecked || story.kategoria.toLowerCase() === "kaland") &&
      (!krimiChecked || story.kategoria.toLowerCase() === "krimi") &&
      (!paranormalChecked ||
        story.kategoria.toLowerCase() === "paranormális") &&
      (!romantikaChecked || story.kategoria.toLowerCase() === "romantikus") &&
      (!scifiChecked || story.kategoria.toLowerCase() === "sci-fi") &&
      (!versChecked || story.kategoria.toLowerCase() === "vers");

    // Search filter
    const titleWords = story.cim.toLowerCase().split(" ");
    const author = story.szerzo.toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();

    const hasSimilarTitle = titleWords.some((word) => {
      const distance = levenshteinDistance(word, searchTermLower);
      return distance.similarity >= 0.35;
    });

    const hasSimilarAuthor =
      levenshteinDistance(author, searchTermLower).similarity >= 0.35;

    return (
      categoryFilter &&
      languageFilter &&
      (searchTerm.trim() === "" || hasSimilarTitle || hasSimilarAuthor)
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
  });

  const resetAll = () => {
    setSearchTerm("");
    setMagyarChecked(false);
    setAngolChecked(false);
    setAkcioChecked(false);
    setDramaChecked(false);
    setFantaziaChecked(false);
    setHorrorChecked(false);
    setHumorChecked(false);
    setKalandChecked(false);
    setKrimiChecked(false);
    setParanormalChecked(false);
    setRomantikaChecked(false);
    setScifiChecked(false);
    setVersChecked(false);
  };

  return (
    <div className="stories">
      <div className="storyWrap">
        {!isLoading ? <div></div> : <div className="loader"></div>}
        <div className="sortingContainer">
          <p className="default" onClick={resetAll}>
            Alapértelmezett
          </p>
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
                    id="akcio"
                    type="radio"
                    name="kateg"
                    checked={akcioChecked}
                    onChange={(e) => {
                      setAkcioChecked(e.target.checked);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Akció</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="drama"
                    type="radio"
                    name="kateg"
                    checked={dramaChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(e.target.checked);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Dráma</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="fantazia"
                    type="radio"
                    name="kateg"
                    checked={fantaziaChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(e.target.checked);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Fantázia</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="horror"
                    type="radio"
                    name="kateg"
                    checked={horrorChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(e.target.checked);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
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
                    id="humor"
                    type="radio"
                    name="kateg"
                    checked={humorChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(e.target.checked);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
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
                    id="kaland"
                    type="radio"
                    name="kateg"
                    checked={kalandChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(e.target.checked);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Kaland</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="krimi"
                    type="radio"
                    name="kateg"
                    checked={krimiChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(e.target.checked);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Krimi</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="paranormal"
                    type="radio"
                    name="kateg"
                    checked={paranormalChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(e.target.checked);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Paranormális</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="romantika"
                    type="radio"
                    name="kateg"
                    checked={romantikaChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(e.target.checked);
                      setScifiChecked(false);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Romantikus</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="scifi"
                    type="radio"
                    name="kateg"
                    checked={scifiChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(e.target.checked);
                      setVersChecked(false);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Sci-Fi</p>
            </div>
            <div className="checkbox">
              <div class="content">
                <label class="checkBox">
                  <input
                    id="vers"
                    type="radio"
                    name="kateg"
                    checked={versChecked}
                    onChange={(e) => {
                      setAkcioChecked(false);
                      setDramaChecked(false);
                      setFantaziaChecked(false);
                      setHorrorChecked(false);
                      setHumorChecked(false);
                      setKalandChecked(false);
                      setKrimiChecked(false);
                      setParanormalChecked(false);
                      setRomantikaChecked(false);
                      setScifiChecked(false);
                      setVersChecked(e.target.checked);
                    }}
                  />
                  <div class="transition"></div>
                </label>
              </div>
              <p>Vers</p>
            </div>
          </div>
        </div>
        <div className="storyContainer" id="allStoryContainer">
          {sortedStories.map((story) => (
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
    </div>
  );
};

export default Story;
