import React from "react";
import "./Home.css";

import Trending from "../../../components/Trending/Trending";
import LineSeparator from "../../../components/LineSeparator/LineSeparator";
import DontMiss from "../../../components/DontMiss/DontMiss";
import Explore from "../../../components/Explore/Explore";
import FeatureCollection from "../../../components/FeatureCollection/FeatureCollection";
import FanFavorite from "../../../components/FanFavorite/FanFavorite";
import BigSwiper from "../../../components/BigSwiper/BigSwiper";

function Home() {
  return (
    <div className="home">
      <BigSwiper />

      <LineSeparator />
      <Trending />
      <DontMiss />
      <Explore />

      <LineSeparator />
      <FeatureCollection />
      <FanFavorite />
    </div>
  );
}

export default Home;
