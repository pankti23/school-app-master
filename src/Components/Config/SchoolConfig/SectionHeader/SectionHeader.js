import React, { useState, useContext, useRef } from "react";
import "./SectionHeader.css";
import { UserContext } from "../../../../Contexts/UserContext";
import axios from "axios";
import DotsIcon from "../../../../SchoolAPP Assets/dots-horizontal.svg";
import PlusSign from "../../../../SchoolAPP Assets/BlackPlus";
import Button from "../../../UI/Button";
import MinimizeButton from "../../../UI/MinimizeButton";
import { FaCheck } from "react-icons/fa";
import useOutsideClick from "../../../../CustomHooks/useOutsideClick";

import Dropdown from "../../../UI/Dropdown";
import { useDict } from "../../../UI/Translations";

const baseUrl = process.env.REACT_APP_BASE_URL;

const SectionHeader = (props) => {
  const [openModal, setOpenModal] = useState(false);
  const [confirmDeleteModal, setConfirmDeleteModal] = useState(false);
  const [newCampusName, setNewCampusName] = useState(props.campus.name);
  const [renameInput, setRenameInput] = useState(props.campus.name);
  const [openTextBox, setOpenTextBox] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const dict = useDict("/configuration-page/school");

  const editDropdownItems = [
    {
      onClick: () => setOpenTextBox(!openTextBox),
      value: dict("main/button/rename")
    },
    {
      onClick: () => setConfirmDeleteModal(true),
      value: dict("main/button/delete")
    }
  ];

  const userData = useContext(UserContext);

  const refDelete = useRef();
  useOutsideClick(() => setConfirmDeleteModal(false), refDelete);

  const checkDelete = () => {
    if (props.type === dict("main/type/campus")) {
      const checkLevels = props.levelsLength.filter(
        (levelLength) => props.campus.id === levelLength.campusId
      );
      if (checkLevels.length) {
        props.errorMessageHandler(true);
        setConfirmDeleteModal(false);
        setErrorMessage(dict("campus/message/error/campus-not-empty-2"));
        setTimeout(function () {
          setErrorMessage("");
        }, 3000);
      } else {
        props.deleteCampus(props.campus.id, props.levelsLength.length);
        props.errorMessageHandler(false);
      }
    } else if (props.type === dict("main/type/level")) {
      const checkLevels = props.gradesLength.filter(
        (gradeLength) => props.campus.id === gradeLength.levelId
      );
      if (checkLevels.length) {
        setConfirmDeleteModal(false);
        setErrorMessage(dict("campus/message/error/level-not-empty-2"));
        setTimeout(function () {
          setErrorMessage("");
        }, 3000);
        props.errorMessageHandler(true);
      } else {
        props.deleteLevel(props.campus.id, checkLevels.length);
        props.errorMessageHandler(false);
      }
    } else if (props.type === dict("main/type/grade")) {
      const checkLevels = props.groupsLength.filter(
        (groupLength) => props.campus.id === groupLength.gradeId
      );
      if (checkLevels.length) {
        setConfirmDeleteModal(false);
        setErrorMessage(dict("campus/message/error/grade-not-empty"));
        setTimeout(function () {
          setErrorMessage("");
        }, 3000);
        props.errorMessageHandler(true);
      } else {
        props.deleteGrade(props.campus.id, checkLevels.length);
        props.errorMessageHandler(false);
      }
    } else if (props.type === dict("main/type/group")) {
      const checkGroup = props.groupingsLength;
      if (!checkGroup) {
        setConfirmDeleteModal(false);
        props.deleteGroup(props.campus.id, true);
        props.errorMessageHandler(false);
        setErrorMessage(dict("campus/message/error/grouping-not-empty"));
        setTimeout(function () {
          setErrorMessage("");
        }, 3000);
      } else {
        console.log(checkGroup);
        props.errorMessageHandler(true);
      }
    }
  };

  const saveNewName = async (event) => {
    event.preventDefault ? event.preventDefault() : (event.returnValue = false);
    if (props.type === dict("main/type/campus")) {
      const putConfig = {
        method: "put",
        data: {
          ...props.campus,
          name: renameInput
        },
        url: `${baseUrl}/campuses/${props.campus.id}`,
        headers: {
          Authorization: userData.jwt,
          "Content-Type": "application/json"
        }
      };
      try {
        const postData = await axios(putConfig);
        props.setNewCampusName(renameInput);
        setNewCampusName(renameInput);
        setOpenTextBox(false);
      } catch (err) {
        const stringErr = err.toString();
        if (stringErr.includes("409")) {
          setErrorMessage(dict("campus/message/error/409"));
        } else if (stringErr.includes("400")) {
          setErrorMessage(dict("campus/message/error/400"));
        } else if (stringErr.includes("500")) {
          setErrorMessage(dict("campus/message/error/500"));
          console.error(stringErr);
        } else {
          setErrorMessage(`${dict("campus/message/error/500")}: ${stringErr}`);
          console.error(stringErr);
        }
        setTimeout(function () {
          setErrorMessage("");
        }, 3000);
        console.error(stringErr);
      }
    } else {
      const putConfig = {
        method: "put",
        data: {
          name: renameInput
        },
        url: `${baseUrl}/${props.typeEn}s/${props.campus.id}`,
        headers: {
          Authorization: userData.jwt,
          "Content-Type": "application/json"
        }
      };
      console.log("else put", putConfig);
      try {
        const postData = await axios(putConfig);
        setOpenTextBox(false);
        if (props.type === dict("main/type/level")) {
          props.setNewLevelName(renameInput);
        } else if (props.type === dict("main/type/grade")) {
          props.setNewGradeName(renameInput);
        }
        setNewCampusName(renameInput);
      } catch (err) {
        const stringErr = err.toString();
        if (stringErr.includes("409")) {
          setErrorMessage(dict("campus/message/error/409"));
        } else if (stringErr.includes("400")) {
          setErrorMessage(dict("campus/message/error/400"));
        } else if (stringErr.includes("500")) {
          setErrorMessage(dict("campus/message/error/500"));
          console.error(stringErr);
        } else {
          setErrorMessage(`${dict("campus/message/error/500")}: ${stringErr}`);
          console.error(stringErr);
        }
        setTimeout(function () {
          setErrorMessage("");
        }, 3000);
        console.error(stringErr);
      }
    }
  };

  console.log(newCampusName)

  return (
    <div
      className="config-section-header"
      style={{ marginBottom: props.minimized ? 0 : 20 }}
    >
      {openTextBox ? (
        <form
          className="rename-wrapper"
          onSubmit={(event) => saveNewName(event)}
        >
          <input
            style={errorMessage ? { borderColor: "red", color: "red" } : null}
            type="text"
            className="login-input section-header-input"
            value={renameInput}
            onChange={(e) => setRenameInput(e.target.value)}
          />{" "}
          <span
            onClick={() => {
              setRenameInput(newCampusName);
              setOpenTextBox(!openTextBox);
            }}
          >
            <span className="save-button-rename">
              <PlusSign
                fill="#000000"
                width="20px"
                height="20px"
                stroke="none"
                style={{ transform: "rotate(45deg)", cursor: "pointer" }}
              />
            </span>
          </span>
          <span
            className="save-button-rename"
            onClick={(event) => saveNewName(event)}
          >
            <FaCheck className="header-save-icon" />
            <span className="save-button-text">Save</span>
          </span>
          <span className="section-header-error-message">{errorMessage}</span>
        </form>
      ) : (
        <div className="config-header">
          <p className={`config-${props.typeEn} config-header-spacing`}>
            <span style={{ marginRight: "8px" }}>{newCampusName}</span>

            <button
              className="extracurricular-campus-group-header-dots-button"
              id={`dots-${props.typeId}`}
              onClick={() => setOpenModal(true)}
            >
              <img
                alt="dots-icon"
                src={DotsIcon}
                style={{ marginBottom: "2px", minWidth: "16px" }}
              />
            </button>
            <span className="section-header-error-message">{errorMessage}</span>
          </p>

          <MinimizeButton
            handleClick={() => props.onMinimizeClick(!props.minimized)}
            minimized={props.minimized}
            style={{ bgcolor: "transparent" }}
          />
        </div>
      )}

      {confirmDeleteModal ? (
        <div className="confirm-section-header-school-config">
          <div className="delete-confirmation-modal-container" ref={refDelete}>
            <p className="delete-confirmation-modal-header-text">
              {`${dict("campus/delete-confirmation")} ${props.type}?`}
            </p>
            <div className="grey-line"></div>
            <div className="buttons-container" style={{ margin: "15px 30px" }}>
              <Button
                size="default"
                color="white"
                margin="0 15px 0 0"
                onClick={() => setConfirmDeleteModal(false)}
              >
                {dict("campus/button/cancel")}
              </Button>
              <Button size="default" color="green" onClick={checkDelete}>
                {dict("campus/button/confirm")}
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {openModal && (
        <Dropdown
          closeDropdown={() => setOpenModal(false)}
          dropdownItems={editDropdownItems}
          id={`dots-${props.typeId}`}
          style={{ fontSize: "14px", width: "190px" }}
        />
      )}
    </div>
  );
};

export default SectionHeader;
