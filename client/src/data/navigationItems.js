
import { ReactComponent as ForumIcon } from "../icons/forum.svg";
import { ReactComponent as ClubsIcon } from "../icons/clubs.svg";
import { ReactComponent as AboutIcon } from "../icons/about.svg";
export const navigationItems = [
  // {
  //   name: "Forums",
  //   link: "/forums",
  //   icon: <ForumIcon className="navigation__link--icon logo"/>,
  //   disabled: true
  // },
  {
    name: "Clubs",
    link: "/clubs",
    icon: <ClubsIcon className="navigation__link--icon logo"/>,
    disabled: true
  },
  {
    name: "About",
    link: "/about",
    icon: <AboutIcon className="navigation__link--icon logo"/>,
    disabled: true
  }
];