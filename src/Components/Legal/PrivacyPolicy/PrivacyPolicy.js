import React from "react";
import { Link, useHistory } from "react-router-dom";
// using same styling as TermsOfService.js located in this same Legal folder
import "../TermsOfService/TermsOfService.css";
import LoginLogo from "../../../SchoolAPP Assets/SchoolAppLoginInfo";

import { useDict } from "../../UI/Translations";

const PrivacyPolicy = () => {
  const dict = useDict("/login");

  const history = useHistory();

  const policyDict = useDict("/privacy-policy");

  const toLink = (text) => {
    const urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi;

    return text.replace(urlRegex, function (url) {
      return '<a href="' + url + '">' + url + "</a>";
    });
  };

  return (
    <div className="terms-of-service-wrapper">
      <nav className="terms-header">
        <div className="terms-header-logo">
          <LoginLogo width="121px" height="21px" style={{}} />
        </div>
        <div className="terms-header-link">
          <p style={{ cursor: "pointer" }} onClick={() => history.goBack()}>
            {dict("privacy-policy/back-link")}
          </p>
        </div>
      </nav>
      <section className="terms-section">
        <article className="terms-article">
          <h1>{policyDict("privacy-policy/title")}</h1>
          {policyDict("privacy-policy/copy") &&
            policyDict("privacy-policy/copy").map((copy, i) => (
              <p key={i}>
                <div dangerouslySetInnerHTML={{ __html: toLink(copy) }} />
              </p>
            ))}
        </article>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
