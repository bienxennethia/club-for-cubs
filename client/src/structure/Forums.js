import ForumsContent from "../components/ForumsContent/ForumsContent";
import SidebarForum from "../components/SidebarForum/SidebarForum";

const Forums = () => {

  return (
    <section className="forums noBackground">
      <div className="forums__container container">
        <SidebarForum />
        <ForumsContent />
      </div>
    </section>
  )
};

export default Forums;