import React, { useState, useRef, useEffect } from "react";

import AddIcon from "../../SchoolAPP Assets/plus.svg";
import Button from "../UI/Button"
import InviteNew from "./StaffModals/InviteNew";

import { useDict } from "../UI/Translations"

import "./StaffListHeader.css";

const StaffListHeader = (props) => {
  const [openInviteNewModal, setOpenInviteNewModal] = useState(false);

  const dict = useDict("/staff-members-page")

  useEffect(()=> {
    if(openInviteNewModal){
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
  },[openInviteNewModal]);

  return (
    <>
      {openInviteNewModal ? (
        <InviteNew
          closeModal={() => {
            setOpenInviteNewModal(false);
          }}
          setUpdated={props.setUpdated}
        />
      ) : null}
      <div className="staff-page-header-container">
        <header className="staff-page-h1-header-wrapper">
          <h1>{dict("main/header/title")}</h1>

          <Button size="default"
            color="grey"
            margin="0 0 0 20px"
            image={AddIcon}
            onClick={() => setOpenInviteNewModal(true)}>{dict("main/invite-button")}</Button>
        </header>
        <h2 className="staff-page-subheading-text">
          {dict("main/header/paragraph")}
        </h2>
      </div>
    </>
  );
};

export default StaffListHeader;
