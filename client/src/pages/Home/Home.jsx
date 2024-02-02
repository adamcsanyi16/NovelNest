import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="elso-keret">
      <div className="bemutatkozo">
        <img className="iros-kep" src="/images/iros-kep.png" alt="iro" />
        <div className="bemutatkozo-szoveg">
          <div className="novelnest-szoveg">
            <p className="novelnest-iras">
              <span className="novel">Novel</span>
              <span className="nest">Nest</span>
            </p>
            <p className="eredeti">
              <span className="tortenetek">Eredeti történetek amiket</span>
              <span className="ti"> TI</span>
              <span className="hoztok">
                {" "}
                hoztok létre!
                <br />
                <br />
                Éld ki a kreativitásodat...
                <br />
                Kreálj egy saját sorozatot vagy rövid történeteket.
                <br />
                <br />
              </span>
            </p>
          </div>
          <div className="gombok">
            <Link to={"/belepes"}>
              <button className="irj-tort">Írj történetet!</button>
            </Link>
            <Link to={"/belepes"}>
              <button className="olvas">Olvasni szeretnék!</button>
            </Link>
          </div>
        </div>
      </div>
      <div className="hogy">
        <img className="hatter" src="/images/hatter.png" alt="hatter" />
        <p className="talald-ki">Talald ki a sztoridat</p>
        <div className="hogy-ird">
          <p className="hogyan">Hogyan működik?</p>
          <p className="ird-le">Írd le a közösségnek</p>
        </div>
        <p className="oszd-meg">Oszd meg</p>
      </div>
      <div className="also">
        <span className="also-szoveg">
          ©️ 2024 NovelNest. Minden jog fenntartva.
        </span>
        <br />
        <span className="also-szoveg2">
        | Kapcsolat: novelnestteam@gmail.com  <br /> | Telefonszám: +36 40 535 9813 
        </span>
      </div>
    </div>
  );
};

export default Home;
