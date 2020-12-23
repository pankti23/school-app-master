import React from 'react'
// modals
import { FormModal } from "../../../UI/AddStaffModal";

import '../TeachersConfig.css';

import { useDict } from "../../../UI/Translations"

const WarningIfSTNotInCampus = props => {

    const dict = useDict("/configuration-page/teachers")

    const warning = <div>
      {dict("main/message/error/not-in-campus")}
    </div>

    return (
        <FormModal
            open={props.isModalOpen}
            onClose={props.closeModal}
        >
            <div className="warning-exist-content-center">{warning}</div>
        </FormModal>
    );
}

export default WarningIfSTNotInCampus;
