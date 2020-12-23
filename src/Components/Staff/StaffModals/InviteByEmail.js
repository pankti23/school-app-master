import "./InviteByEmail.css";
import React, { useState, useEffect } from "react";
import { ReactMultiEmail, isEmail } from 'react-multi-email';

import 'react-multi-email/style.css';

import axios from "axios";
import { getTokenFromLocalStorage } from "../../../services/localStorageService";

import { useDict } from "../../UI/Translations"

const baseUrl = process.env.REACT_APP_BASE_URL;
const InviteByEmail = (props) => {
  const [nameInput, setNameInput] = useState("");
  const [nameList, setNameList] = useState([]);
  const [roleInput, setRoleInput] = useState(null);
  const [rolesList, setRolesList] = useState([]);

  const dict = useDict("/staff-members-page")

  const getRoleList = async () => {
    const token = getTokenFromLocalStorage();
    const getConfig = {
      method: "get",
      url: `${baseUrl}/roles`,
      headers: {
        Authorization: token,
      },
    };
    try {
      const { data } = await axios(getConfig);
      console.log(data);
      setRolesList(data);
    } catch (err) {
      const stringErr = err.toString();
      console.error(stringErr);
    }
  };

  const sendInvitesByEmail = async () => {
    const token = getTokenFromLocalStorage();
    const postConfig = {
      method: "post",
      url: `${baseUrl}/users/create/bulk/emails`,
      data: {
        emails: nameList,
        roleId: roleInput,
      },
      headers: {
        Authorization: token,
        "Content-Type": "application/json",
      },
    };
    try {
      const { data } = await axios(postConfig);
      console.log(data);
      props.setUpdated(true);
      props.closeModal();
    } catch (err) {
      const stringErr = err.toString();
      console.error(stringErr);
      props.closeModal();
    }
  };

  const handleRoleInput = (id) => {
    setRoleInput(id);
  };

  const mappedChoices = rolesList.filter((r) => r.id !== 8).map((role) => {
    return (
      <>
      <div className="invite-checkbox-wrapper" key={role.id}>
        <input
          id={role.name}
          type="checkbox"
          name={role.name}
          checked={roleInput === role.id}
          onClick={() => {
            handleRoleInput(role.id);
          }}
        />
        <label htmlFor={role.name}>{role.name}</label>
      </div>
      </>
    );
  });

  useEffect(() => {
    getRoleList();
  }, [nameInput]);

  return (
    <React.Fragment>
      <h1 className="invite-heading-h1" style={{ padding: "20px 20px" }}>
        {dict("invite-modal/email/title")}
      </h1>
      <div className="user-info-modal-gray-bar"></div>
      <div className="invite-email-input-wrapper">
        <p className="invite-upload-button-label">
          {dict("invite-modal/email/email-input/title")}
        </p>
        <ReactMultiEmail
          placeholder={dict("invite-modal/email/email-input/input")}
          emails={nameList}
          onChange={(_emails) => {
            setNameList(_emails);
          }}
          className="invite-textarea"
          validateEmail={email => {
            return isEmail(email); // return boolean
          }}
          getLabel={(
            email,
            index,
            removeEmail
          ) => {
            return (
              <div data-tag key={index}>
                {email}
                <span data-tag-handle onClick={() => removeEmail(index)}>
                  ×
                </span>
              </div>
            );
          }}
        />
        <br />
        <br />
        <p className="invite-upload-button-label">
          {dict("invite-modal/email/assign-role/title")}
        </p>
        <div className="invite-checkbox-container">{mappedChoices}</div>
      </div>
      <div className="user-info-modal-gray-bar"></div>
      <div className="invite-button-wrapper">
        <div
          className="invite-back-button-wrapper"
          onClick={() => props.handleViewChange("")}
        >
          <div className="invite-back-button">{dict("invite-modal/email/button/back")}</div>
        </div>
        <div className="invite-cancel-submit-button-wrapper">
          <button
            className="invite-cancel-button"
            onClick={() => props.closeModal()}
          >
            {dict("invite-modal/email/button/cancel")}
          </button>
          <button
            className="invite-submit-button"
            disabled={roleInput !== null && nameList.length ? false : true}
            onClick={() => sendInvitesByEmail()}
          >
            {dict("invite-modal/email/button/create")}
          </button>
        </div>
      </div>
    </React.Fragment>
  );
};

export default InviteByEmail;
