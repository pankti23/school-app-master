import React, { useState, useRef } from "react";
import InviteNewChoices from "./InviteNewChoices";
import InviteByEmail from "./InviteByEmail";
import InviteByCSV from "./InviteByCSV";

import useOnClickOutside from "../../../CustomHooks/useOnClickOutside";

import "./InviteNew.css";

const InviteNewStaff = (props) => {
  const [view, setView] = useState("");

  const ref = useRef();
  useOnClickOutside(ref, () => {
    props.closeModal();
    setView("");
  });

  const viewChoice = () => {
    if (view === "") {
      return (
        <InviteNewChoices
          closeModal={props.closeModal}
          handleViewChange={handleViewChange}
          setUpdated={props.setUpdated}
        />
      );
    } else if (view === "email") {
      return (
        <InviteByEmail
          closeModal={props.closeModal}
          handleViewChange={handleViewChange}
          setUpdated={props.setUpdated}
        />
      );
    } else if (view === "csv") {
      return (
        <InviteByCSV
          closeModal={props.closeModal}
          setUpdated={props.setUpdated}
          handleViewChange={handleViewChange}
        />
      );
    }
  };

  const handleViewChange = (viewParam) => {
    setView(viewParam);
  };

  return (
    <div className="add-new-staff-modal-wrapper">
      <div className="invite-new-main-modal">
        <div ref={ref} className="user-info-modal-container invite-new-modal">
          {viewChoice()}
        </div>
      </div>
    </div>
  );
};

export default InviteNewStaff;
