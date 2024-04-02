import Forum from "../Forum/Forum";

import { useCommonState } from "../../data/commonState";
const ClubContent = ({activeTab}) => {
  const { clubLists: clubData, forumLists: forums } = useCommonState();
  return (
    <div className="club__content">
      {activeTab === 'about' ? (
        <div className="club__content-about">
          { clubData[0]?.description && <h1>ABOUT:</h1> }
          { clubData[0]?.description && <p>{clubData[0]?.description}</p> }
          { clubData[0]?.vision && <h1>VISION:</h1> }
          { clubData[0]?.vision && <p>{clubData[0]?.vision}</p> }
          { clubData[0]?.mission && <h1>MISSION:</h1> }
          { clubData[0]?.mission && <p>{clubData[0]?.mission}</p> }
        </div>
      ) : (
        <div className="club__content-forum">
          {
            forums.length === 0 && <div className="club__text">No forums found</div>
          }
          {
            forums.map((forum, index) => (
              <Forum key={index} forum={forum} />
            ))
          }
        </div>
      )}
    </div>
  )
};

export default ClubContent;