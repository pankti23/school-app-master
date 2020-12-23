import React, { useState, useContext, useRef } from "react";
import { UserContext } from "../../../../../Contexts/UserContext";
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import Button from "../../../../UI/Button";
import axios from "axios";
import "../AddSubLevel/AddSubLevel.css";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";
import { useDict } from "../../../../UI/Translations";

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

  const postNewCampus = async (event) => {
    event.preventDefault();
    const config = {
      method: "post",
      url: `${baseUrl}/groups`,
      data: {
        name: campusName,
        gradeId: props.campusId
      },
      headers: {
        Authorization: userData.jwt,
        "Content-Type": "application/json"
      }
    };
    setLoading(true);
    try {
      const { status, data } = await axios(config);
      props.addNewGroupToList(data);
      setErrorMessage("");
      setLoading(false);
      setCampusName("");
      props.closeModal();
    } catch (err) {
      console.error(err);
      const stringErr = err.toString();
      if (stringErr.includes("409")) {
        setErrorMessage(dict("grade/add-group-modal/message/error/409"));
      } else if (stringErr.includes("400")) {
        setErrorMessage(dict("grade/add-group-modal/message/error/400"));
      } else if (stringErr.includes("500")) {
        setErrorMessage(dict("grade/add-group-modal/message/error/500"));
        console.error(stringErr);
      } else {
        setErrorMessage(
          `${dict("grade/add-group-modal/message/error/unknown")} ${stringErr}`
        );
        console.error(stringErr);
      }
      setTimeout(function () {
        setErrorMessage("");
      }, 3000);
      setLoading(false);
    }
  };

  const ref = useRef();

  useOutsideClick(props.closeModal, ref);

  return (
    <div className="addCampusWrapper" ref={ref}>
      <p className="headerText">{`${dict("grade/add-group-modal/title")} ${
        props.gradeName
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
            id="newGroupSubmit"
            onSubmit={postNewCampus}
          >
            <p
              className="formTitle"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("grade/add-group-modal/input-text")}
            </p>
            <input
              className="inputBox"
              type="text"
              value={campusName}
              autoFocus={true}
              onChange={handleChange}
              placeholder={dict("grade/add-group-modal/input-text")}
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
              {dict("grade/add-group-modal/button/cancel")}
            </Button>
            <Button
              size="default"
              color="green"
              type="submit"
              form="newGroupSubmit"
              disabled={!campusName}
              width="70px"
            >
              {dict("grade/add-group-modal/button/create")}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCampus;
