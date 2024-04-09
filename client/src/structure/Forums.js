import ForumsContent from "../components/ForumsContent/ForumsContent";
import SidebarForum from "../components/SidebarForum/SidebarForum";

import { useCommonState } from "../data/commonState";

const Forums = () => {
  const { clubLists } = useCommonState();

  return (
    clubLists.length > 0 && <section className="forums noBackground">
      <div className="forums__container container">
        <SidebarForum />
        <ForumsContent />
      </div>
    </section>
  )
};

export default Forums;