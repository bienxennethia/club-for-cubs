import React from "react";

import "./Hero.scss";
import { ReactComponent as Logo } from "../../icons/logo.svg";
import { ReactComponent as HeroImage } from "../../icons/hero.svg";

const Hero = () => {
  return (
    <div className="hero" id="hero">
      <div className="hero__container">
        <div className="hero__logo">
          <Logo className="logo"/>
        </div>
        <div className="hero__image">
          <HeroImage/>
        </div>
      </div>
     </div>
  )
}

export default Hero;