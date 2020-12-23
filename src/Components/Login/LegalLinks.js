import React from 'react';
import "./LegalLinks.css"
import { Link } from "react-router-dom";

import { useDict } from "../UI/Translations"

const LegalLinks = () => {
    const dict = useDict("/login")

    return (
        <div className="legal-links-wrapper">
          <p className="legal-links-text">{`${dict("login/form/terms")[0]} `}<Link to="/privacy-policy"><span className="legal-links">{dict("login/form/terms")[1]}</span></Link>{` ${dict("login/form/terms")[2]} `}<Link to="/terms-and-conditions"><span className="legal-links">{dict("login/form/terms")[3]}</span></Link></p>
        </div >
    );
}
export default LegalLinks;
