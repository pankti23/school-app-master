import React, { useState, useContext, useRef } from "react";
import { UserContext } from "../../../../../Contexts/UserContext";
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import Button from "../../../../UI/Button";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick.js";

import { useDict } from "../../../../UI/Translations";

import axios from "axios";

import "../AddSubLevel/AddSubLevel.css";

const baseUrl = process.env.REACT_APP_BASE_URL;

const AddCampus = (props) => {
  const [campusName, setCampusName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dict = useDict("/configuration-page/school");

  const userData = useContext(UserContext);

  const handleChange = (event) => {
    setCampusName(event.target.value);
  };

  const ref = useRef();

  useOutsideClick(props.closeModal, ref);

  const postNewCampus = async (event) => {
    event.preventDefault();
    const config = {
      method: "post",
      url: `${baseUrl}/grades`,
      data: {
        name: campusName,
        levelId: props.campusId
      },
      headers: {
        Authorization: userData.jwt,
        "Content-Type": "application/json"
      }
    };
    setLoading(true);
    try {
      const { status, data } = await axios(config);
      props.addNewGradeToList(data);
      setErrorMessage("");
      setLoading(false);
      setCampusName("");
      props.closeModal();
    } catch (err) {
      console.error(err);
      const stringErr = err.toString();
      if (stringErr.includes("409")) {
        setErrorMessage(dict("level/add-grade-modal/message/error/409"));
      } else if (stringErr.includes("400")) {
        setErrorMessage(dict("level/add-grade-modal/message/error/400"));
      } else if (stringErr.includes("500")) {
        setErrorMessage(dict("level/add-grade-modal/message/error/500"));
        console.error(stringErr);
      } else {
        setErrorMessage(
          `${dict("level/add-grade-modal/message/error/unknown")} ${stringErr}`
        );
        console.error(stringErr);
      }
      setTimeout(function () {
        setErrorMessage("");
      }, 3000);
      setLoading(false);
    }
  };

  return (
    <div className="addCampusWrapper" ref={ref}>
      <p className="headerText">{`${dict("level/add-grade-modal/title")} ${
        props.levelName
      }`}</p>
      <div className="greyLine"></div>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <form
            className="add-campus-form"
            id="newGradeSubmit"
            onSubmit={postNewCampus}
          >
            <p
              className="formTitle"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("level/add-grade-modal/input-text")}
            </p>
            <input
              className="inputBox"
              type="text"
              autoFocus={true}
              value={campusName}
              onChange={handleChange}
              placeholder={dict("level/add-grade-modal/input-text")}
              style={errorMessage ? { borderColor: "red", color: "red" } : null}
            />
            <p style={{ color: "red" }}>{errorMessage}</p>
            <div className="greyLine"></div>
          </form>
          <div className="greyLine"></div>
          <div className="modal-buttons">
            <Button
              size="default"
              color="white"
              margin="0 8px 0 0"
              onClick={() => {
                props.closeModal();
                setCampusName("");
              }}
              width="70px"
            >
              {dict("level/add-grade-modal/button/cancel")}
            </Button>
            <Button
              size="default"
              color="green"
              type="submit"
              form="newGradeSubmit"
              disabled={!campusName}
              width="70px"
            >
              {dict("level/add-grade-modal/button/create")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCampus;
