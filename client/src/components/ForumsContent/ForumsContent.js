import Forum from "../Forum/Forum";

import './ForumsContent.scss';

import {useCommonState} from "../../data/commonState";

const ForumsContent = ({toggleModal}) => {
  const {forumLists: forums} = useCommonState();
  
  return (
    <div className="forums__content">
      {
        forums.length === 0 && (
          <div className="clubs__text">No forums found</div>
        )
      }
      {
        forums.map((forum, index) => (
          <Forum key={index} forum={forum} />
        ))
      }
    </div>
  )
};

export default ForumsContent;