import React from "react";
import Slider from "./Slider";
import Services from "./Services";
import Support from "./Support";

const Home = () => {
  return (
    <div className="w-full">
      <Slider />
      <Services />
      <Support />
    </div>
  );
};

export default Home;
