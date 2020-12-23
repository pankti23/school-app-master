import React, { useRef } from "react";
import useOnClickOutside from "../../../CustomHooks/useOnClickOutside";
import Button from "../../UI/Button";

import { useDict } from "../../UI/Translations"

const ConfirmDeleteModal = ({ students, onConfirmDelete, closeModal }) => {
  const dict = useDict("/students-page")

  const ref = useRef();

  const close = () => closeModal();

  useOnClickOutside(ref, close);

  return (
    <div className="invite-new-modal-wrapper">
      <div ref={ref} className="invite-new-modal-container">
          <div className="invite-new-modal-header">
            <p>{dict("delete-modal/title")}</p>
          </div>

          <div className="invite-new-modal-content">
            {students.map((student) => student.name).join(', ')}
          </div>

          <div className="invite-new-modal-bottom">
            <Button size="default"
              color="white"
              margin="0 15px 0 0"
              onClick={close}>{dict("delete-modal/button/cancel")}</Button>
            <Button size="default"
              onClick={onConfirmDelete}
              color="green">{dict("delete-modal/button/confirm")}</Button>
          </div>

      </div>
    </div>
  );
};

export default ConfirmDeleteModal;
