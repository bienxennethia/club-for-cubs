import React from "react";

import "./Creators.scss";

import { creatorsData } from "./creatorsItem";
import { ReactComponent as Profile } from "../../icons/profile.svg";

const Creators = () => {

  return (
    <div className="creators cmp">
      <div className="creators__container">
        <div className="creators__header">
          <h2 className="creators__title">Creators</h2>
        </div>
        <div className="creators__content">
          <div className="creators__items">
            {creatorsData.map((creator, index) => (
              <div className="creators__item" key={index}>
                <div className="creators__image">
                  <Profile className="creators__logo" />
                </div>
                <div className="creators__text">
                  <h3 className="creators__name">{creator.name}</h3>
                  <p className="creators__description">{creator.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
     </div>
  )
}

export default Creators;