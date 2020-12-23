import React, { useState } from "react";
import { getTokenFromLocalStorage } from "../../../services/localStorageService";

import axios from "axios";

import { useDict } from "../../UI/Translations"

const baseUrl = process.env.REACT_APP_BASE_URL;
const StaffListDelete = (props) => {
  const dict = useDict("/staff-members-page")

  const list = props.deleteList;

  const deleteUserById = () => {
    const token = getTokenFromLocalStorage();
    list.forEach(async (id) => {
      const deleteConfig = {
        method: "delete",
        url: `${baseUrl}/users/${id}`,
        headers: {
          Authorization: token,
        },
      };
      try {
        await axios(deleteConfig);
        props.closeModal();
        props.setListOfCheckedBoxes([])
        props.setUpdated(true)
      } catch (err) {
        const stringErr = err.toString();
        props.closeModal();
        console.log(stringErr);
      }
    });
  };

  return (
    <div className="filter-model-open">
      <div className="delete-confirmation-modal-container">
        <p className="delete-confirmation-modal-header-text delete-modal-text">
          {dict("delete-modal/title")}
        </p>
        <div className="filter-model-grey-line"></div>
        <div className="buttons-container" style={{ marginRight: "15px" }}>
          <button className="cancel-button" onClick={() => props.closeModal()}>
            {dict("delete-modal/button/cancel")}
          </button>
          <button className="create-button" onClick={() => deleteUserById()}>
            {dict("delete-modal/button/confirm")}
          </button>
        </div>
      </div>
    </div>
  );
};

export default StaffListDelete;
