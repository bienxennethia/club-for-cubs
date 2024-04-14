import Forum from "../Forum/Forum";
import Loading from "../Loading/Loading";

import './ForumsContent.scss';

import {useCommonState} from "../../data/commonState";

const ForumsContent = () => {
  const {forumLists: forums, isPageLoading} = useCommonState();
  
  return (
    <div className="forums__content">
      { isPageLoading ? <Loading /> : <>
        {
          forums.length === 0 ? (
            <div className="clubs__text">No forums found</div>
          ) : (
            forums.map((forum, index) => (
              <Forum key={index} forum={forum} />
            ))
          )
        }
      </>
      }
    </div>
  )
};

export default ForumsContent;