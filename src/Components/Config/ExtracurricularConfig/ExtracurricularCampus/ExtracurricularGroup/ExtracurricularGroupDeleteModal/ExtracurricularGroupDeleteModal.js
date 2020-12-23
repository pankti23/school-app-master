import React from "react";

import Button from "../../../../../UI/Button";
import useOutsideClick from "../../../../../../CustomHooks/useOutsideClick";
import { removeAfterSchoolGroup } from "../../../../../../services/afterSchoolGroupService";
import { useDict } from "../../../../../UI/Translations"

import "./ExtracurricularGroupDeleteModal.css";

const ExtracurricularGroupDeleteModal = (props) => {
  const { closeDeleteModal, entityCount, loadData, groupId } = props;

  const [errorMessage, setErrorMessage] = React.useState("");

  const ref = React.useRef(null);

  const dict = useDict("/configuration-page/extracurricular")

  const handleCancelButtonClick = () => {
    closeDeleteModal();
  };

  const handleConfirmButtonClick = async () => {
    if (entityCount > 0) {
      setErrorMessage(dict("group/delete-modal/message/error/exists"));
    } else {
      try {
        await removeAfterSchoolGroup(groupId);

        loadData();

        closeDeleteModal();
      } catch (e) {
        setErrorMessage(`${dict("group/delete-modal/message/error/api")} ${e.status}.`);
      }
    }
  };

  useOutsideClick(closeDeleteModal, ref);

  return (
    <div className="extracurricular-group-delete-modal-wrapper">
      <div className="extracurricular-group-delete-modal-container" ref={ref}>
        <div className="extracurricular-group-delete-modal-top-container">
          <span className="extracurricular-group-delete-modal-top-text">
            {dict("group/delete-modal/title")}
          </span>

          {errorMessage !== "" && (
            <div className="extracurricular-group-delete-modal-top-error-container">
              <span className="extracurricular-group-delete-modal-top-error-text">
                {dict("group/delete-modal/message/error/text")}
              </span>

              <span className="extracurricular-group-delete-modal-top-error-text">
                {errorMessage}
              </span>
            </div>
          )}
        </div>

        <div className="extracurricular-group-delete-modal-divider" />

        <div className="extracurricular-group-delete-modal-bottom-container">
          <Button
            color="white"
            onClick={handleCancelButtonClick}
            size="medium"
            style={{ marginRight: "12px" }}
            width="70px"
          >
            <span className="extracurricular-group-delete-modal-bottom-cancel-button-text">
              {dict("group/delete-modal/button/cancel")}
            </span>
          </Button>

          <Button
            color="green"
            onClick={handleConfirmButtonClick}
            size="medium"
            width="70px"
          >
            <span className="extracurricular-group-delete-modal-bottom-confirm-button-text">
              {dict("group/delete-modal/button/confirm")}
            </span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ExtracurricularGroupDeleteModal;
