import Select from "../Select/Select";
import {useEffect, useState} from "react";
import './SidebarForum.scss';
import {useCommonState} from "../../data/commonState";

const SidebarForum = () => {

  const {clubLists: clubs, setCurricularType, setInterestType, setSearchString} = useCommonState();
  const [interestLists, setInterestLists] = useState([]);
  const [coCurricularLists, setCoCurricularLists] = useState([]);

  useEffect(() => {

    if (clubs) {
      const interestClubs = clubs.filter(club => club.type_name === "Interest");
      const coCurricularClubs = clubs.filter(club => club.type_name === "Co-Curricular");
      setInterestLists([{ id: 'all', name: 'Interest' }, ...interestClubs]);
      setCoCurricularLists([{ id: 'all', name: 'Co-Curricular' }, ...coCurricularClubs]);
    }
  }, [clubs]);

  const searchToggle = (value) => {
    setSearchString(value);
  }
  return (
    <div className="sidebar__content">
      <h1>CLUB FOR CUBS</h1>
      <input type="search" placeholder="Search clubs" onChange={(e) => searchToggle(e.target.value)}/>
      <Select isForum={true} options={coCurricularLists} setType={setCurricularType}/>
      <Select isForum={true} options={interestLists} setType={setInterestType}/>
    </div>
  )
}

export default SidebarForum;