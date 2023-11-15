import React, { useState, useEffect } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";
import { Link } from "react-router-dom";

const Story = () => {
  const { user } = useAuthContext();

  const [felhasznalonev, setFelhasznalonev] = useState("");
  const [osszesStory, SetOsszesStory] = useState([]);

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
          console.log(osszesStory);
        }
      } catch (error) {
        console.log("Fetch error:", error);
      }
    };

    fetchData();
  }, [user, felhasznalonev]);

  return (
    <div className="storyWrap">
      <div className="sortingContainer"></div>
      <div className="storyContainer">
        {osszesStory.map((story) => (
          <div className="storyLink">
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
