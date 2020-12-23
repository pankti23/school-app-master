import React, { useState, useContext, useRef } from "react";
import { UserContext } from "../../../../../Contexts/UserContext";
import LoadingSpinner from "../../../../UI/LoadingSpinner";
import Button from "../../../../UI/Button";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";
import axios from "axios";

import { useDict } from "../../../../UI/Translations";

import "./AddCampus.css";

const baseUrl = process.env.REACT_APP_BASE_URL;
const AddCampus = (props) => {
  const [campusName, setCampusName] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const dict = useDict("/configuration-page/school");

  const ref = useRef();

  const userData = useContext(UserContext);

  useOutsideClick(props.closeModal, ref);

  const handleChange = (event) => {
    setCampusName(event.target.value);
  };

  const postNewCampus = async (event) => {
    event.preventDefault();
    const config = {
      method: "post",
      url: `${baseUrl}/campuses`,
      data: {
        name: campusName
      },
      headers: {
        Authorization: userData.jwt,
        "Content-Type": "application/json"
      }
    };
    setLoading(true);
    try {
      const { status, data } = await axios(config);
      props.addNewCampusToList(data);
      setErrorMessage("");
      setCampusName("");
      setLoading(false);
      props.closeModal();
    } catch (err) {
      console.error(err);
      const stringErr = err.toString();
      if (stringErr.includes("409")) {
        setErrorMessage(dict("main/add-campus-modal/message/error/409"));
      } else if (stringErr.includes("400")) {
        setErrorMessage(dict("main/add-campus-modal/message/error/400"));
      } else if (stringErr.includes("500")) {
        setErrorMessage(dict("main/add-campus-modal/message/error/500"));
        console.error(stringErr);
      } else {
        setErrorMessage(
          `${dict("main/add-campus-modal/message/error/unknown")} ${stringErr}`
        );
        console.error(stringErr);
      }
      setTimeout(function () {
        setErrorMessage("");
      }, 3000);
      setSuccessMessage("");
      setLoading(false);
    }
  };

  return (
    <div className="addCampusWrapper">
      <p className="headerText">{dict("main/add-campus-modal/title")}</p>
      <div className="greyLine"></div>
      {loading ? (
        <div>
          <LoadingSpinner />
        </div>
      ) : (
        <div>
          <form
            id="newCampusSubmit"
            className="add-campus-form"
            onSubmit={postNewCampus}
          >
            <p
              className="formTitle"
              style={errorMessage ? { color: "red" } : null}
            >
              {dict("main/add-campus-modal/input-text")}
            </p>

            <input
              className="inputBox"
              type="text"
              value={campusName}
              onChange={handleChange}
              autoFocus={true}
              placeholder={dict("main/add-campus-modal/input-text")}
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
              <span style={{ fontWeight: "600" }}>
                {dict("main/add-campus-modal/button/cancel")}
              </span>
            </Button>

            <Button
              size="default"
              color="green"
              type="submit"
              form="newCampusSubmit"
              disabled={!campusName}
              width="70px"
            >
              <span style={{ fontWeight: "600" }}>
                {dict("main/add-campus-modal/button/create")}
              </span>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddCampus;
