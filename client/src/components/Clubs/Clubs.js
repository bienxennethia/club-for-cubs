import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import "./Clubs.scss";

import imageUrl from "../../images/background.jpg";
import SelectField from "../Select/Select";

import { useCommonState } from "../../data/commonState";

const Clubs = () => {
  const { clubLists: clubs, clubTypes, setSelectedClubType, warningMessage, setWarningMessage } = useCommonState();

  useEffect(() => {
    if (warningMessage) {
      setTimeout(() => {
        setWarningMessage(null);
      }, 5000);
    }
  }, [setWarningMessage, warningMessage]);
  
  return (
    <div className="clubs">
      <div className="clubs__container">
        <div className="clubs__header">
          <h2 className="clubs__title">CLUBS</h2>
          <SelectField setType={setSelectedClubType} options={clubTypes} />
        </div>
        <div className="clubs__content">
          { warningMessage && warningMessage?.id?.includes("item") && <div className="clubs__delete-text">{warningMessage?.message}!</div>}
          { clubs.length === 0 && <div className="clubs__text">No clubs found</div>}
          { clubs.length > 0 && 
            <div className="clubs__items">
              {clubs.map((item) => (
                <Link to={`/item/${item.id}`} className="clubs__item" key={item.id}>
                  <div className="clubs__item-content" style={{ backgroundImage: `url(${imageUrl})` }}>
                    <div className="clubs__text">{item.name}</div>
                  </div>
                </Link>
              ))}
            </div>
          }
        </div>
      </div>
     </div>
  )
}

export default Clubs;