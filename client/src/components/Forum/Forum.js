import { ReactComponent as Logo } from "../../icons/profile.svg";
import AdminBtn from "../AdminBtn/AdminBtn";
import './Forum.scss';
import { useCommonState } from "../../data/commonState";

const Forum = ({forum}) => {
  const { getImage, formatDate } = useCommonState();
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
          <img src={getImage(forum.forum_image)} alt={forum.forum_name}/>
        </div>
      </div>
      
      }
      <AdminBtn editModalId="editForum" deleteModalId="deleteForum" id={forum.forum_id}/>
    </div>
  </div>
  )
};

export default Forum;