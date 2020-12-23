import React from "react";
import { FaCheck, FaTimes } from "react-icons/fa";

import DotsIcon from "../../../../../SchoolAPP Assets/dots-horizontal.svg";
import Dropdown from "../../../../UI/Dropdown";
import ExtracurricularGroupDeleteModal from "./ExtracurricularGroupDeleteModal/ExtracurricularGroupDeleteModal";
import ExtracurricularMember from "./ExtracurricularMember/ExtracurricularMember";
import { updateAfterSchoolGroup } from "../../../../../services/afterSchoolGroupService";
import { useDict } from "../../../../UI/Translations";

import "./ExtracurricularGroup.css";

const ExtracurricularGroup = (props) => {
  const { findGroup, group, loadData } = props;

  const [displayDeleteModal, setDisplayDeleteModal] = React.useState(false);

  const [displayEditMenu, setDisplayEditMenu] = React.useState(false);

  const [displayRenameInput, setDisplayRenameInput] = React.useState(false);

  const [errorMessage, setErrorMessage] = React.useState("");

  const [renamedGroup, setRenamedGroup] = React.useState(group.name);

  const dict = useDict("/configuration-page/extracurricular");

  const editDropdownItems = [
    {
      onClick: () => setDisplayRenameInput(!displayRenameInput),
      value: dict("group/edit-dropdown/rename")
    },
    {
      onClick: () => setDisplayDeleteModal(!displayDeleteModal),
      value: dict("group/edit-dropdown/delete")
    }
  ];

  const entityCount = group.Students.length + group.Teachers.length;

  const handleRenameInputCancelClick = () => {
    setErrorMessage("");

    setRenamedGroup(group.name);

    setDisplayRenameInput(false);
  };

  const handleRenameInputChange = (e) => {
    setErrorMessage("");

    setRenamedGroup(e.target.value);
  };

  const handleRenameInputKeyPress = (e) => {
    if (e.key === "Enter") handleRenameInputSaveClick();
  };

  const handleRenameInputSaveClick = async () => {
    if (renamedGroup.trim() === "") {
      setErrorMessage(dict("group/message/error/empty"));
    } else if (!findGroup(renamedGroup)) {
      try {
        await updateAfterSchoolGroup({
          id: group.id,
          name: renamedGroup.trim()
        });

        setDisplayRenameInput(false);

        loadData();
      } catch (e) {
        setRenamedGroup(group.name);

        setErrorMessage(`${dict("group/message/error/api")} ${e.status}.`);
      }
    } else if (renamedGroup !== group.name) {
      setRenamedGroup(group.name);

      setErrorMessage(dict("group/message/error/exists"));
    } else {
      setDisplayRenameInput(false);
    }
  };

  return (
    <div className="extracurricular-campus-group-container">
      {!displayRenameInput ? (
        <div className="extracurricular-campus-group-header-container">
          <span className="extracurricular-campus-group-header-title-text">
            {renamedGroup}
          </span>

          <button
            className="extracurricular-campus-group-header-dots-button"
            id={`dots-${group.campusId}-${group.id}`}
            onClick={() => setDisplayEditMenu(true)}
          >
            <img
              alt="dots-icon"
              src={DotsIcon}
              style={{ marginBottom: "2px", minWidth: "16px" }}
            />
          </button>
        </div>
      ) : (
        <div className="extracurricular-campus-group-header-wrap-container">
          <div className="extracurricular-campus-group-header-container">
            <input
              className="extracurricular-campus-group-header-rename-input"
              onChange={handleRenameInputChange}
              onKeyPress={handleRenameInputKeyPress}
              style={
                errorMessage !== ""
                  ? {
                      borderColor: "#ff0000",
                      color: "#ff0000"
                    }
                  : null
              }
              type="text"
              value={renamedGroup}
            />

            <button
              className="extracurricular-campus-group-header-rename-cancel-button"
              onClick={handleRenameInputCancelClick}
            >
              <FaTimes size="16" />
            </button>

            <button
              className="extracurricular-campus-group-header-rename-save-button"
              onClick={handleRenameInputSaveClick}
            >
              <FaCheck size="16" />

              <span className="extracurricular-campus-group-header-rename-save-button-text">
                {"Save"}
              </span>
            </button>
          </div>

          <span className="extracurricular-campus-group-header-rename-error-text">
            {errorMessage}
          </span>
        </div>
      )}

      <div className="extracurricular-campus-group-members-container">
        <div className="extracurricular-campus-group-member-wrapper">
          <ExtracurricularMember
            link="/configuration-page/teachers"
            memberCount={group.Teachers.length}
            memberType={dict("group/member/type/teachers")}
          />
        </div>

        <div className="extracurricular-campus-group-member-wrapper">
          <ExtracurricularMember
            link="/students-page"
            memberCount={group.Students.length}
            memberType={dict("group/member/type/students")}
          />
        </div>
      </div>

      {displayEditMenu && (
        <Dropdown
          closeDropdown={() => setDisplayEditMenu(false)}
          dropdownItems={editDropdownItems}
          id={`dots-${group.campusId}-${group.id}`}
          style={{ fontSize: "14px", width: "190px" }}
        />
      )}

      {displayDeleteModal && (
        <ExtracurricularGroupDeleteModal
          closeDeleteModal={() => setDisplayDeleteModal(false)}
          entityCount={entityCount}
          loadData={loadData}
          groupId={group.id}
        />
      )}
    </div>
  );
};

export default ExtracurricularGroup;
