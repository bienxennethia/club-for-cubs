import { ReactComponent as Logo } from "../../icons/profile.svg";
import backgroundJpg from "../../images/background.jpg";


import AdminBtn from "../AdminBtn/AdminBtn";
import './Forum.scss';
import { formatDate } from "../../data/utils";

const Forum = ({forum}) => {
  return (
    <div className="forum__items">
    <div className="forum__item">
      <div className="forum__header">
        <div className="forum__image">
          <Logo />
        </div>
        {
          forum.forum_name && forum.forum_created &&
          <div className="forum__text">
            <h2 className="forum__title">{forum.forum_name}</h2>
            <p className="forum__subtitle">{formatDate(forum.forum_created)}</p>
          </div>
        }
      </div>
      
      { forum.forum_description && 
        <div className="forum__content">
          <p>{forum.forum_description}</p>
          <div className="forum__content-image">
            <img src={backgroundJpg} alt="forum"/>
          </div>
        </div>
      }
      <AdminBtn editModalId="editForum" deleteModalId="deleteForum" id={forum.forum_id}/>
    </div>
  </div>
  )
};

export default Forum;