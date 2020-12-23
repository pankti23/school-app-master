import React from 'react'
// modals
import { FormModal } from "../../../UI/AddStaffModal";
import { useDict } from "../../../UI/Translations"

import '../TeachersConfig.css';

const WarningIfAlreadyAdded = props => {

    const { selectedMainTeacher } = props;

    const dict = useDict("/configuration-page/teachers")

    const groups = selectedMainTeacher && selectedMainTeacher.Groups && selectedMainTeacher.Groups.length > 0 ? selectedMainTeacher.Groups.map((group) => group.name) : [];

    const mainTeacher_span = <span style={{ fontWeight: 800 }}>{`${selectedMainTeacher?.name}(${selectedMainTeacher?.email})`}</span>
    const groups_span = <span style={{ fontWeight: 800 }}>{groups.join(', ')}</span>
    const warning = <div>
      {dict("main-teachers/already-added-modal/title")[0]} {mainTeacher_span} {dict("main-teachers/already-added-modal/title")[1]} {groups_span}. {dict("main-teachers/already-added-modal/title")[2]}
    </div>

    return (
        <FormModal
            open={props.isModalOpen}
            onClose={props.closeModal}
        >
            <div className="warning-exist-content-center">{selectedMainTeacher && warning}</div>

            <div className="modal-footer">
              <div class="buttons">
                <button class="cancelButton" type="button" onClick={props.closeModal}>
                  {dict("main-teachers/already-added-modal/button/cancel")}
                </button>

                <button class="createButton" onClick={props.handleAdd}>
                  {dict("main-teachers/already-added-modal/button/confirm")}
                </button>
              </div>
      </div>
        </FormModal>
    );
}

export default WarningIfAlreadyAdded;
