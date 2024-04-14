import React, { useEffect } from "react";
import { Link } from "react-router-dom";

import "./Clubs.scss";

import SelectField from "../Select/Select";
import Loading from "../Loading/Loading";

import { useCommonState } from "../../data/commonState";

const Clubs = () => {
  const { clubLists: clubs, clubTypes, setSelectedClubType, warningMessage, setWarningMessage, response, setResponse, getImage, isPageLoading } = useCommonState();

  useEffect(() => {
    if (warningMessage) {
      setTimeout(() => {
        setWarningMessage(null);
      }, 5000);
    }
  }, [setWarningMessage, warningMessage]);

  useEffect(() => {
    if (response) {
      setTimeout(() => {
        setResponse(null);
      }, 5000);
    }
  }, [setResponse, response]);
  
  return (
    <div className="clubs">
      <div className="clubs__container">
        <div className="clubs__header">
          <h2 className="clubs__title">CLUBS</h2>
          <SelectField setType={setSelectedClubType} options={clubTypes} />
        </div>
        {isPageLoading ? (
            <Loading />
          ) : (
            <div className="clubs__content">
              { warningMessage && warningMessage?.id?.includes("item") && <div className="clubs__delete-text">{warningMessage?.message}!</div>}
              { response?.message && <div className="clubs__delete-text">{response?.message}!</div>}
              { clubs.length === 0 && <div className="clubs__text">No clubs found</div>}
              { clubs.length > 0 && 
                <div className="clubs__items">
                  {clubs.map((item) => (
                    <Link to={`/item/${item.id}`} className="clubs__item" key={item.id}>
                      <div className="clubs__item-content" style={{ backgroundImage: `url(${getImage(item.image)})` }}>
                        <div className="clubs__text">{item.name}</div>
                      </div>
                    </Link>
                  ))}
                </div>
              }
            </div>
          )}
      </div>
     </div>
  )
}

export default Clubs;