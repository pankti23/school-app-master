import React from "react";
import "./DeleteRename.css";

import { useDict } from "../../../../UI/Translations";

const DeleteRename = () => {
  const dict = useDict("/configuration-page/school");

  return (
    <div className="config-delete-rename-container">
      <div
        role="button"
        tabIndex={0}
        className="config-school-delete-button"
        onClick={() => console.log("delete")}
      >
        <p className="config-school-delete-rename-text">
          {dict("main/button/delete")}
        </p>
      </div>
      <div
        role="button"
        tabIndex={0}
        className="config-school-rename-button"
        onClick={() => console.log("rename")}
      >
        <p className="config-school-delete-rename-text">
          {dict("main/button/rename")}
        </p>
      </div>
    </div>
  );
};

export default DeleteRename;
