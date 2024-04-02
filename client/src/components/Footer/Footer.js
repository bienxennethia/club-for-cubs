import React from "react";

import "./Footer.scss";

const Footer = () => {

  const year = new Date().getFullYear();

  return (
    <div className="footer">
      <div className="footer__container">
        <p>© {year} Club for Cubs</p>
      </div>
     </div>
  )
}

export default Footer;