import { ReactComponent as AToZ } from "../icons/a-to-z-red.svg";
import { ReactComponent as AToZWhite } from "../icons/a-to-z-white.svg";
import { ReactComponent as Curricular } from "../icons/curricular-red.svg";
import { ReactComponent as CurricularWhite } from "../icons/curricular-white.svg";
import { ReactComponent as Interest } from "../icons/interest-red.svg";
import { ReactComponent as InterestWhite } from "../icons/interest-white.svg";

export const clubType = [
  {
    id: "all",
    icon: <AToZ />,
    iconWhite: <AToZWhite />,
  },
  {
    id: "curricular",
    icon: <Curricular />,
    iconWhite: <CurricularWhite />,
  },
  {
    id: "interest",
    icon: <Interest />,
    iconWhite: <InterestWhite />,
  },
];