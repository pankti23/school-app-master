import React from "react";

import Button from "../../../../UI/Button";
import useOutsideClick from "../../../../../CustomHooks/useOutsideClick";
import { createAfterSchoolGroup } from "../../../../../services/afterSchoolGroupService";
import { useDict } from "../../../../UI/Translations";

import "./ExtracurricularCampusAddModal.css";

const ExtracurricularCampusAddModal = (props) => {
  const { campus, closeAddModal, findGroup, loadData } = props;

  const [errorMessage, setErrorMessage] = React.useState("");

  const [groupName, setGroupName] = React.useState("");

  const ref = React.useRef(null);

  const dict = useDict("/configuration-page/extracurricular");

  const handleCancelButtonClick = () => {
    closeAddModal();
  };

  const handleConfirmButtonClick = async () => {
    if (groupName.trim() === "") {
      setErrorMessage(dict("campus/add-modal/message/error/empty"));
    } else if (!findGroup(groupName)) {
      try {
        await createAfterSchoolGroup({
          campusId: campus.id,
          name: groupName.trim()
        });

        loadData();

        closeAddModal();
      } catch (e) {
        setErrorMessage(
          `${dict("campus/add-modal/message/error/api")} ${e.status}.`
        );
      }
    } else {
      setErrorMessage(dict("campus/add-modal/message/error/exists"));
    }
  };

  const handleInputChange = (e) => {
    setErrorMessage("");

    setGroupName(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") handleConfirmButtonClick();
  };

  useOutsideClick(closeAddModal, ref);

  return (
    <div className="extracurricular-campus-add-modal-wrapper">
      <div className="extracurricular-campus-add-modal-container" ref={ref}>
        <div className="extracurricular-campus-add-modal-top-container">
          <span className="extracurricular-campus-add-modal-top-text">
            {`${dict("campus/add-modal/title")} ${campus.name}`}
          </span>
        </div>

        <div className="extracurricular-campus-add-modal-divider" />

        <div className="extracurricular-campus-add-modal-middle-container">
          <div className="extracurricular-campus-add-modal-middle-input-container">
            <span className="extracurricular-campus-add-modal-middle-input-title-text">
              {dict("campus/add-modal/input")}
            </span>

            <input
              className="extracurricular-campus-add-modal-middle-input"
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
              placeholder={dict("campus/add-modal/input")}
              style={
                errorMessage !== ""
                  ? {
                      borderColor: "#ff0000",
                      color: "#ff0000"
                    }
                  : null
              }
              type="text"
              value={groupName}
            />

            {errorMessage !== "" && (
              <div className="extracurricular-campus-add-modal-middle-input-error-container">
                <span className="extracurricular-campus-add-modal-middle-input-error-text">
                  {dict("campus/add-modal/message/error/text")}
                </span>

                <span className="extracurricular-campus-add-modal-middle-input-error-text">
                  {errorMessage}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="extracurricular-campus-add-modal-divider" />

        <div className="extracurricular-campus-add-modal-bottom-container">
          <Button
            color="white"
            onClick={handleCancelButtonClick}
            size="medium"
            style={{ marginRight: "12px" }}
            width="70px"
          >
            <span className="extracurricular-campus-add-modal-bottom-cancel-button-text">
              {dict("campus/add-modal/button/cancel")}
            </span>
          </Button>

          <Button
            color="green"
            onClick={handleConfirmButtonClick}
            size="medium"
            width="70px"
          >
            <span className="extracurricular-campus-add-modal-bottom-confirm-button-text">
              {dict("campus/add-modal/button/confirm")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularCampusAddModal;
