import React from 'react';
import FileCSV from "../../../SchoolAPP Assets/FileCSV"
import EmailSVG from "../../../SchoolAPP Assets/Email"

import { useDict } from "../../UI/Translations"

const InviteNewChoices = props => {
    const dict = useDict("/staff-members-page")

    return (
        <React.Fragment>
            <h1 className="user-info-modal-heading">{dict("invite-modal/title")}</h1>
            <div className="user-info-modal-gray-bar"></div>
            <div className="invite-new-selection-wrapper">
                <section className="invite-new-selection-box" onClick={() => props.handleViewChange("csv")}>
                    <span><FileCSV height="25px" width="25px" style={{}} fill="#0037F6" stroke="none" /></span>
                    <div className="invite-new-text">{dict("invite-modal/button/import-csv")}</div>
                </section>
                <section className="invite-new-selection-box" onClick={() => props.handleViewChange("email")}><span>
                    <EmailSVG height="25px" width="25px" style={{}} fill="#0037F6" stroke="none" />
                </span><div className="invite-new-text">{dict("invite-modal/button/invite-email")}</div></section>
            </div>
            <div className="user-info-modal-gray-bar"></div>
            <div className="user-info-button-container">
                <div className="invite-new-button-wrapper">
                  <button className="cancelButton cancel-button-invite-new" onClick={() => props.closeModal()}>{dict("invite-modal/button/cancel")}</button>
                </div>
            </div>
        </React.Fragment>
    );
}

export default InviteNewChoices;
