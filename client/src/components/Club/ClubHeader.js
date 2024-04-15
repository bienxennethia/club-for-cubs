import AdminBtn from "../AdminBtn/AdminBtn";
import './Club.scss';

import { useCommonState } from "../../data/commonState";

const ClubHeader = ({handleTabs, activeTab}) => {
  const { clubLists: clubData, getImage } = useCommonState();
  
  return (
    <div className="club__content club__content-header">
      <div className="club__header-content">
        <div className="club__header-image" style={{ backgroundImage: `url(${getImage(clubData[0]?.image)})` }}>
        </div>
        <div className="club__header-text">
          {
            clubData[0]?.name && <h2 className="club__header-title">{clubData[0]?.name}</h2>
          }
          { clubData[0]?.type_name && <p className="club__header-subtitle">{clubData[0]?.type_name}</p> }
          { clubData[0]?.president && <p className="club__header-name"><span>President:</span> {clubData[0]?.president}</p> }
          { clubData[0]?.moderators && <p className="club__header-name"><span>Moderator:</span> {clubData[0]?.moderators}</p> }
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