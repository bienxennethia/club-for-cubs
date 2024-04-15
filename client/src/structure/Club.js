import ClubHeader from "../components/Club/ClubHeader";
import ClubContent from "../components/Club/ClubContent";
import Loading from "../components/Loading/Loading";
import { useState } from "react";

import { useCommonState } from "../data/commonState";

const Club = () => {
  const [activeTab, setActiveTab] = useState('about');
  const {isPageLoading} = useCommonState();

  const handleTabs = (tab) => {
    if (tab === 'about') {
      setActiveTab('about');
    } else if (tab === 'forum') {
      setActiveTab('forum');
    }
  }

  return (
    <section className="club noBackground">
      <div className="club__container container">
        {isPageLoading ? <Loading /> : 
          <>
            <ClubHeader handleTabs={handleTabs} activeTab={activeTab} />
            <ClubContent activeTab={activeTab} />
          </>
        }
      </div>
    </section>
  )
};

export default Club;