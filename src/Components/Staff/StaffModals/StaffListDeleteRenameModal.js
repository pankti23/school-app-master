import React, {useState} from 'react';

import { useDict } from "../../UI/Translations"

const StaffListDeleteRename = props => {
    const dict = useDict("/staff-members-page")

    return (
        <div className="config-delete-rename-container">
            <div
                role="button"
                tabIndex={0}
                className="config-school-delete-button"
                onClick={() => props.handleDeleteRenameResendSingleItem("delete", props.userId)}
            >
                <p className="config-school-delete-rename-text">{dict("staff-table/body/button/delete")}</p>
            </div>
            <div
                role="button"
                tabIndex={0}
                className="config-school-rename-button"
                onClick={() => props.handleDeleteRenameResendSingleItem("edit", props.userId)}
            >
                <p className="config-school-delete-rename-text">{dict("staff-table/body/button/modify")}</p>
            </div>
            <div
                role="button"
                tabIndex={0}
                className="config-school-resend-button"
                onClick={() => props.handleDeleteRenameResendSingleItem("resend", props.userId)}
            >
                <p className="config-school-delete-rename-text">{dict("staff-table/body/button/resend")}</p>
            </div>
        </div>
    );
}

export default StaffListDeleteRename;
