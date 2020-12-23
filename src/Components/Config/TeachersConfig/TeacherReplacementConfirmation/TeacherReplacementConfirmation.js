import React from "react";

import { FormModal } from "../../../UI/AddStaffModal";
import { useDict } from "../../../UI/Translations"

const TeacherReplacementConfirmation = (props) => {
  const { display, handleClose, handleConfirm } = props;

  const dict = useDict("/configuration-page/teachers")

  return (
    <FormModal open={display} onClose={handleClose}>
      <div className="warning-exist-content-center">
        {dict("main-teachers/replace-modal/title")}
      </div>

      <div className="modal-footer">
        <div class="buttons">
          <button class="cancelButton" type="button" onClick={handleClose}>
            {dict("main-teachers/replace-modal/button/cancel")}
          </button>

          <button class="createButton" onClick={handleConfirm}>
            {dict("main-teachers/replace-modal/button/confirm")}
          </button>
        </div>
      </div>
    </FormModal>
  );
};

export default TeacherReplacementConfirmation;
