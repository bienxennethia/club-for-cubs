import React from "react";

import "./Card.scss";
import { ReactComponent as Profile } from "../../icons/profile.svg";

const Card = ({name, position}) => {

  return (
    <div className="card">
      <div className="card__details">
        <div className="card__image">
          <Profile className="card__logo" />
        </div>
        <p className="card__position">{position}</p>
        <p className="card__name">{name}</p>
      </div>
     </div>
  )
}

export default Card;