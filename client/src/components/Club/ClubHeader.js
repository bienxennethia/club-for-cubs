import { ReactComponent as Logo } from "../../icons/profile.svg";
import AdminBtn from "../AdminBtn/AdminBtn";
import './Club.scss';

import { useCommonState } from "../../data/commonState";

const ClubHeader = ({handleTabs, activeTab}) => {
  const { clubLists: clubData } = useCommonState();
  
  return (
    <div className="club__content club__content-header">
      <div className="club__header-content">
        <div className="club__header-image">
          <Logo />
        </div>
        <div className="club__header-text">
          {
            clubData[0]?.name && <h2 className="club__header-title">{clubData[0]?.name}</h2>
          }
          { clubData[0]?.type_name && <p className="club__header-subtitle">{clubData[0]?.type_name}</p> }
          <p className="club__header-name">Moderator:</p>
          <AdminBtn editModalId="editClub" deleteModalId="deleteClub" id={clubData[0]?.id}/>
        </div>
      </div>
      <div className={ activeTab === 'about' ? `club__header-actions about` : 'club__header-actions forum'}>
        <button type="button" className={ activeTab === 'about' ? `active` : ''} onClick={() => handleTabs('about')}>ABOUT</button>
        <button type="button" className={ activeTab === 'forum' ? `active` : ''} onClick={() => handleTabs('forum')}>FORUM</button>
      </div>
    </div>
  )
};

export default ClubHeader;